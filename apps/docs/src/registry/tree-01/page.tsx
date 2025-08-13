import {
  ArchiveIcon,
  BellIcon,
  CodeIcon,
  CrownIcon,
  FolderOpenIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  PlayIcon,
  RocketIcon,
  SettingsIcon,
  ShieldIcon,
  SlidersIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { Tree, useTree, type TreeNode } from "@nui/core";

import { treeData } from "./data";

// Icon mapping
const iconMap = {
  LayoutDashboard: LayoutDashboardIcon,
  FolderOpen: FolderOpenIcon,
  Play: PlayIcon,
  Zap: ZapIcon,
  Star: StarIcon,
  Rocket: RocketIcon,
  Archive: ArchiveIcon,
  History: HistoryIcon,
  Users: UsersIcon,
  Code: CodeIcon,
  Palette: PaletteIcon,
  Crown: CrownIcon,
  Settings: SettingsIcon,
  Sliders: SlidersIcon,
  Shield: ShieldIcon,
  Bell: BellIcon,
} as const;

type IconName = keyof typeof iconMap;

// Helper function to get icon component
function getIconComponent(iconName?: string) {
  if (!iconName || !(iconName in iconMap)) return null;
  const IconComponent = iconMap[iconName as IconName];
  return <IconComponent className="h-4 w-4 shrink-0" />;
}

// Transform the data to include React icon components
function transformTreeData(data: any[]): TreeNode[] {
  return data.map((node) => ({
    ...node,
    icon: getIconComponent(node.icon),
    children: node.children ? transformTreeData(node.children) : undefined,
  }));
}

export default function TreeView() {
  const transformedData = transformTreeData(treeData);

  const { data, selectedId, handleSelect, handleToggle, handleNavigate } =
    useTree(transformedData, {
      onNavigate: (href: string, node: TreeNode) => {
        // In a real app, you would use your router here
        console.log("Navigate to:", href, node);
        // Example: router.push(href);
      },
    });

  return (
    <div className="w-full max-w-sm border rounded-lg bg-background">
      <div className="p-4">
        <h3 className="text-sm font-medium mb-3">Enhanced Tree Navigation</h3>
        <Tree
          data={data}
          selectedId={selectedId}
          onSelect={handleSelect}
          onToggle={handleToggle}
          onNavigate={handleNavigate}
          aria-label="Application navigation with icons and badges"
        />
      </div>
    </div>
  );
}
