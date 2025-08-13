import { cn } from "@nui/core/src/utils/cn";
import type { NavItem } from "@nui/plugin-docs/src";

import { isSameBaseSegment } from "../../utils/navigation";

export interface MenuProps {
  items: NavItem[];
  onSelect?: (item: NavItem) => void;
  currentPath?: string;
}

export function HeaderMenu({ items, onSelect, currentPath }: MenuProps) {
  if (!items?.length) return null;

  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm">
      {items.map((item) => {
        const isActive = isSameBaseSegment(item.path, currentPath);

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
}
