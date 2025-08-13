import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@nui/core";

import type { TreeNode } from "./data";
import { treeData } from "./data";

interface TreeItemProps {
  node: TreeNode;
  level: number;
  onToggle: (nodeId: string) => void;
  isLast?: boolean;
  parentLines?: boolean[];
}

function TreeItem({
  node,
  level,
  onToggle,
  isLast = false,
  parentLines = [],
}: TreeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.expanded;

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer relative",
          "text-sm",
        )}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        {/* Vertical lines for parent levels */}
        {parentLines.map((showLine, index) => (
          <div
            key={index}
            className={cn(
              "absolute w-px bg-border",
              showLine ? "opacity-100" : "opacity-0",
            )}
            style={{
              left: `${index * 16 + 16}px`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}

        {/* Current level connector */}
        {level > 0 && (
          <>
            {/* Vertical line */}
            <div
              className="absolute w-px bg-border"
              style={{
                left: `${level * 16 + 16}px`,
                top: 0,
                bottom: isLast ? "50%" : "100%",
              }}
            />
            {/* Horizontal line */}
            <div
              className="absolute h-px bg-border"
              style={{
                left: `${level * 16 + 16}px`,
                top: "50%",
                width: "12px",
              }}
            />
          </>
        )}

        <div
          className="flex items-center min-w-0 flex-1"
          style={{ paddingLeft: `${level * 16 + (level > 0 ? 20 : 8)}px` }}
        >
          {hasChildren ? (
            <div className="mr-1 flex-shrink-0">
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </div>
          ) : (
            <div className="w-5 flex-shrink-0" />
          )}
          <span className="truncate">{node.label}</span>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child, index) => {
            const isChildLast = index === node.children!.length - 1;
            const newParentLines = [...parentLines];
            if (level >= 0) {
              newParentLines[level] = !isLast;
            }

            return (
              <TreeItem
                key={child.id}
                node={child}
                level={level + 1}
                onToggle={onToggle}
                isLast={isChildLast}
                parentLines={newParentLines}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TreeViewWithLines() {
  const [nodes, setNodes] = useState<TreeNode[]>(treeData);

  const toggleNode = (nodeId: string) => {
    const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };

    setNodes(updateNodes(nodes));
  };

  return (
    <div className="w-full max-w-sm border rounded-lg bg-background">
      <div className="p-4">
        <h3 className="text-sm font-medium mb-3">
          Tree View with Visual Connecting Lines
        </h3>
        <div className="space-y-0">
          {nodes.map((node, index) => (
            <TreeItem
              key={node.id}
              node={node}
              level={0}
              onToggle={toggleNode}
              isLast={index === nodes.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
