import type { ContentFile, SortOptions } from "../types";

/**
 * Sorts files according to a custom `order` array.
 *
 * Behavior:
 * - Returns files unchanged if no `order` is provided.
 * - Each file’s position is resolved by: exact path → parent path → top-level dir → wildcard `*` → fallback (end).
 */
export function sortFiles<T extends ContentFile>(
  files: T[],
  options?: SortOptions,
): T[] {
  const { order = [] } = options || {};
  if (order.length === 0) return files;

  return [...files].sort((a, b) => {
    const indexA = findOrderIndex(a.path, order);
    const indexB = findOrderIndex(b.path, order);
    return indexA - indexB;
  });
}

/**
 * Computes the sort index for a given path within `order`.
 *
 * Matching priority:
 * 1) Exact path
 * 2) Parent paths (deep → shallow)
 * 3) Top-level directory
 * 4) Wildcard `*`
 * 5) Fallback (order.length)
 */
function findOrderIndex(path: string, order: string[]): number {
  if (order.length === 0) return 0;

  // 1) Exact path
  const exactIndex = order.indexOf(path);
  if (exactIndex !== -1) return exactIndex;

  // 2) Parent paths
  const pathSegments = path.split("/").filter(Boolean);
  for (let i = pathSegments.length - 1; i > 0; i--) {
    const parentPath = "/" + pathSegments.slice(0, i).join("/");
    const parentIndex = order.indexOf(parentPath);
    if (parentIndex !== -1) return parentIndex;
  }

  // 3) Top-level directory
  if (pathSegments.length > 0) {
    const topLevelIndex = order.indexOf("/" + pathSegments[0]);
    if (topLevelIndex !== -1) return topLevelIndex;
  }

  // 4) Wildcard or 5) Fallback
  const wildcardIndex = order.indexOf("*");
  return wildcardIndex !== -1 ? wildcardIndex : order.length;
}
