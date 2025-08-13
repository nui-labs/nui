import { basename } from "pathe";

import type { ContentFile, NavItem } from "../types";

/**
 * Build a hierarchical navigation tree from content files.
 */
export function buildNavigation(files: ContentFile[]): NavItem[] {
  const root: NavItem[] = [];

  for (const file of files) {
    const segments = file.path.split("/").filter(Boolean);
    const fileName = basename(file.path).replace(/\.mdx?$/i, "");

    // Skip root-level placeholder index.tsx files
    if (fileName === "index" && segments.length === 1 && file.isTsx) continue;

    let current = root;

    // Walk through parent sections
    for (let i = 0; i < segments.length - 1; i++) {
      const label = toTitleCase(segments[i]);
      let section = current.find((x) => x.label === label);

      if (!section) {
        section = { label, items: [] };
        current.push(section);
      }

      // merge children if duplicate sections occur
      if (!section.items) section.items = [];
      current = section.items;
    }

    // Handle final segment
    if (fileName === "index") {
      const parent = current.find(
        (x) => x.label === toTitleCase(segments.at(-2) ?? ""),
      );
      if (parent && file.meta?.title) {
        parent.label = file.meta.title;
        parent.path = file.path;
        parent.meta = file.meta;
      }
    } else {
      // Avoid duplicate leaf entries
      const label = file.meta?.title ?? toTitleCase(fileName);
      let item = current.find((x) => x.label === label);

      if (!item) {
        current.push({ label, path: file.path, meta: file.meta });
      } else if (!item.path) {
        item.path = file.path;
        item.meta = file.meta;
      }
    }
  }

  return root.filter(hasContent);
}

/**
 * Check if a navigation item has meaningful content.
 */
const hasContent = (item: NavItem): boolean =>
  Boolean(item.label && (item.path || item.items?.some(hasContent)));

/**
 * Convert kebab-case or snake_case to Title Case.
 */
const toTitleCase = (str: string): string =>
  str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
