import type React from "react";
import { cn } from "@nui/core/src/utils/cn";
import type { NavItem } from "@nui/vite-plugin-docs";

export interface MenuProps {
  items: NavItem[];
  onSelect?: (item: NavItem) => void;
  currentPath?: string;
}

/**
 * Returns the first segment (after leading slash) of a path.
 */
function getBaseSegment(path?: string): string {
  if (!path) return "";
  return path.replace(/^\/+|\/+$/g, "").split("/")[0] || "";
}

/**
 * Checks if the currentPath is within the same base section as itemPath.
 * E.g. "/components/toolbar" and "/components/button" are both "components".
 */
function isBaseActive(itemPath?: string, currentPath?: string): boolean {
  const base = getBaseSegment(itemPath);
  const curr = getBaseSegment(currentPath);
  return !!base && base === curr;
}

export const HeaderMenu: React.FC<MenuProps> = ({
  items,
  onSelect,
  currentPath,
}) => {
  if (!items?.length) return null;

  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm">
      {items.map((item) => {
        const isActive = isBaseActive(item.path, currentPath);

        return (
          <button
            key={item.path ?? item.label}
            type="button"
            className={cn(
              "transition-colors px-2 py-1 rounded",
              isActive
                ? "text-primary bg-muted"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onSelect?.(item)}
            disabled={!item.path}
            tabIndex={item.path ? 0 : -1}
            aria-current={isActive ? "page" : undefined}
            style={
              item.path ? undefined : { pointerEvents: "none", opacity: 0.6 }
            }
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
