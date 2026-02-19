import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { runIngestionPipeline } from "@/lib/ingestion/pipeline";
import { getDocumentById } from "@/lib/repositories/documents";

const schema = z.object({
  documentId: z.string().uuid(),
  reason: z.string().min(2).max(200).optional()
});

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const input = schema.parse(body);

  const doc = await getDocumentById(input.documentId, userId);
  if (!doc || !doc.blob_pdf_url) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await runIngestionPipeline({
    documentId: doc.id,
    userId,
    title: doc.title,
    sourceFilename: doc.source_filename,
    uploadedAt: doc.created_at,
    pdfUrl: doc.blob_pdf_url,
    reprocessReason: input.reason
  });

  return NextResponse.json({ ok: true });
}
