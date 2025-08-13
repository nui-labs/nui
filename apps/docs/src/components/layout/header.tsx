import { ThemeToggle } from "@nui/core";
import type { NavItem } from "@nui/vite-plugin-docs";

import { HeaderMenu } from "./header-menu";
import { HeaderSearch } from "./header-search";

export interface HeaderProps {
  title?: string;
  items?: NavItem[];
  currentPath?: string;
  children?: React.ReactNode;
  onSelect?: (item: NavItem) => void;
}

export const Header = ({
  title,
  items = [],
  currentPath,
  children,
  onSelect,
}: HeaderProps) => {
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
            className="text-lg font-semibold text-foreground tracking-tight px-2 hover:text-primary transition-colors cursor-pointer"
            aria-label="Go to home page"
          >
            {title}
          </button>

          <HeaderMenu
            items={items}
            currentPath={currentPath}
            onSelect={onSelect}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderSearch />
          <ThemeToggle mode="combined" showVariants />
        </div>
      </div>
    )
  );
};
