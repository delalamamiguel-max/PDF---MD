"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DocumentActions({ docId }: { docId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function reprocess() {
    const reason = window.prompt("Reason for reprocess", "manual retry");
    if (!reason) return;

    setLoading(true);
    await fetch(`/api/documents/${docId}/reprocess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={reprocess} disabled={loading}>Reprocess</Button>
      <a href={`/api/documents/${docId}/download-md`}>
        <Button variant="secondary">Download .md</Button>
      </a>
    </div>
  );
}
