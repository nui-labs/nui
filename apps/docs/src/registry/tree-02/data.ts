export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
  type?: "folder" | "file";
}

export const treeData: TreeNode[] = [
  {
    id: "engineering",
    label: "Engineering",
    type: "folder",
    expanded: true,
    children: [
      {
        id: "frontend",
        label: "Frontend",
        type: "folder",
        expanded: true,
        children: [
          {
            id: "design-system",
            label: "Design System",
            type: "folder",
            expanded: true,
            children: [
              { id: "components", label: "Components", type: "file" },
              { id: "tokens", label: "Tokens", type: "file" },
              { id: "guidelines", label: "Guidelines", type: "file" },
            ],
          },
          { id: "web-platform", label: "Web Platform", type: "file" },
        ],
      },
      {
        id: "backend",
        label: "Backend",
        type: "folder",
        expanded: false,
        children: [
          { id: "platform-team", label: "Platform Team", type: "file" },
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    type: "folder",
    expanded: false,
    children: [],
  },
  {
    id: "operations",
    label: "Operations",
    type: "folder",
    expanded: false,
    children: [],
  },
];
