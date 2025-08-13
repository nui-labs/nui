import { existsSync } from "node:fs";
import { dirname } from "node:path";
import glob from "fast-glob";

import type { RegistryItem } from "../types";
import { loadItem, loadSimpleItem } from "./parse";

/**
 * Scan the registry directory for items.
 * - Blocks: directories with meta.json
 * - Components: standalone .tsx files
 */
export async function scanRegistry(
  registryDir: string,
  patterns: string[] = ["**/meta.json"],
): Promise<RegistryItem[]> {
  if (!existsSync(registryDir)) return [];

  // Scan for blocks (directories with meta.json)
  const metaFiles = await glob(patterns, {
    cwd: registryDir,
    absolute: true,
  });

  const blockItems = await Promise.all(
    metaFiles.map((metaPath) => loadItem(metaPath, registryDir)),
  );

  // Scan for components (standalone .tsx files)
  const allTsxFiles = await glob(["**/*.tsx"], {
    cwd: registryDir,
    absolute: true,
  });

  const blockDirs = new Set(metaFiles.map((metaPath) => dirname(metaPath)));
  const componentFiles = allTsxFiles.filter(
    (filePath) => !blockDirs.has(dirname(filePath)),
  );

  const componentItems = await Promise.all(
    componentFiles.map((filePath) => loadSimpleItem(filePath, registryDir)),
  );

  return [...blockItems, ...componentItems].filter(Boolean) as RegistryItem[];
}
