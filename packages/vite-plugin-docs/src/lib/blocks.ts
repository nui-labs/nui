import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import glob from "fast-glob";

import type { Block, BlockFile, ContentFile } from "../types";

/**
 * Scan for blocks in the specified directory
 */
export async function scanBlocks(dir: string): Promise<Block[]> {
  if (!existsSync(dir)) return [];

  // Find all block directories (those containing block.config.ts)
  const configFiles = await glob("**/block.config.ts", {
    cwd: dir,
    absolute: true,
  });

  const blocks: Block[] = [];

  for (const configFile of configFiles) {
    try {
      const block = await parseBlock(configFile, dir);
      if (block) {
        blocks.push(block);
      }
    } catch (err) {
      console.error(
        `[vite-plugin-docs] Failed to parse block "${configFile}":`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  return blocks;
}

/**
 * Parse a single block from its config file and directory
 */
async function parseBlock(
  configPath: string,
  baseDir: string,
): Promise<Block | null> {
  const blockDir = path.dirname(configPath);
  const blockId = path.basename(blockDir);

  // Read and evaluate the config file
  const configContent = readFileSync(configPath, "utf8");
  const config = await evaluateConfig(configContent, configPath);

  if (!config) {
    console.warn(`[vite-plugin-docs] Invalid config in "${configPath}"`);
    return null;
  }

  // Scan all files in the block directory
  const files = await scanBlockFiles(blockDir);

  // Create the block path relative to base directory
  const relativePath = path.relative(baseDir, blockDir);
  const blockPath = `/${relativePath.replace(/\\/g, "/")}`;

  // Use folder structure as category (first folder level)
  const pathParts = relativePath.split(path.sep);
  const folderCategory = pathParts.length > 1 ? pathParts[0] : "general";

  // Auto-detect the main component file
  const mainComponent = files.find(
    (file) =>
      file.type === "component" &&
      file.path.includes("components/") &&
      (file.path.endsWith(".tsx") || file.path.endsWith(".jsx")),
  );

  const componentName = mainComponent
    ? path.basename(mainComponent.name, path.extname(mainComponent.name))
    : "index";

  return {
    id: blockId,
    name: config.name || blockId,
    category: folderCategory, // Always use folder name as category
    tags: [], // No longer from config, could be derived from folder/files if needed
    files,
    preview: { component: componentName }, // Auto-detected component name
    path: blockPath,
    component: () => null, // Will be set by virtual module
    featured: config.featured || false,
    size: config.size || "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Scan all files within a block directory
 */
async function scanBlockFiles(blockDir: string): Promise<BlockFile[]> {
  const patterns = ["**/*.{ts,tsx,js,jsx,css,scss,json}"];

  const filePaths = await glob(patterns, {
    cwd: blockDir,
    absolute: true,
    ignore: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/*.config.*",
    ],
  });

  // Process files in parallel for better performance
  const filePromises = filePaths.map(async (filePath) => {
    try {
      const content = readFileSync(filePath, "utf8");
      const relativePath = path.relative(blockDir, filePath);
      const ext = path.extname(filePath).toLowerCase();

      return {
        name: path.basename(filePath),
        path: relativePath,
        content,
        language: getLanguageFromExtension(ext),
        type: getFileType(relativePath),
      };
    } catch (err) {
      console.warn(
        `[vite-plugin-docs] Failed to read file "${filePath}":`,
        err,
      );
      return null;
    }
  });

  const results = await Promise.all(filePromises);
  return results.filter((file): file is BlockFile => file !== null);
}

/**
 * Evaluate the block config file safely using regex patterns
 */
async function evaluateConfig(content: string, filePath: string): Promise<any> {
  try {
    // Simple regex-based config extraction
    const configPatterns = {
      name: /name:\s*["']([^"']+)["']/,
      featured: /featured:\s*(true|false)/,
      size: /size:\s*["']([^"']+)["']/,
    };

    const config = {
      name: content.match(configPatterns.name)?.[1] || "Untitled Block",
      featured: content.match(configPatterns.featured)?.[1] === "true",
      size: content.match(configPatterns.size)?.[1] || "2",
    };

    return config;
  } catch (err) {
    console.error(
      `[vite-plugin-docs] Error evaluating config "${filePath}":`,
      err,
    );
    return null;
  }
}

/**
 * Get language identifier from file extension
 */
function getLanguageFromExtension(ext: string): string {
  const langMap: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".css": "css",
    ".scss": "scss",
    ".json": "json",
  };

  return langMap[ext] || "text";
}

/**
 * Determine file type based on path
 */
function getFileType(filePath: string): BlockFile["type"] {
  const normalizedPath = filePath.toLowerCase();

  if (
    normalizedPath.includes("/components/") ||
    normalizedPath.endsWith(".tsx") ||
    normalizedPath.endsWith(".jsx")
  ) {
    return "component";
  }

  if (normalizedPath.includes("/lib/") || normalizedPath.includes("/utils/")) {
    return "utility";
  }

  if (normalizedPath.includes("/types/") || normalizedPath.includes(".d.ts")) {
    return "type";
  }

  if (normalizedPath.includes("config") || normalizedPath.endsWith(".json")) {
    return "config";
  }

  if (normalizedPath.endsWith(".css") || normalizedPath.endsWith(".scss")) {
    return "style";
  }

  return "utility";
}

/**
 * Generate ContentFile entries for individual block routes
 */
export function generateBlockRoutes(blocks: Block[]): ContentFile[] {
  return blocks.map((block) => {
    // Extract the block ID part (remove category prefix)
    const blockIdPart = block.id.replace(`${block.category}-`, "");
    const routePath = `/blocks/${block.category}/${blockIdPart}`;

    return {
      name: block.id,
      filePath: `/src/components/blocks/block-page.tsx`, // Use actual file path
      path: routePath,
      meta: {
        title: block.name,
        description: `${block.name} - A reusable ${block.category} component`,
      },
      content: "",
      component: () => null, // Will be handled by the routing system
      toc: [],
      isTsx: true,
    };
  });
}
