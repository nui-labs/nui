import { LayoutTemplateIcon, PackageIcon } from "lucide-react";
import type { RegistryType } from "@nui/plugin-registry";

const TYPE_CONFIG: Record<
  RegistryType,
  {
    label: string;
    icon: typeof PackageIcon;
    className: string;
  }
> = {
  block: {
    label: "Block",
    icon: LayoutTemplateIcon,
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  component: {
    label: "Component",
    icon: PackageIcon,
    className:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
};

interface BlockTypeBadgeProps {
  type: RegistryType;
  showIcon?: boolean;
  className?: string;
}

export function BlockTypeBadge({
  type,
  showIcon = true,
  className = "",
}: BlockTypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${config.className} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
