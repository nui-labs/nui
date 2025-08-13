export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
  disabled?: boolean;
  icon?: string;
  badge?: string | number;
  href?: string;
}

export const treeData: TreeNode[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "FolderOpen",
    badge: 12,
    expanded: true,
    children: [
      {
        id: "active-projects",
        label: "Active Projects",
        icon: "Play",
        badge: 8,
        expanded: true,
        children: [
          {
            id: "project-alpha",
            label: "Project Alpha",
            icon: "Zap",
            badge: "NEW",
            href: "/projects/alpha",
          },
          {
            id: "project-beta",
            label: "Project Beta",
            icon: "Star",
            href: "/projects/beta",
          },
          {
            id: "project-gamma",
            label: "Project Gamma",
            icon: "Rocket",
            disabled: true,
            href: "/projects/gamma",
          },
        ],
      },
      {
        id: "archived-projects",
        label: "Archived Projects",
        icon: "Archive",
        badge: 4,
        expanded: false,
        children: [
          {
            id: "project-legacy",
            label: "Legacy Project",
            icon: "History",
            href: "/projects/legacy",
          },
        ],
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: "Users",
    badge: 24,
    expanded: false,
    children: [
      {
        id: "developers",
        label: "Developers",
        icon: "Code",
        badge: 12,
        href: "/team/developers",
      },
      {
        id: "designers",
        label: "Designers",
        icon: "Palette",
        badge: 6,
        href: "/team/designers",
      },
      {
        id: "managers",
        label: "Managers",
        icon: "Crown",
        badge: 6,
        href: "/team/managers",
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "Settings",
    expanded: false,
    children: [
      {
        id: "general",
        label: "General",
        icon: "Sliders",
        href: "/settings/general",
      },
      {
        id: "security",
        label: "Security",
        icon: "Shield",
        href: "/settings/security",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: "Bell",
        badge: 3,
        href: "/settings/notifications",
      },
    ],
  },
];
