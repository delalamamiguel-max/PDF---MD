import { describe, expect, it } from "vitest";
import { normalizeStructure } from "@/lib/ingestion/normalize";
import { generateMarkdownArtifact } from "@/lib/ingestion/markdown";

describe("ingestion happy path", () => {
  it("normalizes and generates deterministic markdown sections", () => {
    const raw = `Executive Summary\nThis quarter was stable.\n\nKey Findings\nDelivery speed improved.`;
    const sections = normalizeStructure(raw);

    const artifact = generateMarkdownArtifact({
      context: {
        documentId: "11111111-1111-1111-1111-111111111111",
        userId: "22222222-2222-2222-2222-222222222222",
        title: "Test Doc",
        sourceFilename: "test.pdf",
        uploadedAt: "2026-02-19T00:00:00.000Z",
        pdfUrl: "https://blob.local/test.pdf"
      },
      sections,
      pageCount: 4
    });

    expect(artifact.markdown).toContain("schema_version: 1.0.0");
    expect(artifact.markdown).toContain("# Summary");
    expect(artifact.markdown).toContain("# Key Topics");
    expect(artifact.markdown).toContain("# Section-by-Section Outline");
    expect(artifact.markdown).toContain("# Full Structured Content");
    expect(artifact.summary.length).toBeGreaterThan(10);
  });
});
