import { FileIcon, GitBranchIcon } from "lucide-react";
import { Tree, useTree, type TreeNode } from "@nui/core";

const gitTreeData: TreeNode[] = [
  {
    id: "main",
    label: "main",
    icon: <GitBranchIcon className="h-4 w-4" />,
    expanded: true,
    children: [
      {
        id: "feature-auth",
        label: "feature/auth",
        icon: <GitBranchIcon className="h-4 w-4" />,
        children: [
          {
            id: "login.tsx",
            label: "login.tsx",
            icon: <FileIcon className="h-4 w-4" />,
            badge: "M",
          },
          {
            id: "signup.tsx",
            label: "signup.tsx",
            icon: <FileIcon className="h-4 w-4" />,
            badge: "A",
          },
        ],
      },
      {
        id: "hotfix-styles",
        label: "hotfix/styles",
        icon: <GitBranchIcon className="h-4 w-4" />,
        children: [
          {
            id: "styles.css",
            label: "styles.css",
            icon: <FileIcon className="h-4 w-4" />,
            badge: "M",
          },
        ],
      },
    ],
  },
];

export default function TreeVariants() {
  const { data, selectedId, handleSelect, handleToggle, handleNavigate } =
    useTree(gitTreeData, {
      onNavigate: (href: string, node: TreeNode) => {
        console.log("Navigate to:", href, node);
      },
    });

  return (
    <div className="w-full max-w-sm border border-border rounded-lg bg-background p-4">
      <h3 className="text-sm font-medium mb-3">Git Branches</h3>
      <Tree
        data={data}
        selectedId={selectedId}
        onSelect={handleSelect}
        onToggle={handleToggle}
        onNavigate={handleNavigate}
        aria-label="Git branches tree"
      />
    </div>
  );
}
