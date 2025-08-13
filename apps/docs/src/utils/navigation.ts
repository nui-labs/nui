import type { NavItem } from "@nui/plugin-docs/src";

/**
 * Normalize path by removing trailing slashes (except root)
 */
export function normalize(path: string): string {
  return !path || path === "/" ? "/" : path.replace(/\/+$/, "");
}

/**
 * Get the root segment of a path (e.g., "/docs/guide" -> "docs")
 */
export function getRootSegment(path: string): string {
  const normalized = normalize(path);
  return normalized === "/" ? "" : normalized.split("/")[1] || "";
}

/**
 * Get the base segment of a path (first segment after leading slash)
 */
export function getBaseSegment(path?: string): string {
  if (!path) return "";
  return path.replace(/^\/+|\/+$/g, "").split("/")[0] || "";
}

/**
 * Check if two paths have the same base segment
 */
export function isSameBaseSegment(path1?: string, path2?: string): boolean {
  const base1 = getBaseSegment(path1);
  const base2 = getBaseSegment(path2);
  return !!base1 && base1 === base2;
}

/**
 * Check if currentPath is within itemPath (exact match or child path)
 */
export function isPathWithin(itemPath: string, currentPath: string): boolean {
  const normalizedItem = normalize(itemPath);
  const normalizedCurrent = normalize(currentPath);
  return (
    normalizedCurrent === normalizedItem ||
    normalizedCurrent.startsWith(`${normalizedItem}/`)
  );
}

/**
 * Find the first navigable path in a navigation tree (depth-first)
 */
export function findFirstPath(item: NavItem): string | undefined {
  if (item.path?.trim()) {
    return normalize(item.path);
  }

  for (const child of item.items || []) {
    const path = findFirstPath(child);
    if (path) return path;
  }

  return undefined;
}

/**
 * Flatten navigation tree to ordered list of items with paths
 */
export function flattenNavigation(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];

  for (const item of items) {
    if (item.path) result.push(item);
    if (item.items?.length) {
      result.push(...flattenNavigation(item.items));
    }
  }

  return result;
}

/**
 * Check if current path is within a navigation section
 */
export function isPathInSection(item: NavItem, currentPath: string): boolean {
  const itemPath = item.path ? normalize(item.path) : null;

  // Direct match or child path
  if (itemPath && isPathWithin(itemPath, currentPath)) {
    return true;
  }

  // Check children recursively
  return (item.items || []).some((child) =>
    isPathInSection(child, currentPath),
  );
}

/**
 * Get previous and next pages within section items
 */
export function getPrevNextPages(
  items: NavItem[],
  currentPath: string,
): { prev?: NavItem; next?: NavItem } {
  const flatItems = flattenNavigation(items);
  const normalizedCurrent = normalize(currentPath);
  const index = flatItems.findIndex(
    (item) => item.path && normalize(item.path) === normalizedCurrent,
  );

  if (index === -1) return {};

  return {
    prev: index > 0 ? flatItems[index - 1] : undefined,
    next: index < flatItems.length - 1 ? flatItems[index + 1] : undefined,
  };
}
