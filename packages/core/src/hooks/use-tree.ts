import * as React from "react";

import type { TreeNode } from "../ui/tree";

export interface UseTreeOptions {
  defaultExpanded?: string[];
  defaultSelected?: string;
  onSelect?: (nodeId: string, node: TreeNode) => void;
  onToggle?: (nodeId: string, node: TreeNode, expanded: boolean) => void;
  onNavigate?: (href: string, node: TreeNode) => void;
}

export interface UseTreeReturn {
  data: TreeNode[];
  selectedId: string | undefined;
  expandedIds: Set<string>;
  setData: React.Dispatch<React.SetStateAction<TreeNode[]>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string | undefined>>;
  toggleNode: (nodeId: string) => void;
  selectNode: (nodeId: string) => void;
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isExpanded: (nodeId: string) => boolean;
  isSelected: (nodeId: string) => boolean;
  findNode: (nodeId: string) => TreeNode | null;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
  handleSelect: (nodeId: string, node: TreeNode) => void;
  handleToggle: (nodeId: string, node: TreeNode) => void;
  handleNavigate: (href: string, node: TreeNode) => void;
}

// Utility function to update nodes recursively
function updateNodesRecursively(
  nodes: TreeNode[],
  nodeId: string,
  updates: Partial<TreeNode>,
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return { ...node, ...updates };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodesRecursively(node.children, nodeId, updates),
      };
    }
    return node;
  });
}

// Utility function to find a node in the tree
function findNodeInTree(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const found = findNodeInTree(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}

// Utility function to collect all node IDs
function collectAllNodeIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.id);
    if (node.children) {
      ids.push(...collectAllNodeIds(node.children));
    }
  }
  return ids;
}

// Utility function to collect expanded node IDs
function collectExpandedIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.expanded) {
      ids.push(node.id);
    }
    if (node.children) {
      ids.push(...collectExpandedIds(node.children));
    }
  }
  return ids;
}

export function useTree(
  initialData: TreeNode[],
  options: UseTreeOptions = {},
): UseTreeReturn {
  const {
    defaultExpanded = [],
    defaultSelected,
    onSelect,
    onToggle,
    onNavigate,
  } = options;

  const [data, setData] = React.useState<TreeNode[]>(() => {
    // Initialize with default expanded state
    if (defaultExpanded.length > 0) {
      return updateNodesRecursively(
        initialData,
        "",
        {}, // This will be handled by the initial expansion logic below
      );
    }
    return initialData;
  });

  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    defaultSelected,
  );

  // Track expanded state separately for better performance
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => {
    const initialExpanded = new Set(defaultExpanded);
    // Also include any nodes that are already expanded in the data
    const dataExpanded = collectExpandedIds(initialData);
    dataExpanded.forEach((id) => initialExpanded.add(id));
    return initialExpanded;
  });

  // Sync expanded state with data
  React.useEffect(() => {
    setData((currentData) => {
      return updateNodesRecursively(currentData, "", {});
    });
  }, [expandedIds]);

  const findNode = React.useCallback(
    (nodeId: string): TreeNode | null => {
      return findNodeInTree(data, nodeId);
    },
    [data],
  );

  const updateNode = React.useCallback(
    (nodeId: string, updates: Partial<TreeNode>) => {
      setData((currentData) =>
        updateNodesRecursively(currentData, nodeId, updates),
      );
    },
    [],
  );

  const toggleNode = React.useCallback(
    (nodeId: string) => {
      const node = findNode(nodeId);
      if (!node) return;

      const isCurrentlyExpanded = expandedIds.has(nodeId);
      const newExpanded = new Set(expandedIds);

      if (isCurrentlyExpanded) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }

      setExpandedIds(newExpanded);
      updateNode(nodeId, { expanded: !isCurrentlyExpanded });
    },
    [expandedIds, findNode, updateNode],
  );

  const selectNode = React.useCallback((nodeId: string) => {
    setSelectedId(nodeId);
  }, []);

  const expandNode = React.useCallback(
    (nodeId: string) => {
      const newExpanded = new Set(expandedIds);
      newExpanded.add(nodeId);
      setExpandedIds(newExpanded);
      updateNode(nodeId, { expanded: true });
    },
    [expandedIds, updateNode],
  );

  const collapseNode = React.useCallback(
    (nodeId: string) => {
      const newExpanded = new Set(expandedIds);
      newExpanded.delete(nodeId);
      setExpandedIds(newExpanded);
      updateNode(nodeId, { expanded: false });
    },
    [expandedIds, updateNode],
  );

  const expandAll = React.useCallback(() => {
    const allIds = collectAllNodeIds(data);
    const newExpanded = new Set(allIds);
    setExpandedIds(newExpanded);

    // Update all nodes to be expanded
    setData((currentData) => {
      const updateAllNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => ({
          ...node,
          expanded: node.children && node.children.length > 0,
          children: node.children ? updateAllNodes(node.children) : undefined,
        }));
      };
      return updateAllNodes(currentData);
    });
  }, [data]);

  const collapseAll = React.useCallback(() => {
    setExpandedIds(new Set());

    // Update all nodes to be collapsed
    setData((currentData) => {
      const updateAllNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => ({
          ...node,
          expanded: false,
          children: node.children ? updateAllNodes(node.children) : undefined,
        }));
      };
      return updateAllNodes(currentData);
    });
  }, []);

  const isExpanded = React.useCallback(
    (nodeId: string): boolean => {
      return expandedIds.has(nodeId);
    },
    [expandedIds],
  );

  const isSelected = React.useCallback(
    (nodeId: string): boolean => {
      return selectedId === nodeId;
    },
    [selectedId],
  );

  const handleSelect = React.useCallback(
    (nodeId: string, node: TreeNode) => {
      selectNode(nodeId);
      onSelect?.(nodeId, node);
    },
    [selectNode, onSelect],
  );

  const handleToggle = React.useCallback(
    (nodeId: string, node: TreeNode) => {
      const wasExpanded = isExpanded(nodeId);
      toggleNode(nodeId);
      onToggle?.(nodeId, node, !wasExpanded);
    },
    [toggleNode, isExpanded, onToggle],
  );

  const handleNavigate = React.useCallback(
    (href: string, node: TreeNode) => {
      onNavigate?.(href, node);
    },
    [onNavigate],
  );

  return {
    data,
    selectedId,
    expandedIds,
    setData,
    setSelectedId,
    toggleNode,
    selectNode,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
    isExpanded,
    isSelected,
    findNode,
    updateNode,
    handleSelect,
    handleToggle,
    handleNavigate,
  };
}
