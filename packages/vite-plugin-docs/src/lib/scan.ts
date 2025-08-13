import { existsSync } from "node:fs";
import path from "node:path";
import glob from "fast-glob";

import type { Block, ContentFile, Parser, SortOptions } from "../types";
import { loadBlockFromConfig } from "../utils/block";
import { sortFiles } from "../utils/sort";
import { loadComponentDemo, loadContentFile } from "./parse";

const GLOB_PATTERNS = {
  content: ["**/*.md{,x}", "**/index.tsx"],
  samples: ["**/*.mdx", "**/*.tsx"],
  blocks: "**/config.{ts,js,tsx,jsx}",
} as const;

/**
 * Scan the `docs/content` directory.
 * - Matches files against `GLOB_PATTERNS.content`
 * - Removes duplicates by comparing their resolved route
 * - Optionally sorts the final result using the given options
 */
export async function scanContents(
  dir: string,
  sort?: SortOptions,
): Promise<ContentFile[]> {
  const files = await scanMatchingFiles(
    dir,
    GLOB_PATTERNS.content,
    loadContentFile,
  );
  const unique = dedupeByRoute(files);
  return applySort(unique, sort);
}

/**
 * Scan the `samples/` directory for both components and blocks.
 * - Uses two separate scanners: one for components and one for blocks
 * - Returns results grouped by type
 * - Block paths are prefixed with `/samples` to keep them consistent
 */
export async function scanSamples(
  dir: string,
  sort?: SortOptions,
): Promise<{ components: ContentFile[]; blocks: Block[] }> {
  const [components, blocks] = await Promise.all([
    scanSampleComponents(dir),
    scanSampleBlocks(dir),
  ]);

  return {
    components: applySort(components, sort),
    blocks: blocks.map((block) => ({
      ...block,
      path: `/samples${block.path}`,
    })),
  };
}

/**
 * Scan component samples from the `components/` subdirectory.
 * - Defaults to `<dir>/components/`
 * - Uses the component parser to handle `.mdx` and `.tsx` files
 */
async function scanSampleComponents(
  dir: string,
  subDir = "components",
): Promise<ContentFile[]> {
  const targetDir = path.join(dir, subDir);
  return scanMatchingFiles(targetDir, GLOB_PATTERNS.samples, (filePath) =>
    loadComponentDemo(filePath, targetDir, subDir),
  );
}

/**
 * Scan block samples from the `blocks/` subdirectory.
 * - Defaults to `<dir>/blocks/`
 * - Looks for `config.{ts,tsx}` files only
 * - Parses each config file into a `Block` definition
 * - Safely ignores files that fail to parse (logs warning instead of throwing)
 */
async function scanSampleBlocks(
  dir: string,
  subDir = "blocks",
): Promise<Block[]> {
  const targetDir = path.join(dir, subDir);
  if (!existsSync(targetDir)) return [];

  const configFiles = await glob(GLOB_PATTERNS.blocks, {
    cwd: targetDir,
    absolute: true,
  });

  const blocks = await Promise.all(
    configFiles.map((configPath) =>
      loadBlockFromConfig(configPath, targetDir, subDir).catch((err) => {
        console.warn(`[scanner] Failed to parse block "${configPath}":`, err);
        return null;
      }),
    ),
  );

  return blocks.filter(Boolean) as Block[];
}

/**
 * Expand glob patterns under a given root directory and parse each file.
 * - Uses the provided parser for each match
 * - Filters out invalid or failed parser results (falsy values)
 */
async function scanMatchingFiles<T>(
  rootDir: string,
  patterns: readonly string[],
  parser: Parser<T>,
): Promise<T[]> {
  if (!existsSync(rootDir)) return [];

  const files = await glob(patterns as string[], {
    cwd: rootDir,
    absolute: true,
  });

  const results = await Promise.all(files.map((file) => parser(file, rootDir)));
  return results.filter(Boolean) as T[];
}

/**
 * Deduplicate files based on their resolved route path.
 * - If two files map to the same route, prefers Markdown/MDX files
 *   over `.tsx` files, since those are usually canonical docs
 */
function dedupeByRoute(files: ContentFile[]): ContentFile[] {
  const byRoute = new Map<string, ContentFile>();

  for (const file of files) {
    const existing = byRoute.get(file.path);
    if (!existing || (!file.isTsx && existing.isTsx)) {
      byRoute.set(file.path, file);
    }
  }

  return [...byRoute.values()];
}

/**
 * Apply sorting to content files if sort options are provided.
 * - Otherwise, returns the files in their scanned order
 */
function applySort<T extends ContentFile>(files: T[], sort?: SortOptions): T[] {
  return sort ? sortFiles(files, sort) : files;
}
