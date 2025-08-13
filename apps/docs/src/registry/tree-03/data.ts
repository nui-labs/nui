export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
}

export const treeData: TreeNode[] = [
  {
    id: "engineering",
    label: "Engineering",
    expanded: true,
    children: [
      {
        id: "frontend",
        label: "Frontend",
        expanded: true,
        children: [
          {
            id: "design-system",
            label: "Design System",
            expanded: true,
            children: [
              { id: "components", label: "Components" },
              { id: "tokens", label: "Tokens" },
              { id: "guidelines", label: "Guidelines" },
            ],
          },
          { id: "web-platform", label: "Web Platform" },
        ],
      },
      {
        id: "backend",
        label: "Backend",
        expanded: false,
        children: [{ id: "platform-team", label: "Platform Team" }],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    expanded: false,
    children: [],
  },
  {
    id: "operations",
    label: "Operations",
    expanded: false,
    children: [],
  },
];
