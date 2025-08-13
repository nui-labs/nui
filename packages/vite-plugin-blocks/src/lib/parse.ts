import { readFile } from "fs/promises";
import { basename, dirname, extname, relative } from "path";
import glob from "fast-glob";

import type { Block, BlockFile } from "../types";

/**
 * Load a block from its config file path
 */
export async function loadBlock(
  configPath: string,
  blocksDir: string,
): Promise<Block | null> {
  const blockDir = dirname(configPath);
  const blockId = basename(blockDir);
  const relativeDir = relative(blocksDir, blockDir);
  const category = relativeDir.split("/")[0] || "general";

  // Load config
  const configContent = await readFile(configPath, "utf8");
  const config = parseConfig(configContent);

  // Load files
  const files = await loadBlockFiles(blockDir);

  // Extract dependencies
  const dependencies = extractDeps(files);

  return {
    id: blockId,
    name: config.name || blockId,
    description: config.description || "",
    category,
    updatedAt: new Date().toISOString(),
    files,
    dependencies,
    ...(config.size && { size: config.size }),
  };
}

/**
 * Parse block config using regex-based extraction (safer than eval)
 */
function parseConfig(content: string): any {
  try {
    const config: any = {};

    // Extract common fields using regex
    const name = /\bname\s*:\s*["'`]([^"'`]+)["'`]/.exec(content)?.[1];
    const description = /\bdescription\s*:\s*["'`]([^"'`]+)["'`]/.exec(
      content,
    )?.[1];

    // Extract optional size field for layout
    const size = /\bsize\s*:\s*["'`]([^"'`]+)["'`]/.exec(content)?.[1];

    if (name) config.name = name;
    if (description) config.description = description;
    if (size) config.size = size;

    return config;
  } catch {
    return {};
  }
}

/**
 * Load all files in a block directory
 */
async function loadBlockFiles(blockDir: string): Promise<BlockFile[]> {
  const filePaths = await glob(["**/*.{ts,tsx,js,jsx,css,json,md}"], {
    cwd: blockDir,
    absolute: true,
  });

  const files: BlockFile[] = [];

  for (const filePath of filePaths) {
    try {
      const content = await readFile(filePath, "utf8");
      const relativePath = relative(blockDir, filePath);
      const ext = extname(filePath);

      files.push({
        name: basename(filePath),
        path: relativePath,
        content,
        language: getLanguage(ext),
      });
    } catch (error) {
      console.warn(`Failed to read file ${filePath}:`, error);
    }
  }

  return files;
}

/**
 * Extract dependencies from block files
 */
function extractDeps(files: BlockFile[]): string[] {
  const deps = new Set<string>();

  files.forEach((file) => {
    if (file.language === "typescript" || file.language === "javascript") {
      const imports = file.content.match(
        /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      );
      if (imports) {
        imports.forEach((imp: string) => {
          const match = imp.match(/from\s+['"]([^'"]+)['"]/);
          if (match && !match[1].startsWith(".")) {
            deps.add(match[1]);
          }
        });
      }
    }
  });

  return Array.from(deps);
}

/**
 * Map file extension to language identifier
 */
function getLanguage(ext: string): string {
  const map: Record<string, string> = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".jsx": "javascript",
    ".css": "css",
    ".json": "json",
    ".md": "markdown",
  };
  return map[ext] || "text";
}
