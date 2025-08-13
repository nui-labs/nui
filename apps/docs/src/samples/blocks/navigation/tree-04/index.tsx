"use client";

import { CodeIcon, FileIcon, FolderIcon, ImageIcon } from "lucide-react";
import { Tree, useTree, type TreeNode } from "@nui/core";

// Simple file system tree data
const fileSystemData: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <FolderIcon />,
    expanded: true,
    children: [
      {
        id: "components",
        label: "components",
        icon: <FolderIcon />,
        expanded: true,
        children: [
          {
            id: "button.tsx",
            label: "Button.tsx",
            icon: <CodeIcon />,
            href: "/src/components/button.tsx",
          },
          {
            id: "input.tsx",
            label: "Input.tsx",
            icon: <CodeIcon />,
            href: "/src/components/input.tsx",
          },
        ],
      },
      {
        id: "pages",
        label: "pages",
        icon: <FolderIcon />,
        children: [
          {
            id: "index.tsx",
            label: "index.tsx",
            icon: <CodeIcon />,
            href: "/src/pages/index.tsx",
          },
          {
            id: "about.tsx",
            label: "about.tsx",
            icon: <CodeIcon />,
            href: "/src/pages/about.tsx",
          },
        ],
      },
    ],
  },
  {
    id: "public",
    label: "public",
    icon: <FolderIcon />,
    children: [
      {
        id: "logo.png",
        label: "logo.png",
        icon: <ImageIcon />,
        href: "/public/logo.png",
      },
      {
        id: "favicon.ico",
        label: "favicon.ico",
        icon: <ImageIcon />,
        href: "/public/favicon.ico",
      },
    ],
  },
  {
    id: "package.json",
    label: "package.json",
    icon: <FileIcon />,
    href: "/package.json",
  },
  {
    id: "readme.md",
    label: "README.md",
    icon: <FileIcon />,
    href: "/readme.md",
  },
];

export default function TreeView() {
  const {
    data,
    selectedId,
    handleSelect,
    handleToggle,
    handleNavigate,
    expandAll,
    collapseAll,
  } = useTree(fileSystemData, {
    onSelect: (nodeId: string, node: TreeNode) => {
      console.log("Selected:", nodeId, node.label);
    },
    onToggle: (nodeId: string, node: TreeNode, expanded: boolean) => {
      console.log("Toggled:", nodeId, node.label, "expanded:", expanded);
    },
    onNavigate: (href: string, node: TreeNode) => {
      console.log("Navigate to:", href, node.label);
      // In a real app: router.push(href);
    },
  });

  return (
    <div className="w-full max-w-sm border rounded-lg bg-background">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">File Explorer</h3>
          <div className="flex gap-1">
            <button
              onClick={expandAll}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
            >
              Collapse All
            </button>
          </div>
        </div>
        <Tree
          data={data}
          selectedId={selectedId}
          onSelect={handleSelect}
          onToggle={handleToggle}
          onNavigate={handleNavigate}
          aria-label="File system explorer"
        />
      </div>
    </div>
  );
}
