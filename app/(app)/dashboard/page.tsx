import Link from "next/link";
import { DocumentsTable } from "@/components/docs/documents-table";
import { FolderManager } from "@/components/docs/folder-manager";
import { Button } from "@/components/ui/button";
import { listDocuments } from "@/lib/repositories/documents";
import { listFoldersForUser } from "@/lib/repositories/folders";
import { requireUser } from "@/lib/session";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ status?: "Processing" | "Ready" | "Failed"; q?: string; tag?: string; folderId?: string; from?: string; to?: string }>;
}) {
  const { userId } = await requireUser();
  const filters = await searchParams;
  const folders = await listFoldersForUser(userId);

  const docs = await listDocuments({
    userId,
    status: filters.status,
    q: filters.q,
    tag: filters.tag,
    folderId: filters.folderId,
    from: filters.from,
    to: filters.to
  });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Library</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Calm visibility over your document ingestion pipeline.</p>
        </div>
        <Link href="/upload">
          <Button>Upload a PDF</Button>
        </Link>
      </div>

      <FolderManager initialFolders={folders} />
      <DocumentsTable items={docs} folders={folders.map((folder) => ({ id: folder.id, name: folder.name }))} />
    </section>
  );
}
