import { basename } from "pathe";

import type { ContentFile, NavItem } from "../types";

/**
 * Builds a hierarchical navigation tree from content files.
 *
 * Behavior:
 * - Skips root-level `index` placeholders when the source is TSX.
 * - Directory `index` files update their parent section’s label/path/meta.
 * - Other files become leaf nodes within their parent section.
 */
export function buildNavigation(files: ContentFile[]): NavItem[] {
  const navigation: NavItem[] = [];

  for (const file of files) {
    // Splits a file path into clean segments.
    const segments = file.path.split("/").filter(Boolean);
    // Extracts the base filename without `.md`/`.mdx`.
    const fileName = basename(file.path).replace(/\.mdx?$/i, "");

    // Ignore root-level placeholder `index.tsx`
    if (isRootIndexFile(fileName, segments, file.isTsx)) continue;

    addFileToNavigation(navigation, file, segments, fileName);
  }

  // Remove empty sections recursively
  return navigation.filter(hasValidContent);
}

/**
 * Returns true if the file is a root-level placeholder `index`.
 * These are typically layout drivers (`/index.tsx`) rather than content.
 */
function isRootIndexFile(
  fileName: string,
  segments: string[],
  isTsx?: boolean,
) {
  return fileName === "index" && segments.length === 1 && !!isTsx;
}

/**
 * Inserts a file into the navigation tree.
 * - Walks/creates parent sections based on path.
 * - Updates parent metadata if this is an `index` file.
 * - Otherwise adds a leaf navigation item.
 */
function addFileToNavigation(
  navigation: NavItem[],
  file: ContentFile,
  segments: string[],
  fileName: string,
): void {
  const { parentItems, parentSection } = findOrCreateParentSections(
    navigation,
    segments,
  );

  if (fileName === "index") {
    if (parentSection && file.meta?.title) {
      parentSection.label = file.meta.title;
      parentSection.path = file.path;
      parentSection.meta = file.meta;
    }
    return;
  }

  const label = file.meta?.title ?? formatLabel(fileName);
  const existing = parentItems.find((item) => item.label === label);

  if (!existing) {
    parentItems.push({ label, path: file.path, meta: file.meta });
  } else if (!existing.path) {
    // Upgrade placeholder section with file metadata
    existing.path = file.path;
    existing.meta = file.meta;
  }
}

/**
 * Ensures all parent sections exist for the given path.
 *
 * Example: for `/docs/intro/page.mdx`, it ensures:
 * - A "Docs" section exists at root
 * - An "Intro" section exists inside "Docs"
 */
function findOrCreateParentSections(
  navigation: NavItem[],
  segments: string[],
): { parentItems: NavItem[]; parentSection?: NavItem } {
  let currentItems = navigation;
  let parentSection: NavItem | undefined;

  // All but the last segment are treated as section nodes
  for (let i = 0; i < segments.length - 1; i++) {
    const sectionLabel = formatLabel(segments[i]);
    let section = currentItems.find((item) => item.label === sectionLabel);

    if (!section) {
      section = { label: sectionLabel, items: [] };
      currentItems.push(section);
    }

    section.items ??= [];
    parentSection = section;
    currentItems = section.items;
  }

  return { parentItems: currentItems, parentSection };
}

/**
 * Checks if a navigation item has meaningful content:
 * - either a direct path, or
 * - non-empty child items (recursively).
 */
function hasValidContent(item: NavItem): boolean {
  return Boolean(
    item.label && (item.path || item.items?.some(hasValidContent)),
  );
}

/**
 * Converts raw segment text to a readable label.
 * Example: "getting-started" → "Getting Started".
 */
function formatLabel(text: string): string {
  return text
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
