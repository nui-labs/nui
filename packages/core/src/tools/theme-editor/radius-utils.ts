/**
 * Base radius token names
 */
const BASE_RADIUS_TOKENS = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;

/**
 * Fallback values for base radius tokens (when CSS is not available)
 */
const BASE_RADIUS_DEFAULTS: Record<string, string> = {
  none: "0px",
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
};

/**
 * Get base radius value from CSS custom properties
 */
function getBaseRadiusValueFromTheme(token: string): string {
  if (typeof document === "undefined") {
    return BASE_RADIUS_DEFAULTS[token] || "0px";
  }

  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(`--radius-${token}`)
    .trim();

  // Return computed value if available, otherwise use fallback
  return computed || BASE_RADIUS_DEFAULTS[token] || "0px";
}

/**
 * Generate base radius configuration dynamically from theme
 */
function createBaseRadiusConfig() {
  const config = {} as Record<
    (typeof BASE_RADIUS_TOKENS)[number],
    {
      label: string;
      token: string;
      className: string;
      value: string;
    }
  >;

  for (const token of BASE_RADIUS_TOKENS) {
    config[token] = {
      label: token,
      token: `--radius-${token}`,
      className: `rounded-${token}`,
      value: getBaseRadiusValueFromTheme(token), // ✅ Dynamic from theme
    };
  }

  return config;
}

/**
 * Base radius configuration - dynamically generated from theme
 */
export const BASE_RADIUS_CONFIG = createBaseRadiusConfig();

/**
 * Base radius token types extracted from tokens array
 */
export type BaseRadiusToken = (typeof BASE_RADIUS_TOKENS)[number];

/**
 * Semantic radius token types for component groups
 */
export type RadiusToken = "boxes" | "fields" | "selectors";

/**
 * Semantic radius token names
 */
const SEMANTIC_RADIUS_TOKENS = ["boxes", "fields", "selectors"] as const;

/**
 * Get semantic radius value from CSS custom properties
 */
function getSemanticRadiusValue(token: string): number {
  if (typeof document === "undefined") return 0;

  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(`--radius-${token}`)
    .trim();

  if (!computed) return 0;

  // Parse rem value (e.g., "0.75rem" -> 0.75)
  const match = computed.match(/^([\d.]+)rem$/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Default values for semantic radius tokens (fallback when CSS is not available)
 */
const SEMANTIC_RADIUS_DEFAULTS: Record<RadiusToken, number> = {
  boxes: 0.75, // 12px - matches --radius-xl
  fields: 0.5, // 8px - matches --radius-lg
  selectors: 0.25, // 4px - matches --radius-sm
};

/**
 * Generate semantic radius configuration from theme
 */
function createSemanticRadiusConfig() {
  const config = {} as Record<
    (typeof SEMANTIC_RADIUS_TOKENS)[number],
    {
      label: string;
      token: string;
      className: string;
      description: string;
      examples: string[];
      default: number;
    }
  >;

  const metadata = {
    boxes: {
      label: "Containers",
      description: "Large UI containers and overlays",
      examples: ["Dialog", "Sheet", "Card", "Alert"],
    },
    fields: {
      label: "Interactive",
      description: "Form controls and interactive elements",
      examples: ["Button", "Input", "Select", "Textarea"],
    },
    selectors: {
      label: "Indicators",
      description: "Small UI indicators and feedback elements",
      examples: ["Badge", "Checkbox", "Progress", "Switch"],
    },
  };

  for (const token of SEMANTIC_RADIUS_TOKENS) {
    // Use computed value if available, otherwise use fallback
    const computedValue = getSemanticRadiusValue(token);
    const defaultValue =
      computedValue > 0 ? computedValue : SEMANTIC_RADIUS_DEFAULTS[token];

    config[token] = {
      label: metadata[token].label,
      token: `--radius-${token}`,
      className: `rounded-${token}`,
      description: metadata[token].description,
      examples: metadata[token].examples,
      default: defaultValue,
    };
  }

  return config;
}

/**
 * Semantic radius configuration - computed from theme
 */
export const RADIUS_CONFIG = createSemanticRadiusConfig();

/**
 * Set radius value for a semantic group
 */
export function setRadius(group: RadiusToken, value: number): void {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      RADIUS_CONFIG[group].token,
      `${value}rem`,
    );
  }
}

/**
 * Get current radius value for a semantic group
 */
export function getRadius(group: RadiusToken): number {
  return getSemanticRadiusValue(group);
}

/**
 * Reset all radius values to defaults
 */
export function resetRadius(): void {
  if (typeof document === "undefined") return;

  // Use the fallback defaults instead of computed config.default
  Object.entries(SEMANTIC_RADIUS_DEFAULTS).forEach(([token, value]) => {
    document.documentElement.style.setProperty(
      `--radius-${token}`,
      `${value}rem`,
    );
  });
}
