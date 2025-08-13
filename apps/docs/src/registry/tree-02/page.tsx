import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from "lucide-react";
import { cn } from "@nui/core";

import type { TreeNode } from "./data";
import { treeData } from "./data";

interface TreeItemProps {
  node: TreeNode;
  level: number;
  onToggle: (nodeId: string) => void;
}

function TreeItem({ node, level, onToggle }: TreeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = node.expanded;
  const isFolder = node.type === "folder" || hasChildren;

  const getIcon = () => {
    if (!isFolder) {
      return <FileIcon className="h-4 w-4 text-muted-foreground" />;
    }

    if (isExpanded) {
      return <FolderOpenIcon className="h-4 w-4 text-blue-600" />;
    }

    return <FolderIcon className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 hover:bg-muted/50 cursor-pointer",
          "text-sm",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        <div className="flex items-center min-w-0 flex-1">
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
          <div className="mr-2 flex-shrink-0">{getIcon()}</div>
          <span className="truncate">{node.label}</span>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeViewWithIcons() {
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
        <h3 className="text-sm font-medium mb-3">Basic tree with icons</h3>
        <div className="space-y-0">
          {nodes.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              level={0}
              onToggle={toggleNode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
