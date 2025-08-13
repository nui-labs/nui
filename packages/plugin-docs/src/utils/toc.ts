export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Build a Markdown table of contents (TOC).
 *
 * - Recognizes headings `#` through `######`.
 * - Converts heading text into a URL-friendly slug.
 * - Falls back to `heading-{i}` when slug cannot be generated.
 */
export function buildMarkdownToc(content: string): TocItem[] {
  const headingLines = content.match(/^#{1,6}\s+(.+)$/gm) ?? [];

  return headingLines.map((line, index) => {
    const text = line.replace(/^#+\s+/, "").trim();
    const id = slugify(text, `heading-${index}`);
    const level = line.match(/^#+/)?.[0].length ?? 1;
    return { id, text, level };
  });
}

/**
 * Convert a string into a stable, URL-friendly slug.
 * - Lowercases input.
 * - Removes non-alphanumeric characters (except spaces and dashes).
 * - Collapses whitespace into dashes.
 * - Returns `fallback` if result is empty.
 */
function slugify(input: string, fallback: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return cleaned || fallback;
}
