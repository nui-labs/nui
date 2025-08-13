import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { MonitorIcon, MoonIcon, PaletteIcon, SunIcon } from "lucide-react";

import { cn } from "../utils/cn";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTheme } from "./theme-provider";

// Theme Toggle Variants
const themeToggleVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium text-sm outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
        outline:
          "border shadow-xs bg-transparent hover:bg-muted hover:text-muted-foreground",
        ghost: "bg-transparent hover:bg-muted hover:text-muted-foreground",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ThemeToggleProps
  extends Omit<React.ComponentProps<typeof Button>, "variant" | "size">,
    VariantProps<typeof themeToggleVariants> {
  mode?: "simple" | "dropdown" | "combined";
  showVariants?: boolean;
}

// Simple toggle between light/dark
function SimpleThemeToggle({
  className,
  variant,
  size,
  ...props
}: Omit<ThemeToggleProps, "mode" | "showVariants">) {
  const { config, setMode, isDark } = useTheme();

  const handleToggle = () => {
    if (config.mode === "auto") {
      setMode(isDark ? "light" : "dark");
    } else {
      setMode(config.mode === "light" ? "dark" : "light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(themeToggleVariants({ variant, size }), className)}
      {...props}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-out [.dark_&]:-rotate-90 [.dark_&]:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ease-out [.dark_&]:rotate-0 [.dark_&]:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Dropdown with all options
function DropdownThemeToggle({
  className,
  variant,
  size,
  showVariants = false,
  ...props
}: Omit<ThemeToggleProps, "mode">) {
  const { config, setMode, setVariant, availableVariants } = useTheme();

  const getModeIcon = () => {
    switch (config.mode) {
      case "light":
        return <SunIcon className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <MoonIcon className="h-[1.2rem] w-[1.2rem]" />;
      case "auto":
        return <MonitorIcon className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <SunIcon className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(themeToggleVariants({ variant, size }), className)}
        {...props}
      >
        {getModeIcon()}
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setMode("light")}>
          <SunIcon className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode("dark")}>
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode("auto")}>
          <MonitorIcon className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>

        {showVariants && availableVariants.length > 1 && (
          <>
            <DropdownMenuSeparator />
            {availableVariants.map((variantName) => (
              <DropdownMenuItem
                key={variantName}
                onClick={() => setVariant(variantName)}
              >
                <PaletteIcon className="mr-2 h-4 w-4" />
                <span className="capitalize">{variantName}</span>
                {config.variant === variantName && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Combined toggle with separate variant selector
function CombinedThemeToggle({
  className,
  variant,
  size,
  showVariants = true,
  ...props
}: Omit<ThemeToggleProps, "mode">) {
  const { config, setMode, setVariant, availableVariants, isDark } = useTheme();

  const handleModeToggle = () => {
    if (config.mode === "auto") {
      setMode(isDark ? "light" : "dark");
    } else {
      setMode(config.mode === "light" ? "dark" : "light");
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleModeToggle}
        className={cn(themeToggleVariants({ variant, size }))}
        {...props}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-out [.dark_&]:-rotate-90 [.dark_&]:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ease-out [.dark_&]:rotate-0 [.dark_&]:scale-100" />
        <span className="sr-only">Toggle theme mode</span>
      </Button>

      {showVariants && availableVariants.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(themeToggleVariants({ variant, size }))}
          >
            <PaletteIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Select theme variant</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableVariants.map((variantName) => (
              <DropdownMenuItem
                key={variantName}
                onClick={() => setVariant(variantName)}
              >
                <PaletteIcon className="mr-2 h-4 w-4" />
                <span className="capitalize">{variantName}</span>
                {config.variant === variantName && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// Main ThemeToggle component
export function ThemeToggle({
  mode = "simple",
  showVariants = false,
  ...props
}: ThemeToggleProps) {
  switch (mode) {
    case "dropdown":
      return <DropdownThemeToggle showVariants={showVariants} {...props} />;
    case "combined":
      return <CombinedThemeToggle showVariants={showVariants} {...props} />;
    default:
      return <SimpleThemeToggle {...props} />;
  }
}

export { themeToggleVariants };
