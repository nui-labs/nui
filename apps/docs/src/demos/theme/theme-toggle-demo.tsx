import { ThemeToggle } from "@nui/core";

export default function ThemeToggleDemo() {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle mode="simple" />
      <ThemeToggle mode="dropdown" />
      <ThemeToggle mode="combined" showVariants />
    </div>
  );
}
