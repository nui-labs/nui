import { basename } from "pathe";

import type { ContentFile, NavItem } from "../types";

/**
 * Build a hierarchical navigation tree from a flat list of content files.
 * - Groups files into nested sections based on their `path` segments
 * - Uses `index` files to set metadata for their parent section
 * - Skips root-level `index.tsx` files (often placeholders)
 */
export function buildNavigation(files: ContentFile[]): NavItem[] {
  const nodeMap = new Map<string, NavItem>(); // Quick lookup for parent sections
  const nav: NavItem[] = []; // Root navigation array

  for (const file of files) {
    const segments = file.path.split("/").filter(Boolean); // Path segments (e.g. ["docs", "intro"])
    const baseName = basename(file.path).replace(/\.mdx?$/i, "");
    const isIndexFile = baseName === "index";

    // Ignore root-level index.tsx files
    if (isIndexFile && file.isTsx && segments.length === 1) continue;

    // Ensure the parent navigation structure exists
    const parentItems = getOrCreateParent(segments, nav, nodeMap);

    if (isIndexFile) {
      // Update the parent section with metadata from the index file
      const parentKey = segments.slice(0, -1).join("/");
      const parentNode = nodeMap.get(parentKey);
      if (parentNode && file.meta?.title) {
        Object.assign(parentNode, {
          label: file.meta.title,
          path: file.path,
          meta: file.meta,
        });
      }
    } else {
      // Add a new navigation item for a regular file
      parentItems.push({
        label: file.meta?.title ?? toTitleCase(baseName),
        path: file.path,
        meta: file.meta,
      });
    }
  }

  // Remove items that have no label and no children
  return nav.filter((item) => item.label && (item.path || item.items?.length));
}

/**
 * Get (or create) the parent navigation nodes for the given path segments.
 * Example: for ["docs", "guide", "intro"], this ensures "docs" and "guide"
 * nodes exist before adding "intro".
 */
function getOrCreateParent(
  segments: string[],
  root: NavItem[],
  nodeMap: Map<string, NavItem>,
): NavItem[] {
  let parent = root;

  // Iterate through all but the last segment (which is the file itself)
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments.slice(0, i + 1).join("/");

    // Create a new section if it doesn't exist yet
    if (!nodeMap.has(key)) {
      const node = { label: toTitleCase(segments[i]), items: [] };
      nodeMap.set(key, node);
      parent.push(node);
    }

    parent = nodeMap.get(key)!.items!;
  }

  return parent;
}

/**
 * Convert kebab-case or snake_case into human-friendly Title Case
 * */
const toTitleCase = (str: string) =>
  str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
