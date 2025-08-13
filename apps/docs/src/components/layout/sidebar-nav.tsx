import { cn } from "@nui/core";
import type { NavItem } from "@nui/vite-plugin-docs";

export interface SidebarNavProps {
  items: NavItem[];
  currentPath?: string;
  level?: number;
  renderItem?: (item: NavItem, state: { isActive: boolean }) => React.ReactNode;
  onSelect?: (item: NavItem) => void;
}

export function SidebarNav({
  items,
  currentPath,
  level = 0,
  renderItem,
  onSelect,
}: SidebarNavProps) {
  if (!items?.length) return null;

  return (
    <ul role="tree" aria-level={level + 1}>
      {items.map((item) =>
        item.items?.length ? (
          <TreeGroup
            key={item.label}
            item={item}
            currentPath={currentPath}
            level={level}
            renderItem={renderItem}
            onSelect={onSelect}
          />
        ) : (
          <TreeNode
            key={item.path || item.label}
            item={item}
            currentPath={currentPath}
            level={level}
            renderItem={renderItem}
            onSelect={onSelect}
          />
        ),
      )}
    </ul>
  );
}

function isActivePath(itemPath?: string, currentPath?: string) {
  if (!itemPath || !currentPath) return false;
  return currentPath === itemPath;
}

interface TreeGroupProps {
  item: NavItem;
  currentPath?: string;
  level: number;
  renderItem?: SidebarNavProps["renderItem"];
  onSelect?: SidebarNavProps["onSelect"];
}

function TreeGroup({
  item,
  currentPath,
  level,
  renderItem,
  onSelect,
}: TreeGroupProps) {
  const isActive = isActivePath(item.path, currentPath);

  return (
    <li>
      {/* Render the group header - make it clickable if it has a path */}
      {item.path ? (
        <button
          type="button"
          className={cn(
            "flex items-center p-2 text-sm font-semibold rounded-md transition-colors text-left w-full",
            "hover:bg-muted hover:text-accent-foreground",
            isActive ? "bg-muted text-primary" : "text-muted-foreground",
          )}
          aria-current={isActive ? "page" : undefined}
          onClick={(e) => {
            e.preventDefault();
            onSelect?.(item);
          }}
        >
          <span className="truncate">{item.label}</span>
        </button>
      ) : (
        <h4 className="text-sm font-semibold p-2 text-muted-foreground">
          {item.label}
        </h4>
      )}

      {/* Recursively render children using SidebarNav for proper nesting */}
      <div aria-level={level + 2}>
        <SidebarNav
          items={item.items!.filter((child) => {
            // Filter out child items that are index files and have the same path as parent
            // This prevents index files from appearing as both section header and child item
            if (child.path && item.path && child.path === item.path) {
              // This child is the index file that already makes the parent clickable
              return false;
            }
            return true;
          })}
          currentPath={currentPath}
          level={level + 1}
          renderItem={renderItem}
          onSelect={onSelect}
        />
      </div>
    </li>
  );
}

interface TreeNodeProps {
  item: NavItem;
  currentPath?: string;
  level: number;
  renderItem?: SidebarNavProps["renderItem"];
  onSelect?: SidebarNavProps["onSelect"];
}

function TreeNode({
  item,
  currentPath,
  level,
  renderItem,
  onSelect,
}: TreeNodeProps) {
  const isActive = isActivePath(item.path, currentPath);

  const defaultContent = (
    <button
      type="button"
      className={cn(
        "flex items-center p-2 text-sm rounded-md transition-colors text-left",
        "hover:bg-muted hover:text-accent-foreground",
        isActive ? "bg-muted text-primary" : "text-muted-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
      onClick={(e) => {
        e.preventDefault();
        onSelect?.(item);
      }}
    >
      <span className="truncate">{item.label}</span>
    </button>
  );

  return (
    <li role="treeitem" aria-level={level + 1}>
      {renderItem?.(item, { isActive }) ?? defaultContent}
    </li>
  );
}
