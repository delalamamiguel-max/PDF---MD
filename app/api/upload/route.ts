import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadPdfBlob } from "@/lib/blob";
import { createDocument, setDocumentPdfUrl } from "@/lib/repositories/documents";
import { getFolderForUser } from "@/lib/repositories/folders";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") || "Untitled document").trim();
  const folderId = String(formData.get("folderId") || "").trim() || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }

  if (folderId) {
    const folder = await getFolderForUser({ folderId, userId });
    if (!folder) {
      return NextResponse.json({ error: "Folder not found." }, { status: 404 });
    }
  }

  const doc = await createDocument({
    userId,
    title,
    folderId,
    sourceFilename: file.name,
    status: "Processing"
  });

  await sql`
    INSERT INTO document_status_events (document_id, stage, status, message)
    VALUES (${doc.id}, 'upload', 'Processing', 'Uploading PDF')
  `;

  const pdfUrl = await uploadPdfBlob({ userId, documentId: doc.id, file });
  await setDocumentPdfUrl(doc.id, pdfUrl);

  await sql`
    INSERT INTO document_status_events (document_id, stage, status, message)
    VALUES (${doc.id}, 'upload', 'Processing', 'PDF uploaded')
  `;

  return NextResponse.json({ id: doc.id, status: doc.status });
}
