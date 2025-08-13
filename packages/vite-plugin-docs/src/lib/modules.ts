import type { Block, ContentFile, NavItem } from "../types";
import { buildNavigation } from "./navigation";

/**
 * Create the virtual module source for docs/demos (and optional navigation).
 * - Sorts files when `sortOptions` is provided
 * - Builds navigation if `withNavigation` is true
 */
export function createVirtualModule(
  files: ContentFile[],
  withNavigation = true,
): string {
  // Apply sorting if requested
  const contents = filesToVirtualContents(files);

  const chunks = [
    `import { lazy } from "react";`,
    ``,
    `// Generated at ${new Date().toISOString()}`,
    `export const contents = [\n${contents}\n];`,
  ];

  if (withNavigation) {
    const navigation: NavItem[] = buildNavigation(files);
    chunks.push(
      ``,
      `export const navigation = ${JSON.stringify(navigation, null, 2)};`,
    );
  }

  return chunks.join("\n");
}

/**
 * Create the virtual module source for blocks.
 */
export function createBlocksVirtualModule(blocks: Block[]): string {
  const contents = blocksToVirtualContents(blocks);

  const chunks = [
    `import { lazy } from "react";`,
    ``,
    `// Generated at ${new Date().toISOString()}`,
    `export const blocks = [\n${contents}\n];`,
  ];

  return chunks.join("\n");
}

/**
 * Serialize ContentFile entries for the virtual module.
 * - Lazy loads TSX/MDX for better HMR and performance
 * - Removes undefined values for smaller output
 * - Normalizes slashes for cross-platform imports
 */
function filesToVirtualContents(files: ContentFile[]): string {
  if (files.length === 0) return "";

  return files
    .map((file) => {
      const { component: _ignore, ...rest } = file;

      // Always POSIX-style import paths
      const importPath = String(file.filePath).replace(/\\/g, "/");

      // Remove undefined fields before JSON serialization
      const cleaned = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined),
      );

      return `  {
    ...${JSON.stringify(cleaned, null, 4).replace(/\n/g, "\n    ")},
    component: lazy(() => import("${importPath}"))
  }`;
    })
    .join(",\n");
}

/**
 * Serialize Block entries for the virtual module.
 */
function blocksToVirtualContents(blocks: Block[]): string {
  if (blocks.length === 0) return "";

  return blocks
    .map((block) => {
      const { component: _ignore, ...rest } = block;

      // Remove undefined fields before JSON serialization
      const cleaned = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined),
      );

      // Find the preview component file
      const previewFile = block.files.find(
        (file) =>
          file.path.includes(`components/${block.preview.component}`) ||
          file.name === `${block.preview.component}.tsx` ||
          file.name === `${block.preview.component}.jsx`,
      );

      // Generate the correct import path relative to src/
      let importPath = "";
      if (previewFile) {
        // Use the actual file path from the block, relative to src/
        const blockBasePath = block.path.replace(/^\//, ""); // Remove leading slash
        importPath =
          `/src/content/blocks/${blockBasePath}/${previewFile.path}`.replace(
            /\\/g,
            "/",
          );
      } else {
        // Fallback to default path - handle nested category structure
        const blockBasePath = block.path.replace(/^\//, "");
        const componentFile = `${block.preview.component}.tsx`;
        importPath = `/src/content/blocks/${blockBasePath}/components/${componentFile}`;
      }

      return `  {
    ...${JSON.stringify(cleaned, null, 4).replace(/\n/g, "\n    ")},
    component: lazy(() => import("${importPath}"))
  }`;
    })
    .join(",\n");
}
