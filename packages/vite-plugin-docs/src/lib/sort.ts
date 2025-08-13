import type { ContentFile, SortOptions } from "../types";

/**
 * Sort files using optional order configuration
 */
export function sortFiles(
  files: ContentFile[],
  sort?: SortOptions,
): ContentFile[] {
  const { order = [] } = sort || {};

  if (order.length === 0) return files;

  return [...files].sort((a, b) => {
    const aIndex = getOrderIndex(a.path, order);
    const bIndex = getOrderIndex(b.path, order);
    return aIndex - bIndex;
  });
}

/**
 * Find index of path in order list with fallback matching
 */
function getOrderIndex(path: string, order: string[]): number {
  if (order.length === 0) return 0;

  // Try exact match first
  let index = order.indexOf(path);
  if (index !== -1) return index;

  const parts = path.split("/").filter(Boolean);

  // Try parent path matches (most specific to least specific)
  for (let i = parts.length - 1; i > 0; i--) {
    const partial = "/" + parts.slice(0, i).join("/");
    index = order.indexOf(partial);
    if (index !== -1) return index;
  }

  // Try top-level directory match
  if (parts.length > 0) {
    index = order.indexOf("/" + parts[0]);
    if (index !== -1) return index;
  }

  // Wildcard fallback
  index = order.indexOf("*");
  return index !== -1 ? index : order.length;
}
