import { Card } from "@/components/ui/card";

export default function SearchPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Ask your library</h1>
      <Card>
        <p className="text-sm text-[var(--muted-foreground)]">Global cited retrieval is scaffolded for V1. This tab is a placeholder in MVP.</p>
      </Card>
    </section>
  );
}
