"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Folder = {
  id: string;
  name: string;
  visibility: "private" | "unlisted" | "public";
  access_token: string | null;
};

export function FolderManager({ initialFolders }: { initialFolders: Folder[] }) {
  const [folders, setFolders] = useState(initialFolders);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const router = useRouter();

  async function createFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");

    const response = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (!response.ok) return;
    const payload = (await response.json()) as { item: Folder };
    setFolders((prev) => [payload.item, ...prev]);
    event.currentTarget.reset();
    router.refresh();
  }

  async function renameFolder(id: string) {
    const name = window.prompt("New folder name");
    if (!name) return;
    const response = await fetch(`/api/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { item: Folder };
    setFolders((prev) => prev.map((folder) => (folder.id === id ? payload.item : folder)));
    router.refresh();
  }

  async function setVisibility(id: string, visibility: Folder["visibility"]) {
    const response = await fetch(`/api/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility })
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { item: Folder };
    setFolders((prev) => prev.map((folder) => (folder.id === id ? payload.item : folder)));
    router.refresh();
  }

  async function removeFolder(id: string) {
    const response = await fetch(`/api/folders/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    router.refresh();
  }

  async function generateShareLink(id: string) {
    const response = await fetch(`/api/folders/${id}/share`, { method: "POST" });
    if (!response.ok) return;
    const payload = (await response.json()) as { shareUrl: string };
    setShareUrl(payload.shareUrl);
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Folders</h2>
      <form onSubmit={createFolder} className="flex gap-2">
        <Input name="name" placeholder="New folder name" required />
        <Button type="submit">Create</Button>
      </form>

      <div className="space-y-2">
        {folders.map((folder) => (
          <div key={folder.id} className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--muted)] p-3">
            <p className="min-w-32 flex-1 font-medium">{folder.name}</p>
            <select
              value={folder.visibility}
              className="h-9 rounded-md border border-[var(--muted)] bg-white px-2 text-sm"
              onChange={(event) => setVisibility(folder.id, event.target.value as Folder["visibility"])}
            >
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
              <option value="public">Public</option>
            </select>
            <Button variant="ghost" onClick={() => renameFolder(folder.id)}>Rename</Button>
            <Button variant="ghost" onClick={() => removeFolder(folder.id)}>Delete</Button>
            {folder.visibility !== "private" ? <Button variant="secondary" onClick={() => generateShareLink(folder.id)}>Share</Button> : null}
          </div>
        ))}
      </div>

      {shareUrl ? <p className="break-all text-sm text-[var(--muted-foreground)]">Share URL: {shareUrl}</p> : null}
    </Card>
  );
}
