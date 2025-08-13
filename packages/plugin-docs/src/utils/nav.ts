import { basename } from "pathe";

import type { ContentFile, NavItem } from "../types";

/**
 * Builds a hierarchical navigation tree from content files.
 * - Skips root-level page.tsx files
 * - Directory page files update their parent section
 * - Other files become leaf nodes
 */
export function buildNavigation(files: ContentFile[]): NavItem[] {
  const navigation: NavItem[] = [];

  for (const file of files) {
    const segments = file.path.split("/").filter(Boolean);
    const fileName = basename(file.path).replace(/\.mdx?$/i, "");

    // Skip root-level page.tsx
    if (fileName === "page" && segments.length === 1 && file.isTsx) continue;

    addFileToNavigation(navigation, file, segments, fileName);
  }

  return navigation.filter(hasValidContent);
}

/**
 * Inserts a file into the navigation tree.
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

  // Page files update their parent section
  if (fileName === "page" && parentSection && file.meta?.title) {
    parentSection.label = file.meta.title;
    parentSection.path = file.path;
    parentSection.meta = file.meta;
    return;
  }

  // Add or update leaf item
  const label = file.meta?.title ?? formatLabel(fileName);
  const existing = parentItems.find((item) => item.label === label);

  if (!existing) {
    parentItems.push({ label, path: file.path, meta: file.meta });
  } else if (!existing.path) {
    existing.path = file.path;
    existing.meta = file.meta;
  }
}

/**
 * Ensures all parent sections exist for the given path.
 */
function findOrCreateParentSections(
  navigation: NavItem[],
  segments: string[],
): { parentItems: NavItem[]; parentSection?: NavItem } {
  let currentItems = navigation;
  let parentSection: NavItem | undefined;

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
 * Checks if a navigation item has valid content.
 */
function hasValidContent(item: NavItem): boolean {
  return Boolean(
    item.label && (item.path || item.items?.some(hasValidContent)),
  );
}

/**
 * Converts segment text to readable label.
 */
function formatLabel(text: string): string {
  return text
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
