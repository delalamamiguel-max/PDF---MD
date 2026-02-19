import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="studio-container py-16">
      <section className="mx-auto max-w-4xl space-y-8">
        <p className="text-sm uppercase tracking-[0.16em] text-[var(--muted-foreground)]">DocToMD Vault</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight">
          Turn calm document intake into reliable markdown knowledge.
        </h1>
        <p className="max-w-2xl text-lg text-[var(--muted-foreground)]">
          Bring a document. We&apos;ll structure it into usable knowledge with deterministic sections ready for citations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/request-invite">
            <Button>Request an invite</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
        </div>
      </section>
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Schema snapshot</h2>
          <pre className="mt-3 overflow-auto rounded-lg bg-[var(--background)] p-4 text-xs text-[var(--muted-foreground)]">
{`---
doc_id: <uuid>
title: <string>
source_filename: <string>
uploaded_at: <iso>
topics: []
tags: []
summary: <string>
schema_version: 1.0.0
embedding_version: 0.0.0
---`}
          </pre>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Flow</h2>
          <ol className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
            <li>1. Upload PDF</li>
            <li>2. Extract text</li>
            <li>3. Normalize structure</li>
            <li>4. Generate markdown</li>
            <li>5. Create embeddings (V1 hook)</li>
          </ol>
        </Card>
      </section>
    </main>
  );
}
