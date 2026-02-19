import { UploadForm } from "@/components/upload/upload-form";
import { listFoldersForUser } from "@/lib/repositories/folders";
import { requireUser } from "@/lib/session";

export default async function UploadPage() {
  const { userId } = await requireUser();
  const folders = await listFoldersForUser(userId);

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold">Upload a PDF</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Bring one document and we&apos;ll structure it into usable knowledge.</p>
      {folders.length ? (
        <UploadForm folders={folders.map((folder) => ({ id: folder.id, name: folder.name }))} />
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">Create a folder in the Library first, then upload into that folder.</p>
      )}
    </section>
  );
}
