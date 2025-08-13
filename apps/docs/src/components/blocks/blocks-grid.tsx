import { cn } from "@nui/core";
import type { Block } from "@nui/vite-plugin-docs";

import { BlockCard } from "./block-card";

interface BlocksGridProps {
  blocks: Block[];
  className?: string;
  onBlockSelect?: (block: Block) => void;
  columns?: 1 | 2 | 3 | 4;
}

export function BlocksGrid({
  blocks,
  className,
  onBlockSelect,
  columns = 3,
}: BlocksGridProps) {
  const getGridClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className={cn("grid gap-6", getGridClass())}>
        {blocks.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            onViewDetails={onBlockSelect}
          />
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No blocks found
        </div>
      )}
    </div>
  );
}
