"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Step = "upload" | "extract" | "normalize" | "markdown" | "embeddings";

type FolderOption = {
  id: string;
  name: string;
};

const stepLabels: Record<Step, string> = {
  upload: "Upload PDF",
  extract: "Extract text",
  normalize: "Normalize structure",
  markdown: "Generate Markdown",
  embeddings: "Create embeddings"
};

export function UploadForm({ folders }: { folders: FolderOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("upload");
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const orderedSteps = useMemo(() => Object.keys(stepLabels) as Step[], []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = selectedFile ?? formData.get("file");

    if (!(file instanceof File) || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append("title", String(formData.get("title") || file.name.replace(/\.pdf$/i, "")));
    payload.append("tags", String(formData.get("tags") || ""));
    payload.append("folderId", String(formData.get("folderId") || ""));
    payload.append("file", file);

    setStep("upload");
    setMessage("Uploading your PDF...");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: payload
    });

    const data = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
    if (!response.ok || !data.id) {
      setError(data.error ?? "Upload failed.");
      setLoading(false);
      return;
    }

    const docId = data.id;
    await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: docId })
    });

    const tick = async () => {
      const docRes = await fetch(`/api/documents/${docId}`);
      const doc = (await docRes.json()) as { status: "Processing" | "Ready" | "Failed"; error_message?: string; current_stage?: string };

      if (!docRes.ok) {
        setError("Unable to track processing status.");
        setLoading(false);
        return;
      }

      const nextStage = doc.current_stage as Step | undefined;
      if (nextStage && nextStage in stepLabels) {
        setStep(nextStage);
        setMessage(`${stepLabels[nextStage]}...`);
      }

      if (doc.status === "Ready") {
        setStep("embeddings");
        setMessage("Your document is ready. Structured and searchable.");
        setTimeout(() => router.push(`/docs/${docId}`), 800);
        return;
      }

      if (doc.status === "Failed") {
        setError(doc.error_message ?? "Processing failed. You can reprocess from the document detail page.");
        setLoading(false);
        return;
      }

      setTimeout(tick, 1400);
    };

    setStep("extract");
    setMessage("Extracting text...");
    setTimeout(tick, 1200);
  }

  return (
    <Card className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Document title</label>
          <Input id="title" name="title" placeholder="Q4 Research Report" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="folderId" className="text-sm font-medium">Folder</label>
          <select id="folderId" name="folderId" className="h-11 w-full rounded-md border border-[var(--muted)] bg-white px-3 text-sm" required>
            <option value="">Select folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
          <Input id="tags" name="tags" placeholder="research, finance" />
        </div>
        <div
          className={`rounded-lg border border-dashed p-6 text-center text-sm ${dragging ? "border-[var(--primary)] bg-blue-50" : "border-[var(--muted)]"}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) {
              setSelectedFile(file);
            }
          }}
        >
          <p>Drag and drop a PDF here, or use the file picker.</p>
          <Input id="file" name="file" type="file" accept="application/pdf" required={!selectedFile} className="mt-3" />
          {selectedFile ? <p className="mt-2 text-[var(--muted-foreground)]">Selected: {selectedFile.name}</p> : null}
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Processing..." : "Upload and process"}</Button>
      </form>

      <div className="space-y-2 border-t border-[var(--muted)] pt-4">
        <p className="text-sm font-medium">Progress</p>
        <ul className="space-y-2 text-sm">
          {orderedSteps.map((item) => {
            const isActive = orderedSteps.indexOf(item) <= orderedSteps.indexOf(step);
            return (
              <li key={item} className={isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}>
                {isActive ? "✓" : "○"} {stepLabels[item]}
              </li>
            );
          })}
        </ul>
        {message ? <p className="text-sm text-[var(--muted-foreground)]">{message}</p> : null}
        {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
      </div>
    </Card>
  );
}
