import { ComponentIcon } from "lucide-react";
import { cn } from "@nui/core";

import { CATEGORY_PREVIEWS } from "./categories-preview";

interface CategoriesCardProps {
  category: string;
  count: number;
  onClick: () => void;
  className?: string;
  description?: string;
  typeBreakdown?: {
    example: number;
    component: number;
    template: number;
  };
}

// Category alias mapping for better matching
const CATEGORY_ALIASES: Record<string, keyof typeof CATEGORY_PREVIEWS> = {
  form: "forms",
  chart: "charts",
  auth: "authentication",
  "e-commerce": "ecommerce",
};

const DefaultPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
    <ComponentIcon className="w-8 h-8 text-muted-foreground/60" />
  </div>
);

const CategoryPreview = ({ category }: { category: string }) => {
  const normalizedKey = category
    .toLowerCase()
    .replace(/[-\s]/g, "") as keyof typeof CATEGORY_PREVIEWS;

  // Check direct match first, then aliases
  const previewKey = CATEGORY_PREVIEWS[normalizedKey]
    ? normalizedKey
    : CATEGORY_ALIASES[normalizedKey];

  return previewKey ? CATEGORY_PREVIEWS[previewKey]() : <DefaultPreview />;
};

export function CategoriesCard({
  category,
  count,
  onClick,
  className,
  typeBreakdown,
}: CategoriesCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative cursor-pointer transition-all duration-200 overflow-hidden",
        className,
      )}
      role="button"
      tabIndex={0}
    >
      <div className="aspect-[5/3] border rounded-lg ">
        <CategoryPreview category={category} />
      </div>

      <div className="p-4 text-center space-y-1">
        <h3 className="font-semibold capitalize">{category}</h3>
        <p className="text-sm text-muted-foreground">
          {count} Block{count !== 1 ? "s" : ""}
        </p>
        {typeBreakdown && (
          <p className="text-xs text-muted-foreground/70">
            <span className="text-blue-600 dark:text-blue-400">
              {typeBreakdown.example}E
            </span>
            {" · "}
            <span className="text-purple-600 dark:text-purple-400">
              {typeBreakdown.component}C
            </span>
            {" · "}
            <span className="text-amber-600 dark:text-amber-400">
              {typeBreakdown.template}T
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
