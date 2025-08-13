import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Types
export interface ThemeConfig {
  mode: "light" | "dark" | "auto";
  variant: string;
}

export interface ThemeContextValue {
  config: ThemeConfig;
  isDark: boolean;
  availableVariants: string[];
  setConfig: (config: ThemeConfig) => void;
  setMode: (mode: "light" | "dark" | "auto") => void;
  toggleMode: () => void;
  setVariant: (variant: string) => void;
  cycleVariant: (available: string[]) => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  availableVariants?: string[];
  defaultTheme?: Partial<ThemeConfig>;
  disableStorage?: boolean;
}

// Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Default available variants based on theme.css
const DEFAULT_VARIANTS = ["default", "slate", "purple", "blue"];

// Helper functions
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(storageKey: string): Partial<ThemeConfig> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredTheme(storageKey: string, config: ThemeConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
}

function applyTheme(config: ThemeConfig): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  // Remove existing theme classes
  root.classList.remove("dark");
  root.removeAttribute("data-theme");

  // Apply mode
  const isDark =
    config.mode === "dark" ||
    (config.mode === "auto" && getSystemTheme() === "dark");

  if (isDark) {
    root.classList.add("dark");
  }

  // Apply variant
  if (config.variant && config.variant !== "default") {
    root.setAttribute("data-theme", config.variant);
  }
}

// Theme Provider Component
export function ThemeProvider({
  children,
  storageKey = "theme",
  availableVariants = DEFAULT_VARIANTS,
  defaultTheme = {},
  disableStorage = false,
}: ThemeProviderProps) {
  const [config, setConfigState] = useState<ThemeConfig>(() => {
    const stored = disableStorage ? null : getStoredTheme(storageKey);
    const initialConfig = {
      mode: stored?.mode || defaultTheme.mode || "auto",
      variant: stored?.variant || defaultTheme.variant || "default",
    };

    // Apply theme immediately on initialization
    if (typeof window !== "undefined") {
      applyTheme(initialConfig);
    }

    return initialConfig;
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      config.mode === "dark" ||
      (config.mode === "auto" && getSystemTheme() === "dark")
    );
  });

  // Update isDark when config changes
  useEffect(() => {
    const newIsDark =
      config.mode === "dark" ||
      (config.mode === "auto" && getSystemTheme() === "dark");
    setIsDark(newIsDark);
    applyTheme(config);
  }, [config]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (config.mode !== "auto") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newIsDark = mediaQuery.matches;
      setIsDark(newIsDark);
      applyTheme(config);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [config]);

  // Save to storage when config changes
  useEffect(() => {
    if (!disableStorage) {
      setStoredTheme(storageKey, config);
    }
  }, [config, storageKey, disableStorage]);

  const setConfig = (newConfig: ThemeConfig) => {
    setConfigState(newConfig);
  };

  const setMode = (mode: "light" | "dark" | "auto") => {
    setConfigState((prev) => ({ ...prev, mode }));
  };

  const toggleMode = () => {
    setConfigState((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  };

  const setVariant = (variant: string) => {
    setConfigState((prev) => ({ ...prev, variant }));
  };

  const cycleVariant = (available: string[] = availableVariants) => {
    setConfigState((prev) => {
      const currentIndex = available.indexOf(prev.variant);
      const nextIndex = (currentIndex + 1) % available.length;
      return { ...prev, variant: available[nextIndex] };
    });
  };

  const value: ThemeContextValue = {
    config,
    isDark,
    availableVariants,
    setConfig,
    setMode,
    toggleMode,
    setVariant,
    cycleVariant,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Hook
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
