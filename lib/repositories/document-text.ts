import { sql } from "@/lib/db";

export async function upsertDocumentExtractedText(input: { documentId: string; extractedText: string }) {
  await sql`
    INSERT INTO document_text_contents (document_id, extracted_text, updated_at)
    VALUES (${input.documentId}, ${input.extractedText}, now())
    ON CONFLICT (document_id)
    DO UPDATE SET extracted_text = EXCLUDED.extracted_text, updated_at = now()
  `;
}
