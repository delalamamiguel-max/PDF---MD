import pdf from "pdf-parse";

export async function extractTextFromPdfArrayBuffer(buffer: ArrayBuffer) {
  const data = await pdf(Buffer.from(buffer));
  return {
    text: data.text?.trim() ?? "",
    pageCount: data.numpages ?? null
  };
}
