import { useEffect, useRef, useState } from "react";
import { Button, cn, Drawer, DrawerContent, DrawerTrigger } from "@nui/core";
import type { NavItem } from "@nui/plugin-docs/src";

interface FlatNavItem extends NavItem {
  level: number;
}

export interface MobileNavProps {
  items?: NavItem[];
  currentPath?: string;
  onSelect?: (item: NavItem) => void;
}

const BASE_INDENT = 6;

interface MenuIconProps {
  isOpen: boolean;
  className?: string;
}

function MenuIcon({ isOpen, className }: MenuIconProps) {
  const startAnimRef = useRef<SVGAnimateElement>(null);
  const reverseAnimRef = useRef<SVGAnimateElement>(null);

  useEffect(() => {
    if (isOpen) {
      startAnimRef.current?.beginElement();
    } else {
      reverseAnimRef.current?.beginElement();
    }
  }, [isOpen]);

  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3,6L12,6L21,6M3,12L21,12M3,18L12,18L21,18">
        <animate
          ref={startAnimRef}
          dur="0.2s"
          attributeName="d"
          values="M3,6L12,6L21,6M3,12L21,12M3,18L12,18L21,18;M6,6L12,12L18,6M12,12L12,12M6,18L12,12L18,18"
          fill="freeze"
          begin="indefinite"
        />
        <animate
          ref={reverseAnimRef}
          dur="0.2s"
          attributeName="d"
          values="M6,6L12,12L18,6M12,12L12,12M6,18L12,12L18,18;M3,6L12,6L21,6M3,12L21,12M3,18L12,18L21,18"
          fill="freeze"
          begin="indefinite"
        />
      </path>
    </svg>
  );
}

function isIndexFile(item: NavItem): boolean {
  const path = item.path?.toLowerCase();
  const label = item.label?.toLowerCase();
  return !!path && (path.includes("/index") || label === "index");
}

function flattenNavItems(items: NavItem[], level = 0): FlatNavItem[] {
  return items.flatMap((item) => {
    const indexFile = item.items?.find(isIndexFile);
    const children = item.items?.filter((c) => !isIndexFile(c)) ?? [];

    const current: FlatNavItem = {
      ...item,
      level,
      path: item.path || indexFile?.path,
      items: children.length ? children : undefined,
    };

    return [current, ...flattenNavItems(children, level + 1)];
  });
}

function getButtonClasses(
  item: FlatNavItem,
  isSection: boolean,
  isActive?: boolean,
) {
  const baseStyles =
    "inline-block py-1 px-2 truncate rounded-md transition-colors";

  const hoverStyles = "group-hover:bg-muted group-hover:text-accent-foreground";

  const focusStyles =
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  // Text size logic: keep sections and level 0 items small, make others bigger
  const textSize = item.level === 0 || isSection ? "text-sm" : "text-base";

  return cn(
    baseStyles,
    hoverStyles,
    focusStyles,
    textSize,
    "text-left",
    item.level === 0 && !isSection && "mt-6 font-semibold",
    isActive && item.level > 0 && "bg-accent text-accent-foreground",
  );
}

function NavList({
  items,
  currentPath,
  isSection,
  onSelect,
}: {
  items: FlatNavItem[];
  currentPath?: string;
  isSection?: boolean;
  onSelect: (item: NavItem) => void;
}) {
  if (!items.length) return null;

  return (
    <div>
      {isSection && (
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground pl-2">
          Sections
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = item.path === currentPath;
          return (
            <div
              key={item.path ?? item.label}
              className="w-full group"
              style={{
                marginLeft:
                  item.level > 1 ? BASE_INDENT * item.level : undefined,
              }}
              onClick={() => item.path && onSelect(item)}
            >
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                disabled={!item.path}
                className={getButtonClasses(item, isSection ?? false, isActive)}
                onClick={() => onSelect(item)}
              >
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MobileNav({
  items = [],
  currentPath,
  onSelect,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const flatItems = flattenNavItems(items);
  const topLevel = flatItems.filter((i) => i.level === 0);
  const nested = flatItems.filter(
    (i) => i.level > 0 || (i.level === 0 && i.items?.length),
  );

  const handleSelect = (item: NavItem) => {
    onSelect?.(item);
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
            aria-label={
              open ? "Close mobile navigation" : "Open mobile navigation"
            }
          >
            <MenuIcon isOpen={open} />
          </Button>
        )}
      />
      <DrawerContent className="max-h-[80vh] p-0">
        <nav className="px-6 py-4 overflow-y-auto">
          <NavList
            items={topLevel}
            currentPath={currentPath}
            onSelect={handleSelect}
            isSection
          />
          <NavList
            items={nested}
            currentPath={currentPath}
            onSelect={handleSelect}
          />
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
