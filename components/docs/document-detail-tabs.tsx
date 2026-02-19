"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  summary: string | null;
  topics: string[];
  tags: string[];
  status: string;
  schemaVersion: string | null;
  embeddingVersion: string | null;
  pageCount: number | null;
  markdown: string | null;
  errorMessage: string | null;
};

export function DocumentDetailTabs(props: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="markdown">Markdown</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="rounded-xl border border-[var(--muted)] bg-white p-6">
        <div className="space-y-3 text-sm">
          <p><strong>Status:</strong> {props.status}</p>
          <p><strong>Summary:</strong> {props.summary ?? "No summary yet"}</p>
          <p><strong>Topics:</strong> {props.topics.join(", ") || "—"}</p>
          <p><strong>Tags:</strong> {props.tags.join(", ") || "—"}</p>
          <p><strong>Schema version:</strong> {props.schemaVersion ?? "1.0.0"}</p>
          <p><strong>Embedding version:</strong> {props.embeddingVersion ?? "0.0.0"}</p>
          <p><strong>Page count:</strong> {props.pageCount ?? "—"}</p>
          {props.errorMessage ? <p className="text-[var(--error)]">{props.errorMessage}</p> : null}
        </div>
      </TabsContent>

      <TabsContent value="markdown" className="rounded-xl border border-[var(--muted)] bg-white p-6">
        <div className="mb-3 flex gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              if (!props.markdown) return;
              await navigator.clipboard.writeText(props.markdown);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
          <a href={`/api/documents/${props.id}/download-md`}>
            <Button variant="secondary">Download .md</Button>
          </a>
        </div>
        {props.markdown ? (
          <article className="prose max-w-[75ch] text-sm">
            <ReactMarkdown>{props.markdown}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Markdown is not ready yet.</p>
        )}
      </TabsContent>

      <TabsContent value="chat" className="rounded-xl border border-[var(--muted)] bg-white p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Doc-scoped chat with citations is planned for V1. Retrieval hooks are scaffolded.</p>
      </TabsContent>
    </Tabs>
  );
}
