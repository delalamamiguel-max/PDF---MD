"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/docs/status-badge";
import { formatDate } from "@/lib/utils";
import type { DocumentStatus } from "@/lib/repositories/documents";

type DocumentItem = {
  id: string;
  title: string;
  created_at: string;
  status: DocumentStatus;
  tags: string[];
  topics: string[];
  folder_name: string | null;
  folder_visibility: "private" | "unlisted" | "public" | null;
  folder_access_token: string | null;
};

export function DocumentsTable({ items, folders }: { items: DocumentItem[]; folders: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function deleteDoc(id: string) {
    setLoadingId(id);
    await fetch(`/api/documents/${id}/delete`, { method: "DELETE" });
    router.refresh();
  }

  async function reprocessDoc(id: string) {
    const reason = window.prompt("Reason for reprocess", "missing headings");
    if (!reason) return;
    setLoadingId(id);
    await fetch(`/api/documents/${id}/reprocess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    router.refresh();
  }

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/dashboard?${next.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-5">
        <Input
          placeholder="Search title, summary, tags"
          defaultValue={searchParams.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilter("q", (e.target as HTMLInputElement).value);
            }
          }}
        />
        <select
          className="h-11 rounded-md border border-[var(--muted)] bg-white px-3 text-sm"
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(e) => setFilter("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Processing">Processing</option>
          <option value="Ready">Ready</option>
          <option value="Failed">Failed</option>
        </select>
        <select
          className="h-11 rounded-md border border-[var(--muted)] bg-white px-3 text-sm"
          defaultValue={searchParams.get("folderId") ?? ""}
          onChange={(e) => setFilter("folderId", e.target.value)}
        >
          <option value="">All folders</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
        <Input placeholder="Tag" defaultValue={searchParams.get("tag") ?? ""} onBlur={(e) => setFilter("tag", e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" defaultValue={searchParams.get("from") ?? ""} onChange={(e) => setFilter("from", e.target.value)} />
          <Input type="date" defaultValue={searchParams.get("to") ?? ""} onChange={(e) => setFilter("to", e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--muted)] bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-[var(--muted)] bg-[var(--background)] text-left text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Folder</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tags / Topics</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[var(--muted)] last:border-none">
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  <div>{item.folder_name ?? "—"}</div>
                  {item.folder_access_token && item.folder_visibility !== "private" ? (
                    <Link className="text-xs text-[var(--primary)]" href={`/shared/f/${item.folder_access_token}`}>Shared link</Link>
                  ) : null}
                </td>
                <td className="px-4 py-3 whitespace-nowrap tabular-nums text-[var(--muted-foreground)]">{formatDate(item.created_at)}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{[...item.tags, ...item.topics].slice(0, 4).join(", ") || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/docs/${item.id}`}><Button variant="secondary">View</Button></Link>
                    <a href={`/api/documents/${item.id}/download-md`}><Button variant="secondary">Download .md</Button></a>
                    <Button variant="ghost" onClick={() => reprocessDoc(item.id)} disabled={loadingId === item.id}>Reprocess</Button>
                    <Button variant="danger" onClick={() => deleteDoc(item.id)} disabled={loadingId === item.id}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td className="px-4 py-12 text-center text-[var(--muted-foreground)]" colSpan={6}>
                  No documents yet. Upload a PDF to begin.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
