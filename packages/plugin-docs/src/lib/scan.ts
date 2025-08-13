import { existsSync } from "node:fs";
import glob from "fast-glob";

import type { ContentFile, SortOptions } from "../types";
import { sortFiles } from "../utils/sort";
import { loadContentFile } from "./parse";

/**
 * Scan the pages directory for MD/MDX/TSX files.
 * - Deduplicates by route (prefers MD/MDX over TSX)
 * - Optionally sorts the result
 */
export async function scanContents(
  dir: string,
  sort?: SortOptions,
): Promise<ContentFile[]> {
  if (!existsSync(dir)) return [];

  const files = await glob(["**/*.md{,x}", "**/page.tsx"], {
    cwd: dir,
    absolute: true,
  });

  const contentFiles = await Promise.all(
    files.map((file) => loadContentFile(file, dir)),
  );

  const validFiles = contentFiles.filter(Boolean) as ContentFile[];
  const uniqueFiles = dedupeByRoute(validFiles);

  return sort ? sortFiles(uniqueFiles, sort) : uniqueFiles;
}

/**
 * Deduplicate files by route path.
 * Prefers MD/MDX over TSX when routes conflict.
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
