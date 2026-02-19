import { notFound } from "next/navigation";
import { DocumentActions } from "@/components/docs/document-actions";
import { DocumentDetailTabs } from "@/components/docs/document-detail-tabs";
import { getDocumentById } from "@/lib/repositories/documents";
import { requireUser } from "@/lib/session";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireUser();
  const { id } = await params;

  const doc = await getDocumentById(id, userId);
  if (!doc) {
    notFound();
  }

  let markdown: string | null = null;
  if (doc.blob_md_url) {
    const response = await fetch(doc.blob_md_url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN ?? ""}`
      },
      cache: "no-store"
    });

    if (response.ok) {
      markdown = await response.text();
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{doc.title}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Source file: {doc.source_filename}</p>
        </div>
        <DocumentActions docId={doc.id} />
      </div>

      <DocumentDetailTabs
        id={doc.id}
        summary={doc.summary}
        topics={doc.topics ?? []}
        tags={doc.tags ?? []}
        status={doc.status}
        schemaVersion={doc.schema_version}
        embeddingVersion={doc.embedding_version}
        pageCount={doc.page_count}
        markdown={markdown}
        errorMessage={doc.error_message}
      />
    </section>
  );
}
