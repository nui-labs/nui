import {
  Badge,
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nui/core";
import type { Block } from "@nui/vite-plugin-docs";

interface BlocksTableProps {
  blocks: Block[];
  onBlockSelect?: (block: Block) => void;
  className?: string;
}

export function BlocksTable({
  blocks,
  onBlockSelect,
  className,
}: BlocksTableProps) {
  return (
    <div className={cn("bg-card rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.map((block) => (
            <TableRow
              key={block.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onBlockSelect?.(block)}
            >
              <TableCell className="font-medium">{block.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{block.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {block.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No blocks found
        </div>
      )}
    </div>
  );
}
