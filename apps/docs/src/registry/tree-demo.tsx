import { FileIcon, FolderIcon } from "lucide-react";
import { Tree, useTree, type TreeNode } from "@nui/core";

const treeData: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <FolderIcon className="h-4 w-4" />,
    expanded: true,
    children: [
      {
        id: "components",
        label: "components",
        icon: <FolderIcon className="h-4 w-4" />,
        expanded: true,
        children: [
          {
            id: "button.tsx",
            label: "Button.tsx",
            icon: <FileIcon className="h-4 w-4" />,
            href: "/components/button",
          },
          {
            id: "input.tsx",
            label: "Input.tsx",
            icon: <FileIcon className="h-4 w-4" />,
            href: "/components/input",
          },
        ],
      },
      {
        id: "pages",
        label: "pages",
        icon: <FolderIcon className="h-4 w-4" />,
        children: [
          {
            id: "index.tsx",
            label: "index.tsx",
            icon: <FileIcon className="h-4 w-4" />,
            href: "/",
          },
          {
            id: "about.tsx",
            label: "about.tsx",
            icon: <FileIcon className="h-4 w-4" />,
            href: "/about",
          },
        ],
      },
    ],
  },
  {
    id: "package.json",
    label: "package.json",
    icon: <FileIcon className="h-4 w-4" />,
    href: "/package.json",
  },
];

export default function TreeDemo() {
  const { data, selectedId, handleSelect, handleToggle, handleNavigate } =
    useTree(treeData, {
      onNavigate: (href: string, node: TreeNode) => {
        console.log("Navigate to:", href, node);
      },
    });

  return (
    <div className="w-full max-w-sm border border-border rounded-lg bg-background p-4">
      <h3 className="text-sm font-medium mb-3">File Explorer</h3>
      <Tree
        data={data}
        selectedId={selectedId}
        onSelect={handleSelect}
        onToggle={handleToggle}
        onNavigate={handleNavigate}
        aria-label="File explorer tree"
      />
    </div>
  );
}
