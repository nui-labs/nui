/**
 * Shared Shiki configuration for both build-time (rehype) and runtime (preview) usage
 */

// Only the languages we actually use in our documentation
export const SUPPORTED_LANGUAGES = [
  "tsx",
  "typescript",
  "bash",
  "css",
  "json",
] as const;

// Only the themes we need
export const SUPPORTED_THEMES = ["github-light", "github-dark"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

/**
 * Shared Shiki configuration object for consistent setup
 */
export const SHIKI_CONFIG = {
  langs: [...SUPPORTED_LANGUAGES],
  themes: [...SUPPORTED_THEMES],
};

/**
 * Get the appropriate theme based on dark mode state
 */
export function getThemeForMode(isDark: boolean): SupportedTheme {
  return isDark ? "github-dark" : "github-light";
}

/**
 * Validate and normalize language input
 */
export function normalizeLanguage(lang: string): SupportedLanguage {
  const supportedLangs = SUPPORTED_LANGUAGES as readonly string[];
  return supportedLangs.includes(lang) ? (lang as SupportedLanguage) : "tsx";
}

/**
 * Configuration for rehype-shiki plugin (build-time)
 */
export const REHYPE_SHIKI_CONFIG = {
  theme: "github-light",
  langs: SUPPORTED_LANGUAGES,
} as const;
