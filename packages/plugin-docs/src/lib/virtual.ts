import { normalizePath } from "vite";

import type { ContentFile } from "../types";
import { buildNavigation } from "../utils/nav";

/**
 * Generate the `virtual:contents` module source.
 * - Exports an array of content entries with lazy-loaded React components
 * - Can also include a prebuilt navigation tree for quick rendering
 */
export function generateContentsModule(
  contentFiles: ContentFile[],
  includeNavigation = true,
): string {
  const moduleLines = [
    `import { lazy } from "react";`,
    ``,
    `export const contents = [${buildLazyEntries(contentFiles)}];`,
  ];

  if (includeNavigation) {
    const navigation = buildNavigation(contentFiles);
    moduleLines.push(
      ``,
      `export const navigation = ${JSON.stringify(navigation, null, 2)};`,
    );
  }

  return moduleLines.join("\n");
}

/**
 * Build an array of entries for generated modules.
 * - Each entry includes its metadata and a `component` field
 * - The `component` is wrapped in `React.lazy` to enable code-splitting
 */
function buildLazyEntries(entries: ContentFile[]): string {
  if (!entries.length) return "";

  return `\n${entries
    .map((entry) => {
      const importPath = normalizePath(entry.filePath);

      return `  {
    ...${JSON.stringify(entry)},
    component: lazy(() => import("${importPath}"))
  }`;
    })
    .join(",\n")}\n`;
}
