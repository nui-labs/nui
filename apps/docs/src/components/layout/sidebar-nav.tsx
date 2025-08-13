import { cn } from "@nui/core";
import type { NavItem } from "@nui/plugin-docs/src";

export interface SidebarNavProps {
  items: NavItem[];
  currentPath?: string;
  level?: number;
  onSelect?: (item: NavItem) => void;
}

export function SidebarNav({
  items,
  currentPath,
  level = 0,
  onSelect,
}: SidebarNavProps) {
  if (!items?.length) return null;

  return (
    <ul role="tree" aria-level={level + 1}>
      {items.map((item) => (
        <SidebarNavItem
          key={item.path || item.label}
          item={item}
          currentPath={currentPath}
          level={level}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  currentPath?: string;
  level: number;
  onSelect?: SidebarNavProps["onSelect"];
}

function SidebarNavItem({
  item,
  currentPath,
  level,
  onSelect,
}: SidebarNavItemProps) {
  const isActive = item.path === currentPath;
  const isClickable = !!item.path;
  const children = item.items?.filter((child) => child.path !== item.path);

  const handleClick = () => onSelect?.(item);

  // Shared base styles
  const baseStyles =
    "inline-block py-1 px-2 text-sm truncate rounded-md transition-colors";

  const hoverStyles = "group-hover:bg-muted group-hover:text-accent-foreground";

  const focusStyles =
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <li role="treeitem" aria-level={level + 1} className="mb-1">
      <div
        className={cn("w-full pl-1", isClickable && "group")}
        style={level > 1 ? { paddingLeft: `${level * 6}px` } : undefined}
        onClick={isClickable ? handleClick : undefined}
      >
        {isClickable ? (
          <button
            type="button"
            aria-current={isActive ? "page" : undefined}
            className={cn(
              baseStyles,
              hoverStyles,
              focusStyles,
              isActive ? "bg-muted text-primary" : "text-muted-foreground",
            )}
          >
            {item.label}
          </button>
        ) : (
          <h4 className={cn(baseStyles, "font-semibold text-muted-foreground")}>
            {item.label}
          </h4>
        )}
      </div>
      {children && (
        <SidebarNav
          items={children}
          currentPath={currentPath}
          level={level + 1}
          onSelect={onSelect}
        />
      )}
    </li>
  );
}
