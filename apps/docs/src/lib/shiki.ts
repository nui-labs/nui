import {
  getThemeForMode,
  normalizeLanguage,
  SHIKI_CONFIG,
  type SupportedTheme,
} from "./shiki-config";

// Create a singleton highlighter instance with dynamic imports
let highlighterPromise: Promise<any> | null = null;

export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      // Dynamic import to reduce initial bundle size
      const { createHighlighter } = await import("shiki");

      return createHighlighter(SHIKI_CONFIG);
    })();
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: string = "tsx",
  theme: SupportedTheme = "github-light",
): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    const safeLang = normalizeLanguage(lang);

    return highlighter.codeToHtml(code, {
      lang: safeLang,
      theme,
    });
  } catch (err) {
    console.error("Shiki highlight error:", err);
    return `<pre class="shiki"><code>${code}</code></pre>`;
  }
}

/**
 * Convenience function to highlight code with automatic theme detection
 */
export async function highlightCodeWithTheme(
  code: string,
  lang: string = "tsx",
  isDark: boolean = false,
): Promise<string> {
  const theme = getThemeForMode(isDark);
  return highlightCode(code, lang, theme);
}
