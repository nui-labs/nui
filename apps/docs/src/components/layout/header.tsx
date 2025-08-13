import { ThemeToggle } from "@nui/core";
import { ThemeCustomizer } from "@nui/core/src/tools/theme-editor/theme-customizer";
import type { NavItem } from "@nui/plugin-docs/src";

import { HeaderMenu } from "./header-menu";
import { HeaderSearch } from "./header-search";

export interface HeaderProps {
  title?: string;
  logo?: React.ReactNode;
  items?: NavItem[];
  currentPath?: string;
  children?: React.ReactNode;
  onSelect?: (item: NavItem) => void;
}

export function Header({
  title,
  logo,
  items = [],
  currentPath,
  children,
  onSelect,
}: HeaderProps) {
  const handleLogoClick = () => {
    if (onSelect) {
      onSelect({ label: "Home", path: "/" });
    }
  };

  return (
    children || (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 lg:gap-6">
          <button
            type="button"
            onClick={handleLogoClick}
            className="hidden lg:flex items-center gap-2 px-2 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to home page"
          >
            {logo && <span className="flex-shrink-0">{logo}</span>}
            {title && (
              <span className="text-lg font-semibold text-foreground tracking-tight">
                {title}
              </span>
            )}
          </button>

          <HeaderMenu
            items={items}
            currentPath={currentPath}
            onSelect={onSelect}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <HeaderSearch />
          <ThemeToggle mode="combined" showVariants />
          <ThemeCustomizer showLabel={false} />
        </div>
      </div>
    )
  );
}
