import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import glob from "fast-glob";

import type { Block, BlockFile } from "../types";

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

  return {
    id: blockId,
    name: config.name || blockId,
    description: config.description || "",
    category: folderCategory, // Always use folder name as category
    tags: config.tags || [],
    files,
    preview: config.preview || { component: "index" },
    dependencies: config.dependencies || [],
    meta: {
      title: config.name || blockId,
      description: config.description || "",
      ...config.meta,
    },
    path: blockPath,
    component: () => null, // Will be set by virtual module
    featured: config.featured || false,
    difficulty: config.difficulty || "beginner",
    version: config.version || "1.0.0",
    author: config.author,
    license: config.license,
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
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  });

  const files: BlockFile[] = [];

  for (const filePath of filePaths) {
    try {
      const content = readFileSync(filePath, "utf8");
      const relativePath = path.relative(blockDir, filePath);
      const ext = path.extname(filePath).toLowerCase();

      files.push({
        name: path.basename(filePath),
        path: relativePath,
        content,
        language: getLanguageFromExtension(ext),
        type: getFileType(relativePath),
      });
    } catch (err) {
      console.warn(
        `[vite-plugin-docs] Failed to read file "${filePath}":`,
        err,
      );
    }
  }

  return files;
}

/**
 * Evaluate the block config file safely
 */
async function evaluateConfig(content: string, filePath: string): Promise<any> {
  try {
    // For now, use a simple regex-based approach to extract config values
    // This avoids the complexity of safely evaluating JavaScript code

    const nameMatch = content.match(/name:\s*["']([^"']+)["']/);
    const descMatch = content.match(/description:\s*["']([^"']+)["']/);
    const categoryMatch = content.match(/category:\s*["']([^"']+)["']/);
    const tagsMatch = content.match(/tags:\s*\[([^\]]*)\]/);
    const featuredMatch = content.match(/featured:\s*(true|false)/);
    const difficultyMatch = content.match(/difficulty:\s*["']([^"']+)["']/);
    const versionMatch = content.match(/version:\s*["']([^"']+)["']/);
    const authorMatch = content.match(/author:\s*["']([^"']+)["']/);
    const componentMatch = content.match(/component:\s*["']([^"']+)["']/);
    const dependenciesMatch = content.match(/dependencies:\s*\[([^\]]*)\]/);

    // Parse tags array
    const tags = tagsMatch?.[1]
      ? tagsMatch[1].split(",").map((tag) => tag.trim().replace(/["']/g, ""))
      : [];

    // Parse dependencies array
    const dependencies = dependenciesMatch?.[1]
      ? dependenciesMatch[1]
          .split(",")
          .map((dep) => dep.trim().replace(/["']/g, ""))
      : [];

    return {
      name: nameMatch?.[1] || "Untitled Block",
      description: descMatch?.[1] || "No description",
      category: categoryMatch?.[1] || "general",
      tags,
      preview: {
        component: componentMatch?.[1] || "index",
        background: "default",
        padding: "md",
      },
      dependencies,
      featured: featuredMatch?.[1] === "true",
      difficulty: difficultyMatch?.[1] || "beginner",
      version: versionMatch?.[1] || "1.0.0",
      author: authorMatch?.[1],
    };
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
