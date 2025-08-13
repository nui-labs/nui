import type { NavItem } from "@nui/plugin-docs/src";

import { SidebarNav } from "./sidebar-nav";

export interface SidebarProps {
  items?: NavItem[];
  activeSection?: NavItem;
  currentPath?: string;
  children?: React.ReactNode;
  onSelect?: (item: NavItem) => void;
}

export function Sidebar({
  items = [],
  activeSection,
  currentPath,
  children,
  onSelect,
}: SidebarProps) {
  // If we have an activeSection, show it as the header with its original items
  const sidebarItems = activeSection
    ? [{ ...activeSection, items: items }]
    : items;

  return (
    children || (
      <nav>
        <SidebarNav
          items={sidebarItems}
          currentPath={currentPath}
          onSelect={onSelect}
        />
      </nav>
    )
  );
}
