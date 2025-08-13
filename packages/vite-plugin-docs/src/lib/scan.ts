import { existsSync } from "node:fs";
import glob from "fast-glob";

import type { ContentFile, SortOptions } from "../types";
import { sortFiles } from "../utils/sort";
import { loadComponentDemo, loadContentFile } from "./parse";

/**
 * Parsers turn a file on disk into a typed entity or null if it should be skipped.
 * `rootDir` is used to compute routes and categories relative to a logical base.
 */
type Parser<T> = (filePath: string, rootDir: string) => Promise<T | null>;

const GLOB_PATTERNS = {
  content: ["**/*.md{,x}", "**/index.tsx"],
  samples: ["**/*.mdx", "**/*.tsx"],
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
 * Scan the `samples/` directory for component demos.
 * - Returns sample components for documentation
 */
export async function scanSamples(
  dir: string,
  sort?: SortOptions,
): Promise<{ components: ContentFile[] }> {
  const components = await scanMatchingFiles(
    dir,
    GLOB_PATTERNS.samples,
    (filePath) => loadComponentDemo(filePath, dir, "samples"),
  );

  return {
    components: applySort(components, sort),
  };
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
