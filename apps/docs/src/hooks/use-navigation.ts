import { contents, navigation } from "virtual:contents";
import type { ContentFile, NavItem } from "@nui/plugin-docs/src";

import {
  findFirstPath,
  getPrevNextPages,
  getRootSegment,
  isPathInSection,
  normalize,
} from "../utils/navigation";

interface NavigationState {
  currentFile?: ContentFile;
  navItems: Array<NavItem & { path?: string; isActive: boolean }>;
  sectionItems: NavItem[];
  activeSection?: NavItem;
  prev?: NavItem;
  next?: NavItem;
}

/**
 * React hook to compute complete navigation state for current path
 */
export function useNavigation(currentPath: string): NavigationState {
  const current = normalize(currentPath);
  const rootSegment = getRootSegment(current);

  // Find current file
  const currentFile = contents.find((f) => normalize(f.path) === current);

  // Find active section
  const activeSection = navigation.find((section) =>
    isPathInSection(section, current),
  );

  // Build navigation items with active states
  const navItems = navigation.map((section) => {
    const firstPath = findFirstPath(section);
    const sectionRoot = getRootSegment(firstPath || "");

    return {
      ...section,
      path: firstPath,
      isActive: Boolean(rootSegment) && sectionRoot === rootSegment,
    };
  });

  // Get section items and prev/next navigation
  const sectionItems = activeSection?.items || navigation[0]?.items || [];
  const { prev, next } = activeSection?.items?.length
    ? getPrevNextPages(activeSection.items, current)
    : {};

  return {
    currentFile,
    navItems,
    sectionItems,
    activeSection,
    prev,
    next,
  };
}
