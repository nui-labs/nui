import { readFile } from "node:fs/promises";
import path from "node:path";
import glob from "fast-glob";

import type { Block, BlockFile, BlockSize } from "../types";

/**
 * Load a Block from its `config.*` file and sibling files.
 */
export async function loadBlockFromConfig(
  configPath: string,
  baseDir: string,
  categoryRoot: string,
): Promise<Block | null> {
  try {
    const blockDir = path.dirname(configPath);
    const blockId = path.basename(blockDir);
    const relativeDir = path.relative(baseDir, blockDir);
    const blockCategory = relativeDir.split(path.sep)[0] || "general";

    const [configSource, files] = await Promise.all([
      readFile(configPath, "utf8"),
      collectBlockFiles(blockDir),
    ]);

    const meta = parseBlockConfig(configSource);

    return {
      id: blockId,
      name: meta.name ?? blockId,
      category: blockCategory,
      files,
      path: `/${categoryRoot}/${relativeDir.replace(/\\/g, "/")}`,
      component: () => null,
      featured: meta.featured || false,
      size: (meta.size || "2") as BlockSize,
    };
  } catch (err) {
    console.warn(`[block] Failed to parse block from "${configPath}":`, err);
    return null;
  }
}

/**
 * Collect all non-config files that belong to a block.
 */
async function collectBlockFiles(blockDir: string): Promise<BlockFile[]> {
  const filePaths = await glob(["**/*.{ts,tsx,json}"], {
    cwd: blockDir,
    absolute: true,
    ignore: ["**/*.config.*"],
  });

  const files = await Promise.all(
    filePaths.map((fp) => createBlockFile(fp, blockDir)),
  );
  return files.filter(Boolean) as BlockFile[];
}

/**
 * Parse block metadata from a config source file using lightweight regex.
 */
function parseBlockConfig(source: string) {
  const name = /\bname\s*:\s*["'`]([^"'`]+)["'`]/.exec(source)?.[1];
  const featured = /\bfeatured\s*:\s*(true|false)/.exec(source)?.[1] === "true";
  const size = /\bsize\s*:\s*["'`]([^"'`]+)["'`]/.exec(source)?.[1];
  return { name, featured, size };
}

/**
 * Convert a file to a BlockFile entry.
 * - Normalizes paths to POSIX
 * - Infers language from extension
 * - Infers file role from relative path
 */
export async function createBlockFile(
  filePath: string,
  blockDir: string,
): Promise<BlockFile | null> {
  try {
    const content = await readFile(filePath, "utf8");
    const relPath = path.relative(blockDir, filePath).replace(/\\/g, "/");

    return {
      name: path.basename(filePath),
      path: relPath,
      content,
    };
  } catch (err) {
    console.warn(`[block] Failed to read "${filePath}":`, err);
    return null;
  }
}
