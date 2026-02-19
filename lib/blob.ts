import { put } from "@vercel/blob";
import { AppError } from "@/lib/errors";

function assertBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new AppError("Blob storage is not configured", "BLOB_CONFIG_ERROR", 500);
  }
}

export async function uploadPdfBlob(input: { userId: string; documentId: string; file: File }) {
  assertBlobToken();
  const pathname = `users/${input.userId}/documents/${input.documentId}/source/${input.file.name}`;
  const blob = await put(pathname, input.file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return blob.url;
}

export async function uploadMarkdownBlob(input: { userId: string; documentId: string; markdown: string; title: string }) {
  assertBlobToken();
  const safeTitle = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const pathname = `users/${input.userId}/documents/${input.documentId}/markdown/${safeTitle || "document"}.md`;
  const blob = await put(pathname, input.markdown, {
    contentType: "text/markdown; charset=utf-8",
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return blob.url;
}
