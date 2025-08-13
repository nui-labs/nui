import type { ContentFile, NavItem } from "@nui/vite-plugin-docs";

interface NavigationState {
  currentFile?: ContentFile;
  rootItems: Array<NavItem & { path?: string; isActive: boolean }>;
  sectionItems: NavItem[];
  activeSection?: NavItem;
  prev?: NavItem;
  next?: NavItem;
}

/**
 * Compute complete navigation state for current path
 */
export function getNavigationState(
  contents: readonly ContentFile[],
  navigation: NavItem[],
  currentPath: string,
): NavigationState {
  const current = normalize(currentPath);
  const rootSegment = getRootSegment(current);

  // Find current file
  const currentFile = contents.find((f) => normalize(f.path) === current);

  // Build root items with active states
  const rootItems = navigation.map((section) => {
    const firstPath = findFirstPath(section);
    const sectionRoot = getRootSegment(firstPath || "");

    return {
      ...section,
      path: firstPath,
      isActive: Boolean(rootSegment) && sectionRoot === rootSegment,
    };
  });

  // Find active section and its items
  const activeSection = navigation.find((section) =>
    isPathInSection(section, current),
  );
  const sectionItems = activeSection?.items || navigation[0]?.items || [];

  // Get prev/next navigation
  const { prev, next } = getPrevNextPages(navigation, current);

  return {
    currentFile,
    rootItems,
    sectionItems,
    activeSection,
    prev,
    next,
  };
}

/**
 * Get previous and next pages within active section
 */
function getPrevNextPages(
  navigation: NavItem[],
  currentPath: string,
): { prev?: NavItem; next?: NavItem } {
  const current = normalize(currentPath);
  const activeSection = navigation.find((section) =>
    isPathInSection(section, current),
  );

  if (!activeSection?.items?.length) return {};

  const flatItems = flattenNavigation(activeSection.items);
  const index = flatItems.findIndex(
    (item) => normalize(item.path!) === current,
  );

  if (index === -1) return {};

  return {
    prev: index > 0 ? flatItems[index - 1] : undefined,
    next: index < flatItems.length - 1 ? flatItems[index + 1] : undefined,
  };
}

/**
 * Normalize path by removing trailing slashes (except root)
 */
function normalize(path: string): string {
  return !path || path === "/" ? "/" : path.replace(/\/+$/, "");
}

/**
 * Get first path segment for section matching
 */
function getRootSegment(path: string): string {
  return normalize(path).split("/")[1] || "";
}

/**
 * Find first valid path in navigation tree (depth-first)
 */
function findFirstPath(item: NavItem): string | undefined {
  if (item.path?.trim()) return normalize(item.path);

  for (const child of item.items || []) {
    const path = findFirstPath(child);
    if (path) return path;
  }

  return undefined;
}

/**
 * Check if current path is within a navigation section
 */
function isPathInSection(item: NavItem, currentPath: string): boolean {
  const current = normalize(currentPath);
  const itemPath = item.path ? normalize(item.path) : null;

  // Direct match or child path
  if (
    itemPath &&
    (current === itemPath || current.startsWith(`${itemPath}/`))
  ) {
    return true;
  }

  // Check children recursively
  return (item.items || []).some((child) => isPathInSection(child, current));
}

/**
 * Flatten navigation tree to ordered list of items with paths
 */
function flattenNavigation(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];

  for (const item of items) {
    if (item.path) result.push(item);
    if (item.items) result.push(...flattenNavigation(item.items));
  }

  return result;
}
