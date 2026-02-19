import type { IngestionContext, NormalizedSection } from "@/lib/ingestion/types";

function uniqueTopTerms(text: string, max = 6) {
  const stop = new Set(["the", "and", "for", "that", "this", "with", "from", "into", "are", "was", "were", "you", "your", "have", "has", "not", "but", "can", "will"]);
  const freq = new Map<string, number>();

  for (const token of text.toLowerCase().match(/[a-z]{4,}/g) ?? []) {
    if (stop.has(token)) continue;
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([word]) => word);
}

function firstSentences(text: string, maxChars = 280) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;

  const slice = cleaned.slice(0, maxChars);
  const end = Math.max(slice.lastIndexOf("."), slice.lastIndexOf(";"));
  return `${(end > 120 ? slice.slice(0, end + 1) : slice).trim()}`;
}

export function generateMarkdownArtifact(input: {
  context: IngestionContext;
  sections: NormalizedSection[];
  pageCount: number | null;
}) {
  const joined = input.sections.map((section) => section.content).join("\n\n");
  const topics = uniqueTopTerms(joined, 6);
  const tags = topics.slice(0, 4);
  const summary = firstSentences(joined || `Structured markdown generated for ${input.context.title}.`);
  const outline = input.sections.map((section) => `- [${section.heading}](#${section.anchor})`).join("\n");
  const topHeadings = input.sections.slice(0, 6).map((section) => section.heading);

  const frontmatter = [
    "---",
    `doc_id: ${input.context.documentId}`,
    `title: ${JSON.stringify(input.context.title)}`,
    `source_filename: ${JSON.stringify(input.context.sourceFilename)}`,
    `uploaded_at: ${input.context.uploadedAt}`,
    `topics: [${topics.map((topic) => JSON.stringify(topic)).join(", ")}]`,
    `tags: [${tags.map((tag) => JSON.stringify(tag)).join(", ")}]`,
    `summary: ${JSON.stringify(summary)}`,
    "schema_version: 1.0.0",
    "embedding_version: 0.0.0",
    "---"
  ].join("\n");

  const sectionsBody = input.sections
    .map((section) => `## ${section.heading}\n\n<a id=\"${section.anchor}\"></a>\n\n${section.content}`)
    .join("\n\n");

  const markdown = [
    frontmatter,
    "",
    "# Summary",
    "",
    summary,
    "",
    "# Key Topics",
    "",
    topics.map((topic) => `- ${topic}`).join("\n") || "- n/a",
    "",
    "# Section-by-Section Outline",
    "",
    outline || "- n/a",
    "",
    "# Heading 1",
    "",
    topHeadings[0] ?? "n/a",
    "",
    "# Heading 2",
    "",
    topHeadings[1] ?? topHeadings[0] ?? "n/a",
    "",
    "# Notable Quotes",
    "",
    `> ${summary}`,
    "",
    "# Entities (People / Orgs / Products)",
    "",
    "- n/a (MVP extraction)",
    "",
    "# Actionable Takeaways",
    "",
    "- Review and validate generated sections before downstream use.",
    "- Reprocess with reason if headings look incomplete.",
    "",
    "# Full Structured Content",
    "",
    sectionsBody
  ].join("\n");

  return {
    markdown,
    summary,
    topics,
    tags,
    pageCount: input.pageCount
  };
}
