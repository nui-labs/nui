import { normalizePath } from "vite";

import type { Block, ContentFile, Samples } from "../types";
import { buildNavigation } from "../utils/nav";

/**
 * Generate the `virtual:contents` module source.
 * - Exports an array of content entries with lazy-loaded React components
 * - Can also include a prebuilt navigation tree for quick rendering
 */
export function generateContentsModule(
  contentFiles: ContentFile[],
  samplesDir = "samples",
  includeNavigation = true,
): string {
  const moduleLines = [
    `import { lazy } from "react";`,
    ``,
    `export const contents = [${buildLazyEntries(contentFiles, samplesDir)}];`,
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
 * Generate the `virtual:samples` module source.
 * - Provides two exports: `components` and `blocks`
 * - Both contain lazy-loaded React entries with associated metadata
 */
export function generateSamplesModule(
  samples: Samples,
  samplesDir = "samples",
): string {
  return [
    `import { lazy } from "react";`,
    ``,
    `export const components = [${buildLazyEntries(samples.components, samplesDir)}];`,
    `export const blocks = [${buildLazyEntries(samples.blocks, samplesDir)}];`,
  ].join("\n");
}

/**
 * Build an array of entries for generated modules.
 * - Each entry includes its metadata and a `component` field
 * - The `component` is wrapped in `React.lazy` to enable code-splitting
 * - Handles both content files and blocks by resolving their import paths
 */
function buildLazyEntries(
  entries: (ContentFile | Block)[],
  samplesDir = "samples",
): string {
  if (!entries.length) return "";

  return `\n${entries
    .map((entry) => {
      const importPath =
        "filePath" in entry
          ? normalizePath(entry.filePath)
          : getBlockImportPath(entry.path, samplesDir);

      return `  {
    ...${JSON.stringify(entry)},
    component: lazy(() => import("${importPath}"))
  }`;
    })
    .join(",\n")}\n`;
}

/**
 * Generate import path for a block's index.tsx file
 */
function getBlockImportPath(blockPath: string, samplesDir: string): string {
  const cleanPath = blockPath.replace(/^\/+/, "").replace(/^samples\//, "");
  return normalizePath(`/${samplesDir}/${cleanPath}/index.tsx`);
}
