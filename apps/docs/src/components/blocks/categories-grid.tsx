import { cn } from "@nui/core";

import { CategoriesCard } from "./categories-card";

interface Category {
  name: string;
  count: number;
  description?: string;
}

interface CategoriesGridProps {
  categories: Category[];
  onCategorySelect: (category: string) => void;
  className?: string;
}

export function CategoriesGrid({
  categories,
  onCategorySelect,
  className,
}: CategoriesGridProps) {
  if (categories.length === 0) {
    return (
      <div className={cn("w-full text-center py-12", className)}>
        <p className="text-muted-foreground">No categories available.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {categories.map((category) => (
        <CategoriesCard
          key={category.name}
          category={category.name}
          count={category.count}
          description={category.description}
          onClick={() => onCategorySelect(category.name)}
          className="h-full"
        />
      ))}
    </div>
  );
}
