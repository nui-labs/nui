import * as React from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  href?: string;
  [key: string]: any; // Allow additional custom properties
}

export interface TreeItemProps {
  node: TreeNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onSelect?: (nodeId: string) => void;
  selectedId?: string;
  onKeyDown?: (event: React.KeyboardEvent, nodeId: string) => void;
  onNavigate?: (href: string, node: TreeNode) => void;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  badgeClassName?: string;
  renderIcon?: (node: TreeNode) => React.ReactNode;
  renderBadge?: (badge: string | number) => React.ReactNode;
  renderLabel?: (node: TreeNode) => React.ReactNode;
}

export interface TreeProps {
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (nodeId: string, node: TreeNode) => void;
  onToggle?: (nodeId: string, node: TreeNode) => void;
  onNavigate?: (href: string, node: TreeNode) => void;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  badgeClassName?: string;
  renderIcon?: (node: TreeNode) => React.ReactNode;
  renderBadge?: (badge: string | number) => React.ReactNode;
  renderLabel?: (node: TreeNode) => React.ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      node,
      level,
      onToggle,
      onSelect,
      selectedId,
      onKeyDown,
      onNavigate,
      className,
      itemClassName,
      iconClassName,
      badgeClassName,
      renderIcon,
      renderBadge,
      renderLabel,
    },
    ref,
  ) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.expanded;
    const isSelected = selectedId === node.id;
    const isDisabled = node.disabled;
    const itemRef = React.useRef<HTMLButtonElement>(null);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (isDisabled) return;
        onKeyDown?.(event, node.id);
      },
      [onKeyDown, node.id, isDisabled],
    );

    const handleClick = React.useCallback(() => {
      if (isDisabled) return;

      if (hasChildren) {
        onToggle(node.id);
      }
      onSelect?.(node.id);

      // Handle navigation if href is provided
      if (node.href && onNavigate) {
        onNavigate(node.href, node);
      }
    }, [hasChildren, onToggle, onSelect, node, onNavigate, isDisabled]);

    // Default icon renderer
    const defaultRenderIcon = React.useCallback(
      (node: TreeNode) => {
        if (node.icon) {
          if (React.isValidElement(node.icon)) {
            return React.cloneElement(node.icon as React.ReactElement<any>, {
              className: cn("h-4 w-4 shrink-0", iconClassName),
            });
          }
        }
        return null;
      },
      [iconClassName],
    );

    // Default badge renderer
    const defaultRenderBadge = React.useCallback(
      (badge: string | number) => {
        return (
          <Badge
            variant={typeof badge === "string" ? "secondary" : "outline"}
            className={cn("ml-auto text-xs", badgeClassName)}
          >
            {badge}
          </Badge>
        );
      },
      [badgeClassName],
    );

    // Default label renderer
    const defaultRenderLabel = React.useCallback((node: TreeNode) => {
      return <span className="truncate text-left flex-1">{node.label}</span>;
    }, []);

    const iconComponent = renderIcon
      ? renderIcon(node)
      : defaultRenderIcon(node);
    const badgeComponent =
      node.badge &&
      (renderBadge ? renderBadge(node.badge) : defaultRenderBadge(node.badge));
    const labelComponent = renderLabel
      ? renderLabel(node)
      : defaultRenderLabel(node);

    if (hasChildren) {
      return (
        <div ref={ref} className={className}>
          <Collapsible open={isExpanded} onOpenChange={() => onToggle(node.id)}>
            <div style={{ paddingLeft: `${level * 16}px` }}>
              <CollapsibleTrigger
                render={(props) => (
                  <Button
                    {...props}
                    ref={itemRef}
                    variant="ghost"
                    size="sm"
                    disabled={isDisabled}
                    className={cn(
                      "w-full justify-start gap-2 h-8 px-2 text-sm font-normal",
                      "hover:bg-muted/50 focus-visible:bg-muted/50",
                      isSelected && "bg-accent text-accent-foreground",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      itemClassName,
                    )}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    aria-expanded={isExpanded}
                    aria-level={level + 1}
                    role="treeitem"
                    data-node-id={node.id}
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 shrink-0" />
                    )}
                    {iconComponent}
                    {labelComponent}
                    {badgeComponent}
                  </Button>
                )}
              />
            </div>
            <CollapsibleContent>
              <div role="group" aria-label={`${node.label} children`}>
                {node.children?.map((child) => (
                  <TreeItem
                    key={child.id}
                    node={child}
                    level={level + 1}
                    onToggle={onToggle}
                    onSelect={onSelect}
                    selectedId={selectedId}
                    onKeyDown={onKeyDown}
                    onNavigate={onNavigate}
                    className={className}
                    itemClassName={itemClassName}
                    iconClassName={iconClassName}
                    badgeClassName={badgeClassName}
                    renderIcon={renderIcon}
                    renderBadge={renderBadge}
                    renderLabel={renderLabel}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    // Leaf node
    return (
      <div
        ref={ref}
        className={className}
        style={{ paddingLeft: `${level * 16 + 20}px` }}
      >
        <Button
          ref={itemRef}
          variant="ghost"
          size="sm"
          disabled={isDisabled}
          className={cn(
            "w-full justify-start gap-2 h-8 px-2 text-sm font-normal",
            "hover:bg-muted/50 focus-visible:bg-muted/50",
            isSelected && "bg-accent text-accent-foreground",
            isDisabled && "opacity-50 cursor-not-allowed",
            itemClassName,
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-level={level + 1}
          role="treeitem"
          data-node-id={node.id}
        >
          {iconComponent}
          {labelComponent}
          {badgeComponent}
        </Button>
      </div>
    );
  },
);

TreeItem.displayName = "TreeItem";

// Utility function to flatten tree for keyboard navigation
function flattenTree(
  nodes: TreeNode[],
  level = 0,
): Array<{ id: string; level: number; node: TreeNode }> {
  const result: Array<{ id: string; level: number; node: TreeNode }> = [];

  for (const node of nodes) {
    result.push({ id: node.id, level, node });
    if (node.expanded && node.children) {
      result.push(...flattenTree(node.children, level + 1));
    }
  }

  return result;
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

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      selectedId,
      onSelect,
      onToggle,
      onNavigate,
      className,
      itemClassName,
      iconClassName,
      badgeClassName,
      renderIcon,
      renderBadge,
      renderLabel,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    ref,
  ) => {
    const [internalSelectedId, setInternalSelectedId] = React.useState<
      string | undefined
    >(selectedId);
    const treeRef = React.useRef<HTMLDivElement>(null);

    // Use internal state if no external selectedId is provided
    const currentSelectedId =
      selectedId !== undefined ? selectedId : internalSelectedId;

    const handleSelect = React.useCallback(
      (nodeId: string) => {
        const node = findNodeInTree(data, nodeId);
        if (!node) return;

        if (selectedId === undefined) {
          setInternalSelectedId(nodeId);
        }
        onSelect?.(nodeId, node);
      },
      [data, selectedId, onSelect],
    );

    const handleToggle = React.useCallback(
      (nodeId: string) => {
        const node = findNodeInTree(data, nodeId);
        if (!node) return;
        onToggle?.(nodeId, node);
      },
      [data, onToggle],
    );

    const handleNavigate = React.useCallback(
      (href: string, node: TreeNode) => {
        onNavigate?.(href, node);
      },
      [onNavigate],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent, nodeId: string) => {
        const flatNodes = flattenTree(data);
        const currentIndex = flatNodes.findIndex((item) => item.id === nodeId);

        if (currentIndex === -1) return;

        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, flatNodes.length - 1);
            const nextNodeId = flatNodes[nextIndex]?.id;
            if (nextNodeId) {
              handleSelect(nextNodeId);
              // Focus the next item
              const nextButton = treeRef.current?.querySelector(
                `[data-node-id="${nextNodeId}"]`,
              ) as HTMLButtonElement;
              nextButton?.focus();
            }
            break;
          }
          case "ArrowUp": {
            event.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            const prevNodeId = flatNodes[prevIndex]?.id;
            if (prevNodeId) {
              handleSelect(prevNodeId);
              // Focus the previous item
              const prevButton = treeRef.current?.querySelector(
                `[data-node-id="${prevNodeId}"]`,
              ) as HTMLButtonElement;
              prevButton?.focus();
            }
            break;
          }
          case "ArrowRight": {
            event.preventDefault();
            const currentNode = findNodeInTree(data, nodeId);
            if (currentNode?.children?.length && !currentNode.expanded) {
              handleToggle(nodeId);
            }
            break;
          }
          case "ArrowLeft": {
            event.preventDefault();
            const currentNode = findNodeInTree(data, nodeId);
            if (currentNode?.children?.length && currentNode.expanded) {
              handleToggle(nodeId);
            }
            break;
          }
          case "Enter":
          case " ": {
            event.preventDefault();
            const currentNode = findNodeInTree(data, nodeId);
            if (currentNode?.children?.length) {
              handleToggle(nodeId);
            }
            break;
          }
        }
      },
      [data, handleSelect, handleToggle],
    );

    return (
      <div
        ref={ref || treeRef}
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn("space-y-0", className)}
      >
        {data.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            level={0}
            onToggle={handleToggle}
            onSelect={handleSelect}
            selectedId={currentSelectedId}
            onKeyDown={handleKeyDown}
            onNavigate={handleNavigate}
            itemClassName={itemClassName}
            iconClassName={iconClassName}
            badgeClassName={badgeClassName}
            renderIcon={renderIcon}
            renderBadge={renderBadge}
            renderLabel={renderLabel}
          />
        ))}
      </div>
    );
  },
);

Tree.displayName = "Tree";

export { findNodeInTree, flattenTree, Tree, TreeItem };
