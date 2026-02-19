import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-semibold">Upload a PDF</h1>
      <p className="text-sm text-[var(--muted-foreground)]">Bring one document and we&apos;ll structure it into usable knowledge.</p>
      <UploadForm />
    </section>
  );
}
