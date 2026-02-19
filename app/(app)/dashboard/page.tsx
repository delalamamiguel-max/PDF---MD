import Link from "next/link";
import { DocumentsTable } from "@/components/docs/documents-table";
import { Button } from "@/components/ui/button";
import { listDocuments } from "@/lib/repositories/documents";
import { requireUser } from "@/lib/session";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ status?: "Processing" | "Ready" | "Failed"; q?: string; tag?: string; from?: string; to?: string }>;
}) {
  const { userId } = await requireUser();
  const filters = await searchParams;

  const docs = await listDocuments({
    userId,
    status: filters.status,
    q: filters.q,
    tag: filters.tag,
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

      <DocumentsTable items={docs} />
    </section>
  );
}
