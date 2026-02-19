import type { NormalizedSection } from "@/lib/ingestion/types";

function toAnchor(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function normalizeStructure(rawText: string) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: NormalizedSection[] = [];
  let current: NormalizedSection = {
    heading: "Document Content",
    level: 1,
    content: "",
    anchor: "document-content"
  };

  for (const line of lines) {
    const isLikelyHeading =
      /^[A-Z0-9][A-Za-z0-9\s\-:&]{3,120}$/.test(line) &&
      !line.endsWith(".") &&
      line.split(" ").length <= 12;

    if (isLikelyHeading) {
      if (current.content.trim()) {
        sections.push({ ...current, content: current.content.trim() });
      }
      current = {
        heading: line,
        level: 1,
        content: "",
        anchor: toAnchor(line)
      };
      continue;
    }

    current.content += `${line}\n\n`;
  }

  if (current.content.trim()) {
    sections.push({ ...current, content: current.content.trim() });
  }

  if (!sections.length) {
    sections.push({
      heading: "Document Content",
      level: 1,
      content: rawText.trim() || "No extractable content.",
      anchor: "document-content"
    });
  }

  return sections;
}
