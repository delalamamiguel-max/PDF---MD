import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { reprocessSchema } from "@/lib/validation";
import { getDocumentById } from "@/lib/repositories/documents";
import { runIngestionPipeline } from "@/lib/ingestion/pipeline";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const input = reprocessSchema.parse(body);

  const doc = await getDocumentById(id, userId);
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
