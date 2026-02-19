import { sql } from "@/lib/db";

export type DocumentStatus = "Processing" | "Ready" | "Failed";

export type DocumentRecord = {
  id: string;
  user_id: string;
  title: string;
  source_filename: string;
  blob_pdf_url: string | null;
  blob_md_url: string | null;
  status: DocumentStatus;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
  updated_at: string;
};

export type DocumentMetadata = {
  id: string;
  document_id: string;
  summary: string | null;
  topics: string[];
  tags: string[];
  schema_version: string;
  embedding_version: string;
  page_count: number | null;
  created_at: string;
  updated_at: string;
};

export async function createDocument(input: {
  userId: string;
  title: string;
  sourceFilename: string;
  status?: DocumentStatus;
}) {
  const rows = (await sql`
    INSERT INTO documents (user_id, title, source_filename, status)
    VALUES (${input.userId}, ${input.title}, ${input.sourceFilename}, ${input.status ?? "Processing"})
    RETURNING *
  `) as DocumentRecord[];

  const doc = rows[0];
  await sql`
    INSERT INTO doc_metadata (document_id, summary, topics, tags, schema_version, embedding_version, page_count)
    VALUES (${doc.id}, NULL, ARRAY[]::text[], ARRAY[]::text[], '1.0.0', '0.0.0', NULL)
  `;
  return doc;
}

export async function setDocumentPdfUrl(documentId: string, pdfUrl: string) {
  await sql`
    UPDATE documents
    SET blob_pdf_url = ${pdfUrl}, updated_at = now()
    WHERE id = ${documentId}
  `;
}

export async function setDocumentStatus(input: {
  documentId: string;
  status: DocumentStatus;
  errorCode?: string | null;
  errorMessage?: string | null;
}) {
  await sql`
    UPDATE documents
    SET status = ${input.status},
        error_code = ${input.errorCode ?? null},
        error_message = ${input.errorMessage ?? null},
        updated_at = now()
    WHERE id = ${input.documentId}
  `;
}

export async function completeDocumentProcessing(input: {
  documentId: string;
  markdownUrl: string;
  summary: string;
  topics: string[];
  tags: string[];
  pageCount: number | null;
}) {
  await sql`
    UPDATE documents
    SET blob_md_url = ${input.markdownUrl},
        status = 'Ready',
        error_code = NULL,
        error_message = NULL,
        processed_at = now(),
        updated_at = now()
    WHERE id = ${input.documentId}
  `;

  await sql`
    UPDATE doc_metadata
    SET summary = ${input.summary},
        topics = ${input.topics},
        tags = ${input.tags},
        schema_version = '1.0.0',
        embedding_version = '0.0.0',
        page_count = ${input.pageCount},
        updated_at = now()
    WHERE document_id = ${input.documentId}
  `;
}

export async function getDocumentById(documentId: string, userId: string) {
  const rows = (await sql`
    SELECT d.*, m.summary, m.topics, m.tags, m.schema_version, m.embedding_version, m.page_count
    FROM documents d
    LEFT JOIN doc_metadata m ON m.document_id = d.id
    WHERE d.id = ${documentId} AND d.user_id = ${userId}
    LIMIT 1
  `) as (DocumentRecord & {
    summary: string | null;
    topics: string[];
    tags: string[];
    schema_version: string | null;
    embedding_version: string | null;
    page_count: number | null;
  })[];

  return rows[0] ?? null;
}

export async function listDocuments(input: {
  userId: string;
  status?: DocumentStatus;
  q?: string;
  tag?: string;
  from?: string;
  to?: string;
}) {
  const rows = (await sql`
    SELECT d.*, m.summary, m.topics, m.tags
    FROM documents d
    LEFT JOIN doc_metadata m ON m.document_id = d.id
    WHERE d.user_id = ${input.userId}
      AND (${input.status ?? null}::text IS NULL OR d.status = ${input.status ?? null})
      AND (${input.tag ?? null}::text IS NULL OR ${input.tag ?? null} = ANY(m.tags))
      AND (${input.from ?? null}::timestamptz IS NULL OR d.created_at >= ${input.from ?? null}::timestamptz)
      AND (${input.to ?? null}::timestamptz IS NULL OR d.created_at <= ${input.to ?? null}::timestamptz)
      AND (
        ${input.q ?? null}::text IS NULL
        OR d.title ILIKE ${`%${input.q ?? ""}%`}
        OR COALESCE(m.summary, '') ILIKE ${`%${input.q ?? ""}%`}
        OR EXISTS (
          SELECT 1
          FROM unnest(COALESCE(m.tags, ARRAY[]::text[])) AS t(tag)
          WHERE t.tag ILIKE ${`%${input.q ?? ""}%`}
        )
      )
    ORDER BY d.created_at DESC
  `) as (DocumentRecord & { summary: string | null; topics: string[]; tags: string[] })[];

  return rows;
}

export async function deleteDocument(documentId: string, userId: string) {
  const rows = (await sql`
    DELETE FROM documents WHERE id = ${documentId} AND user_id = ${userId}
    RETURNING id
  `) as { id: string }[];

  return rows[0] ?? null;
}
