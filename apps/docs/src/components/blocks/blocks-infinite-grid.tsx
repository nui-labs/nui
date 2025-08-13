"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  cn,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@nui/core";
import type { Block } from "@nui/vite-plugin-docs";

interface BlocksInfiniteGridProps {
  blocks: Block[];
  onBlockSelect: (block: Block) => void;
  className?: string;
  columns?: 2 | 4 | 6;
}

const ITEMS_PER_PAGE = 12;

const GRID_CLASSES = {
  2: "grid-cols-1 md:grid-cols-2",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
} as const;

export function BlocksInfiniteGrid({
  blocks,
  onBlockSelect,
  className,
  columns = 4,
}: BlocksInfiniteGridProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [selectedBlock, setSelectedBlock] = useState<string>("Search");
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [categorySearch, setCategorySearch] = useState("");
  const [blockSearch, setBlockSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Memoized categories with counts, sorted by popularity
  const categories = useMemo(
    () =>
      Object.entries(
        blocks.reduce(
          (acc, block) => {
            acc[block.category] = (acc[block.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    [blocks],
  );

  // Filter categories based on search
  const filteredCategories = useMemo(
    () =>
      categorySearch
        ? categories.filter((cat) =>
            cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
          )
        : categories,
    [categories, categorySearch],
  );

  // Filter blocks based on selected category and search
  const filteredBlocks = useMemo(() => {
    let filtered = blocks;

    // First filter by selected category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (block) => block.category === selectedCategory,
      );
    }

    // Then filter by search
    if (blockSearch) {
      filtered = filtered.filter((block) =>
        block.name.toLowerCase().includes(blockSearch.toLowerCase()),
      );
    }

    return filtered;
  }, [blocks, selectedCategory, blockSearch]);

  // Apply category and block filters
  const finalFilteredBlocks = useMemo(() => {
    let filtered = blocks;

    // Apply category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (block) => block.category === selectedCategory,
      );
    }

    // Apply block search filter
    if (selectedBlock !== "Search" && selectedBlock !== "") {
      filtered = filtered.filter((block) => block.name === selectedBlock);
    } else if (blockSearch) {
      filtered = filtered.filter((block) =>
        block.name.toLowerCase().includes(blockSearch.toLowerCase()),
      );
    }

    return filtered;
  }, [blocks, selectedCategory, selectedBlock, blockSearch]);

  // Get displayed blocks with pagination
  const displayedBlocks = finalFilteredBlocks.slice(0, displayedCount);
  const hasActiveFilters =
    selectedCategory !== "All Categories" || selectedBlock !== "Search";

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [selectedCategory, selectedBlock, blockSearch]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedCount < filteredBlocks.length
        ) {
          setDisplayedCount((prev) =>
            Math.min(prev + ITEMS_PER_PAGE, filteredBlocks.length),
          );
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, filteredBlocks.length]);

  // Event handlers
  const handleCategorySelect = useCallback(
    (category: string) => {
      // Toggle behavior: if clicking the same category, deselect it (go back to "All Categories")
      if (selectedCategory === category && category !== "All Categories") {
        setSelectedCategory("All Categories");
      } else {
        setSelectedCategory(category);
      }
      // Reset block selection when category changes
      setSelectedBlock("Search");
      setBlockSearch("");
    },
    [selectedCategory],
  );

  const handleBlockSelect = useCallback(
    (blockName: string) => {
      // Toggle behavior: if clicking the same block, deselect it (go back to "Search")
      if (selectedBlock === blockName && blockName !== "Search") {
        setSelectedBlock("Search");
      } else {
        setSelectedBlock(blockName);
      }
      setBlockSearch(""); // Clear search when selecting specific block
    },
    [selectedBlock],
  );

  const clearCategorySearch = useCallback(() => {
    setCategorySearch("");
  }, []);

  const clearBlockSearch = useCallback(() => {
    setBlockSearch("");
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory("All Categories");
    setSelectedBlock("Search");
    setBlockSearch("");
    setCategorySearch("");
  }, []);

  // Category Dropdown Component
  const CategoryDropdown = () => (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button
            {...props}
            variant="outline"
            className="w-48 justify-between h-10 px-3 text-sm font-normal"
          >
            <span className="text-muted-foreground text-xs">Category</span>
            <div className="flex items-center gap-2">
              <span className="capitalize truncate max-w-24">
                {selectedCategory}
              </span>
              <ChevronDownIcon className="h-4 w-4 shrink-0" />
            </div>
          </Button>
        )}
      />
      <PopoverContent className="w-64 p-0" align="start">
        <div className="border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="pl-9 pr-8 border-0 bg-transparent shadow-none focus:ring-0 focus:border-0"
            />
            {categorySearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCategorySearch}
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            <Button
              variant={
                selectedCategory === "All Categories" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => {
                handleCategorySelect("All Categories");
                clearCategorySearch();
              }}
              className="w-full justify-start mb-1"
            >
              <span>All Categories</span>
            </Button>
            {filteredCategories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "ghost"
                }
                size="sm"
                onClick={() => {
                  handleCategorySelect(category.name);
                  clearCategorySearch();
                }}
                className="w-full justify-between mb-1"
              >
                <span className="capitalize truncate">{category.name}</span>
                <Badge variant="secondary" className="text-xs relative z-0">
                  {category.count}
                </Badge>
              </Button>
            ))}
            {filteredCategories.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No categories found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );

  // Block Search Dropdown Component
  const BlockDropdown = () => (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button
            {...props}
            variant="outline"
            className="w-48 justify-between h-10 px-3 text-sm font-normal"
          >
            <span className="text-muted-foreground text-xs">Block</span>
            <div className="flex items-center gap-2">
              <span className="truncate max-w-24">{selectedBlock}</span>
              <ChevronDownIcon className="h-4 w-4 shrink-0" />
            </div>
          </Button>
        )}
      />
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blocks..."
              value={blockSearch}
              onChange={(e) => setBlockSearch(e.target.value)}
              className="pl-9 pr-8 border-0 bg-transparent shadow-none focus:ring-0 focus:border-0"
            />
            {blockSearch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearBlockSearch}
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-2">
            {filteredBlocks.map((block) => (
              <Button
                key={block.id}
                variant={selectedBlock === block.name ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  handleBlockSelect(block.name);
                  clearBlockSearch();
                }}
                className="w-full justify-between mb-1 h-auto py-2"
              >
                <span className="font-medium truncate text-left">
                  {block.name}
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs capitalize shrink-0 relative z-0"
                >
                  {block.category}
                </Badge>
              </Button>
            ))}
            {filteredBlocks.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No blocks found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className={cn("space-y-6 transition-all duration-200", className)}>
      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <CategoryDropdown />
        <BlockDropdown />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between min-h-[24px]">
        <p className="text-sm text-muted-foreground transition-all duration-200 ease-out">
          <span className="inline-block transition-all duration-200 ease-out">
            {finalFilteredBlocks.length}
          </span>{" "}
          block{finalFilteredBlocks.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Blocks Grid */}
      {finalFilteredBlocks.length > 0 ? (
        <>
          <div
            className={cn(
              "grid gap-6 transition-all duration-300 ease-out",
              GRID_CLASSES[columns],
            )}
          >
            {displayedBlocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onSelect={() => onBlockSelect(block)}
              />
            ))}
          </div>

          {/* Load More Trigger */}
          {displayedCount < finalFilteredBlocks.length && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              <div className="animate-pulse text-muted-foreground">
                Loading more blocks...
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No blocks found for the selected filters.
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface BlockCardProps {
  block: Block;
  onSelect: () => void;
}

function BlockCard({ block, onSelect }: BlockCardProps) {
  return (
    <Card
      className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm"
      onClick={onSelect}
    >
      <div className="aspect-video bg-muted/30 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        {/* Featured Badge */}
        {block.featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          </div>
        )}

        {/* Block Preview Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center">
          <div className="text-4xl font-bold text-muted-foreground/30">
            {block.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Block Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
            {block.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {block.description}
          </p>
        </div>

        {/* Category and Difficulty */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs capitalize">
            {block.category}
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {block.difficulty}
          </span>
        </div>
      </div>
    </Card>
  );
}
