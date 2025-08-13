import { useMemo, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button, Drawer, DrawerContent, DrawerTrigger } from "@nui/core";
import type { NavItem } from "@nui/vite-plugin-docs";

// Function to flatten navigation items with level information and avoid duplicates
function flattenNavItems(
  items: NavItem[],
  level = 0,
  seen = new Set<string>(),
): Array<NavItem & { level: number }> {
  const flattened: Array<NavItem & { level: number }> = [];

  for (const item of items) {
    // Create a unique key for the item
    const key = item.path || item.label;

    // Skip if we've already seen this item
    if (seen.has(key)) {
      continue;
    }

    // Add the item itself if it has a path
    if (item.path) {
      flattened.push({ ...item, level });
      seen.add(key);
    }

    // Recursively add child items with increased level
    if (item.items && item.items.length > 0) {
      flattened.push(...flattenNavItems(item.items, level + 1, seen));
    }
  }

  return flattened;
}

export interface MobileNavProps {
  items?: NavItem[];
  sidebarItems?: NavItem[];
  currentPath?: string;
  onSelect?: (item: NavItem) => void;
}

export const MobileNav = ({
  items = [],
  sidebarItems = [],
  currentPath,
  onSelect,
}: MobileNavProps) => {
  const [open, setOpen] = useState(false);

  // Combine and flatten all navigation items
  const allItems = useMemo(() => {
    const combined = [...items, ...sidebarItems];
    return flattenNavItems(combined);
  }, [items, sidebarItems]);

  const handleSelect = (item: NavItem) => {
    onSelect?.(item);
    // Close the drawer after navigation
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger
        render={(props) => (
          <Button
            {...props}
            variant="ghost"
            size="sm"
            className="lg:hidden"
            aria-label="Open mobile navigation"
          >
            <MenuIcon className="size-5" />
          </Button>
        )}
      />
      <DrawerContent className="max-h-[80vh] p-0">
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <nav className="space-y-1">
            {allItems.map((item) => {
              const isActive = item.path === currentPath;
              const indentLevel = item.level * 16; // 16px per level
              return (
                <button
                  key={item.path ?? item.label}
                  type="button"
                  className={`w-full text-left py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-muted " : "text-foreground hover:bg-muted"
                  }, ${indentLevel === 0 ? "font-bold" : ""}`}
                  style={{ paddingLeft: `${12 + indentLevel}px` }}
                  onClick={() => handleSelect(item)}
                  disabled={!item.path}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
