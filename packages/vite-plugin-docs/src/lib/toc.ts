import type { TocItem } from "../types";

/**
 * Extract table of contents from MDX content
 */
export function extractTocFromMDX(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  // Define heading patterns to match
  const patterns = [
    // Markdown headings: # ## ### etc.
    {
      regex: /^(#{1,6})\s+(.+?)(?:\s*\{[^}]*\})?$/gm,
      levelIndex: 1,
      textIndex: 2,
    },
    // HTML headings: <h1>text</h1>
    {
      regex: /<h([1-6])(?:\s[^>]*)?>([^<]+)<\/h\1>/gi,
      levelIndex: 1,
      textIndex: 2,
    },
    // JSX headings: <Heading level={2}>text</Heading>
    {
      regex:
        /<(?:Heading|h[1-6])(?:\s[^>]*level[=\s]*[{"]?([1-6])[}"]?[^>]*)?>([^<]+)<\/(?:Heading|h[1-6])>/gi,
      levelIndex: 1,
      textIndex: 2,
    },
  ];

  // Extract headings from all patterns
  for (const { regex, levelIndex, textIndex } of patterns) {
    for (const match of content.matchAll(regex)) {
      const levelStr = match[levelIndex];
      const text = match[textIndex];
      const level =
        typeof levelStr === "string" && levelStr.startsWith("#")
          ? levelStr.length
          : Number(levelStr) || 1;

      const item = createTocItem(text, level);
      const uniqueId = ensureUniqueId(item.id, seen);
      toc.push({ ...item, id: uniqueId });
    }
  }

  // Sort by appearance order in content
  return toc.sort((a, b) => content.indexOf(a.text) - content.indexOf(b.text));
}

/**
 * Generate URL-safe ID from text
 */
export function generateHeadingId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[^a-z0-9\s]/g, "") // Keep only alphanumeric and spaces
      .replace(/[\s-]+/g, "-") // Replace spaces/hyphens with single hyphen
      .replace(/^-+|-+$/g, "") || "heading" // Remove leading/trailing hyphens
  );
}

/**
 * Clean text by removing markdown and HTML formatting
 */
export function cleanText(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^*]+)\*/g, "$1") // Italic
    .replace(/__([^_]+)__/g, "$1") // Bold (underscore)
    .replace(/_([^_]+)_/g, "$1") // Italic (underscore)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/<[^>]+>/g, "") // HTML tags
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Ensure unique ID by appending number if needed
 */
function ensureUniqueId(id: string, seen: Map<string, number>): string {
  const count = seen.get(id) || 0;
  seen.set(id, count + 1);
  return count === 0 ? id : `${id}-${count}`;
}

/**
 * Create TocItem from heading text and level
 */
export function createTocItem(text: string, level: number): TocItem {
  const cleanedText = cleanText(text);
  return {
    level,
    text: cleanedText,
    id: generateHeadingId(cleanedText),
  };
}
