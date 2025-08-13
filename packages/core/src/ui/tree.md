# Tree Component

A fully accessible, keyboard-navigable tree component with support for icons, badges, selection, and custom rendering.

## Features

- ✅ **Accessibility**: Full ARIA support with proper roles and keyboard navigation
- ✅ **Keyboard Navigation**: Arrow keys, Enter, Space for complete keyboard control
- ✅ **Icons & Badges**: Support for custom icons and badges on tree items
- ✅ **Selection State**: Built-in selection management with visual feedback
- ✅ **Custom Rendering**: Flexible rendering for icons, badges, and labels
- ✅ **Navigation Support**: Built-in href handling for navigation
- ✅ **Disabled State**: Support for disabled tree items
- ✅ **Expandable/Collapsible**: Smooth animations with Collapsible component
- ✅ **TypeScript**: Full type safety with comprehensive interfaces

## Basic Usage

```tsx
import { FileIcon, FolderIcon } from "lucide-react";
import { Tree, useTree, type TreeNode } from "@nui/core";

const data: TreeNode[] = [
  {
    id: "folder1",
    label: "Documents",
    icon: <FolderIcon />,
    expanded: true,
    children: [
      {
        id: "file1",
        label: "document.pdf",
        icon: <FileIcon />,
        href: "/documents/document.pdf",
      },
    ],
  },
];

function MyTree() {
  const { data, selectedId, handleSelect, handleToggle, handleNavigate } =
    useTree(data);

  return (
    <Tree
      data={data}
      selectedId={selectedId}
      onSelect={handleSelect}
      onToggle={handleToggle}
      onNavigate={handleNavigate}
      aria-label="File explorer"
    />
  );
}
```

## Advanced Usage with useTree Hook

```tsx
const {
  data,
  selectedId,
  expandedIds,
  handleSelect,
  handleToggle,
  handleNavigate,
  expandAll,
  collapseAll,
  isExpanded,
  isSelected,
  findNode,
  updateNode,
} = useTree(initialData, {
  defaultExpanded: ["folder1", "folder2"],
  defaultSelected: "file1",
  onSelect: (nodeId, node) => console.log("Selected:", node.label),
  onToggle: (nodeId, node, expanded) => console.log("Toggled:", node.label),
  onNavigate: (href, node) => router.push(href),
});
```

## Custom Rendering

```tsx
<Tree
  data={data}
  renderIcon={(node) => <CustomIcon type={node.type} className="w-4 h-4" />}
  renderBadge={(badge) => <CustomBadge variant="custom">{badge}</CustomBadge>}
  renderLabel={(node) => (
    <div className="flex items-center gap-2">
      <span>{node.label}</span>
      {node.isNew && <span className="text-xs text-green-500">NEW</span>}
    </div>
  )}
/>
```

## Keyboard Navigation

- **Arrow Down/Up**: Navigate between visible tree items
- **Arrow Right**: Expand collapsed nodes with children
- **Arrow Left**: Collapse expanded nodes
- **Enter/Space**: Toggle expansion state
- **Tab**: Move focus to next focusable element

## API Reference

### TreeNode Interface

```tsx
interface TreeNode {
  id: string; // Unique identifier
  label: string; // Display text
  children?: TreeNode[]; // Child nodes
  expanded?: boolean; // Expansion state
  disabled?: boolean; // Disabled state
  icon?: React.ReactNode; // Icon component
  badge?: string | number; // Badge content
  href?: string; // Navigation URL
  [key: string]: any; // Custom properties
}
```

### Tree Props

```tsx
interface TreeProps {
  data: TreeNode[]; // Tree data
  selectedId?: string; // Selected node ID
  onSelect?: (nodeId: string, node: TreeNode) => void; // Selection handler
  onToggle?: (nodeId: string, node: TreeNode) => void; // Toggle handler
  onNavigate?: (href: string, node: TreeNode) => void; // Navigation handler
  className?: string; // Container class
  itemClassName?: string; // Item class
  iconClassName?: string; // Icon class
  badgeClassName?: string; // Badge class
  renderIcon?: (node: TreeNode) => React.ReactNode; // Custom icon renderer
  renderBadge?: (badge: string | number) => React.ReactNode; // Custom badge renderer
  renderLabel?: (node: TreeNode) => React.ReactNode; // Custom label renderer
  "aria-label"?: string; // Accessibility label
  "aria-labelledby"?: string; // Accessibility labelledby
}
```

### useTree Hook

```tsx
function useTree(
  initialData: TreeNode[],
  options?: {
    defaultExpanded?: string[];
    defaultSelected?: string;
    onSelect?: (nodeId: string, node: TreeNode) => void;
    onToggle?: (nodeId: string, node: TreeNode, expanded: boolean) => void;
    onNavigate?: (href: string, node: TreeNode) => void;
  },
): UseTreeReturn;
```

## Examples

See the navigation blocks in the documentation for complete examples:

- `tree-01`: Enhanced navigation with icons and badges
- `tree-02`: Tree with visual connecting lines
- `tree-03`: File system explorer with different file types
- `tree-04`: Simple file explorer with expand/collapse all
