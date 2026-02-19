import { logger } from "@/lib/logger";
import { AppError } from "@/lib/errors";
import { sql } from "@/lib/db";
import { extractTextFromPdfArrayBuffer } from "@/lib/ingestion/extract";
import { normalizeStructure } from "@/lib/ingestion/normalize";
import { generateMarkdownArtifact } from "@/lib/ingestion/markdown";
import type { IngestionContext } from "@/lib/ingestion/types";
import { completeDocumentProcessing, setDocumentStatus } from "@/lib/repositories/documents";
import { upsertDocChunks } from "@/lib/repositories/chunks";
import { uploadMarkdownBlob } from "@/lib/blob";

async function writeStatusEvent(input: { documentId: string; stage: string; status: "Processing" | "Ready" | "Failed"; message?: string }) {
  await sql`
    INSERT INTO document_status_events (document_id, stage, status, message)
    VALUES (${input.documentId}, ${input.stage}, ${input.status}, ${input.message ?? null})
  `;
}

export async function runIngestionPipeline(input: IngestionContext) {
  logger.info("ingestion.started", { documentId: input.documentId, userId: input.userId });

  try {
    await setDocumentStatus({ documentId: input.documentId, status: "Processing" });
    await writeStatusEvent({ documentId: input.documentId, stage: "extract", status: "Processing", message: "Extracting text" });

    const pdfResponse = await fetch(input.pdfUrl);
    if (!pdfResponse.ok) {
      throw new AppError("Could not fetch source PDF for processing.", "PDF_FETCH_FAILED", 500);
    }

    const buffer = await pdfResponse.arrayBuffer();
    const extracted = await extractTextFromPdfArrayBuffer(buffer);
    if (!extracted.text.trim()) {
      throw new AppError(
        "We could not extract clean text. This might be a scan. Try reprocessing with OCR mode.",
        "PDF_NO_TEXT",
        422
      );
    }

    logger.info("ingestion.extract.completed", { documentId: input.documentId, pageCount: extracted.pageCount });
    await writeStatusEvent({ documentId: input.documentId, stage: "normalize", status: "Processing", message: "Normalizing structure" });

    const normalizedSections = normalizeStructure(extracted.text);
    await upsertDocChunks({
      documentId: input.documentId,
      chunks: normalizedSections.map((section) => ({
        heading: section.heading,
        anchor: section.anchor,
        text: section.content
      }))
    });

    logger.info("ingestion.normalize.completed", { documentId: input.documentId, sections: normalizedSections.length });
    await writeStatusEvent({ documentId: input.documentId, stage: "markdown", status: "Processing", message: "Generating markdown" });

    const artifact = generateMarkdownArtifact({
      context: input,
      sections: normalizedSections,
      pageCount: extracted.pageCount
    });

    const mdUrl = await uploadMarkdownBlob({
      userId: input.userId,
      documentId: input.documentId,
      markdown: artifact.markdown,
      title: input.title
    });

    logger.info("ingestion.markdown.completed", { documentId: input.documentId, markdownUrl: mdUrl });
    await writeStatusEvent({
      documentId: input.documentId,
      stage: "embeddings",
      status: "Processing",
      message: "Embeddings scaffolded for V1"
    });

    await completeDocumentProcessing({
      documentId: input.documentId,
      markdownUrl: mdUrl,
      summary: artifact.summary,
      topics: artifact.topics,
      tags: artifact.tags,
      pageCount: artifact.pageCount
    });

    await writeStatusEvent({ documentId: input.documentId, stage: "complete", status: "Ready", message: "Document ready" });
    logger.info("ingestion.completed", { documentId: input.documentId });

    return { ok: true, markdownUrl: mdUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingestion failure";
    const code = error instanceof AppError ? error.code : "INGESTION_ERROR";

    logger.error("ingestion.failed", { documentId: input.documentId, error: message, code });
    await setDocumentStatus({ documentId: input.documentId, status: "Failed", errorCode: code, errorMessage: message });
    await writeStatusEvent({ documentId: input.documentId, stage: "failed", status: "Failed", message });

    throw error;
  }
}
