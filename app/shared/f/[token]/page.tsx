import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getFolderByAccessToken } from "@/lib/repositories/folders";
import { listPublicFolderDocuments } from "@/lib/repositories/documents";
import { formatDate } from "@/lib/utils";

export default async function SharedFolderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const folder = await getFolderByAccessToken(token);

  if (!folder || folder.visibility === "private") {
    notFound();
  }

  const docs = await listPublicFolderDocuments(folder.id);

  return (
    <main className="studio-container py-10 space-y-4">
      <h1 className="text-3xl font-semibold">{folder.name}</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Shared folder ({folder.visibility}).</p>
      <Card>
        <ul className="space-y-3">
          {docs.map((doc) => (
            <li key={doc.public_token} className="flex items-center justify-between gap-3 border-b border-[var(--muted)] pb-3 last:border-0">
              <div>
                <p className="font-medium">{doc.title}</p>
                <p className="text-sm text-[var(--muted-foreground)]">Uploaded {formatDate(doc.created_at)}</p>
              </div>
              <div className="flex gap-3 text-sm">
                {doc.blob_md_url ? <Link className="text-[var(--primary)]" href={doc.blob_md_url}>Markdown</Link> : null}
                {doc.blob_pdf_url ? <Link className="text-[var(--primary)]" href={doc.blob_pdf_url}>PDF</Link> : null}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
