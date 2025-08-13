import { useEffect, useMemo, useState } from "react";
import { cn } from "@nui/core";
import type { TocItem } from "@nui/plugin-docs/src";

export interface TocProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  maxLevel?: number;
  minLevel?: number;
  items?: TocItem[];
}

export function Toc({
  children,
  className,
  title = "On this page",
  maxLevel = 3,
  minLevel = 2,
  items,
}: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  const tocItems = useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    return items.filter(
      (item) => item.level >= minLevel && item.level <= maxLevel,
    );
  }, [items, maxLevel, minLevel]);

  useEffect(() => {
    // Ensure headings have the correct IDs
    for (const item of tocItems) {
      const headings = Array.from(document.querySelectorAll(`h${item.level}`));
      for (const heading of headings) {
        if (heading.textContent?.trim() === item.text && !heading.id) {
          heading.id = item.id;
        }
      }
    }
  }, [tocItems]);

  useEffect(() => {
    // Set up intersection observer for active heading tracking
    const headingElements = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Get the first visible heading
          const firstVisible = visibleEntries[0];
          setActiveId(firstVisible.target.id);
        }
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      },
    );

    for (const element of headingElements) {
      if (element) observer.observe(element);
    }

    return () => {
      for (const element of headingElements) {
        if (element) observer.unobserve(element);
      }
    };
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (children) {
    return <>{children}</>;
  }

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="font-medium text-sm text-foreground mb-4">{title}</h4>
      <nav className="space-y-1">
        {tocItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            className={cn(
              "block w-full text-left text-sm transition-colors hover:text-foreground",
              "border-l-2 border-transparent pl-3 py-1",
              {
                "text-foreground border-l-primary": activeId === item.id,
                "text-muted-foreground": activeId !== item.id,
                "pl-6": item.level === 3,
                "pl-9": item.level === 4,
                "pl-12": item.level === 5,
                "pl-15": item.level === 6,
              },
            )}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
