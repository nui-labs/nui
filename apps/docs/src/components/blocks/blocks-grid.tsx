import { useState } from "react";
import { CodeIcon } from "lucide-react";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nui/core";
import type { RegistryItem } from "@nui/plugin-registry";

import { BlockTypeBadge } from "./block-type-badge";
import { BlocksPreview } from "./blocks-preview";
import { CodeViewer } from "./code-viewer";

interface BlocksGridProps {
  blocks: RegistryItem[];
  className?: string;
  baseHeight?: number;
  columns?: 2 | 4 | 6; // Grid columns: 2, 4, or 6
  emptyState?: React.ReactNode;
  responsive?: boolean; // Enable responsive column adjustment
}

interface BlockHeaderProps {
  block: RegistryItem;
}

// Memoized Block Header Component for better performance
const BlockHeader = ({ block }: BlockHeaderProps) => {
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <h2 className="font-bold text-lg sm:text-xl line-clamp-2 sm:line-clamp-1">
          {block.name}
        </h2>
        <BlockTypeBadge type={block.type} />
      </div>

      {/* View Code Button - Hidden on mobile */}
      <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
        <DialogTrigger
          render={(props) => (
            <Button
              {...props}
              variant="outline"
              size="sm"
              className="shrink-0 hidden sm:flex"
            >
              <CodeIcon className="size-4 mr-2" />
              <span>View Code</span>
            </Button>
          )}
        />
        <DialogContent
          className="!max-w-none !w-[95vw] sm:!w-[90vw] lg:!w-[85vw] h-[85vh] sm:h-[80vh] p-0 flex flex-col"
          style={{
            maxWidth: "95vw",
            width: "95vw",
          }}
        >
          <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b shrink-0">
            <DialogTitle className="text-sm sm:text-base line-clamp-1">
              {block.name} - Source Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <CodeViewer files={block.files} showFileTree={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Parse size config: only "1" (50%) or "2" (100%) for width/height
const parseSize = (size?: string, columns: number = 2) => {
  if (!size) return { width: 2, height: 2 }; // Default: full width, full height

  const [widthStr, heightStr] = size.split(":");

  // Only allow "1" (50%) or "2" (100%)
  const width = widthStr === "2" ? 2 : 1; // Default to 1 (50%)
  const height = heightStr === "1" ? 1 : 2; // Default to 2 (100%)

  // height=1 (50%) should span 1 row, height=2 (100%) should span 2 rows
  const heightSpan = height; // Height is always 1 or 2

  // Use responsive Tailwind classes to ensure they're included in the build
  const getResponsiveWidthClass = (width: number, columns: number) => {
    // On mobile: always full width (col-span-1 since grid is 1 column)
    // On larger screens: respect the width setting
    if (width === 2) {
      // Full width on all screen sizes
      switch (columns) {
        case 2:
          return "col-span-1 sm:col-span-2";
        case 4:
          return "col-span-1 sm:col-span-2 lg:col-span-4";
        case 6:
          return "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-6";
        default:
          return "col-span-1 sm:col-span-2";
      }
    } else {
      // Half width on larger screens, full width on mobile
      switch (columns) {
        case 2:
          return "col-span-1";
        case 4:
          return "col-span-1 sm:col-span-1 lg:col-span-2";
        case 6:
          return "col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-3";
        default:
          return "col-span-1";
      }
    }
  };

  const getHeightClass = (span: number) => {
    return span === 1 ? "row-span-1" : "row-span-2";
  };

  return {
    width,
    height,
    cssClasses: `${getResponsiveWidthClass(width, columns)} ${getHeightClass(heightSpan)}`,
  };
};

export function BlocksGrid({
  blocks,
  className,
  columns = 2,
  emptyState,
}: BlocksGridProps) {
  // Handle empty state
  if (blocks.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        {emptyState || (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blocks found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={`grid  gap-4 sm:gap-6`}>
        {blocks.map((block) => {
          const { cssClasses } = parseSize(block.size, columns);
          return (
            <div key={block.id} className={cn("flex flex-col", cssClasses)}>
              {/* Use the reusable BlockHeader component */}
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <BlockHeader block={block} />

                <div className="border border-border rounded-lg overflow-hidden bg-background">
                  <div className="p-4 sm:p-6 lg:p-8">
                    <BlocksPreview
                      name={block.id}
                      className="border-0 p-0 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
