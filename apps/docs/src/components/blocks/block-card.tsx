import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@nui/core";
import type { Block } from "@nui/vite-plugin-docs";

interface BlockCardProps {
  block: Block;
  className?: string;
  onViewDetails?: (block: Block) => void;
}

export function BlockCard({ block, className, onViewDetails }: BlockCardProps) {
  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm",
        className,
      )}
      onClick={() => onViewDetails?.(block)}
      data-block-id={block.id}
      data-testid={`block-${block.id}`}
    >
      {/* Simple preview placeholder */}
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="min-h-[200px] bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center">
          <div className="text-4xl font-bold text-muted-foreground/30">
            {block.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
              {block.name}
            </h3>
            {block.featured && (
              <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                Featured
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {block.description}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="outline" className="text-xs">
              {block.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {block.difficulty}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for smaller spaces
export function BlockCardCompact({
  block,
  className,
  onViewDetails,
}: Omit<BlockCardProps, "showPreview">) {
  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-shadow cursor-pointer",
        className,
      )}
      onClick={() => onViewDetails?.(block)}
      data-block-id={block.id}
      data-testid={`block-${block.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
            {block.name}
          </CardTitle>
          {block.featured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm line-clamp-1">
          {block.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {block.category}
            </Badge>
            <span>{block.files.length} files</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {block.difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
