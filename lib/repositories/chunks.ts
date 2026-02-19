import { sql } from "@/lib/db";

export type CitationResult = {
  doc_id: string;
  heading: string;
  snippet: string;
  stable_anchor: string;
};

export async function upsertDocChunks(input: { documentId: string; chunks: Array<{ heading: string; anchor: string; text: string }> }) {
  await sql`DELETE FROM doc_chunks WHERE document_id = ${input.documentId}`;

  for (const chunk of input.chunks) {
    await sql`
      INSERT INTO doc_chunks (document_id, heading, stable_anchor, chunk_text, embedding_vector)
      VALUES (${input.documentId}, ${chunk.heading}, ${chunk.anchor}, ${chunk.text}, NULL)
    `;
  }
}

export async function retrieveCitations(input: { userId: string; query: string; documentId?: string; limit?: number }) {
  const rows = (await sql`
    SELECT d.id AS doc_id,
           c.heading,
           LEFT(c.chunk_text, 260) AS snippet,
           c.stable_anchor
    FROM doc_chunks c
    JOIN documents d ON d.id = c.document_id
    WHERE d.user_id = ${input.userId}
      AND (${input.documentId ?? null}::uuid IS NULL OR d.id = ${input.documentId ?? null}::uuid)
      AND c.chunk_text ILIKE ${`%${input.query}%`}
    ORDER BY d.created_at DESC
    LIMIT ${input.limit ?? 5}
  `) as CitationResult[];

  return rows;
}
