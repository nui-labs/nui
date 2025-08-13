import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { blocks } from "virtual:registry";

import { BlocksGrid } from "../../components/blocks/blocks-grid";
import { CategoriesGrid } from "../../components/blocks/categories-grid";
import { Hero } from "../../components/layout/hero";

const Blocks = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // Filter to only show blocks (not components)
  const onlyBlocks = useMemo(
    () => blocks.filter((item) => item.type === "block"),
    [],
  );

  // Memoized categories with counts, sorted by popularity
  const categories = useMemo(
    () =>
      Object.entries(
        onlyBlocks.reduce<Record<string, number>>((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {}),
      )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    [onlyBlocks],
  );

  // Filter blocks by selected category
  const filteredBlocks = useMemo(
    () =>
      selectedCategory
        ? onlyBlocks.filter((block) => block.category === selectedCategory)
        : onlyBlocks,
    [selectedCategory, onlyBlocks],
  );

  // Navigation handlers
  const selectCategory = useCallback(
    (category: string) => {
      navigate(`/blocks?category=${encodeURIComponent(category)}`);
    },
    [navigate],
  );

  const backToCategories = useCallback(() => {
    navigate("/blocks");
  }, [navigate]);

  return (
    <main className="py-4">
      <Hero
        title="Build Faster. Stay Consistent."
        description="Clean, consistent building blocks you can drop into your apps. Move faster and ship with confidence."
      />

      <div className="space-y-4 sm:space-y-6 mt-6">
        {selectedCategory ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={backToCategories}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Categories
              </button>
              <div className="text-sm text-muted-foreground">
                Category:{" "}
                <span className="font-medium capitalize">
                  {selectedCategory}
                </span>
              </div>
            </div>
            <BlocksGrid blocks={filteredBlocks} columns={4} baseHeight={600} />
          </div>
        ) : (
          <CategoriesGrid
            categories={categories}
            onCategorySelect={selectCategory}
          />
        )}
      </div>
    </main>
  );
};

export default Blocks;
