import { readFile } from "fs/promises";
import { dirname, resolve } from "path";

import type { RegistryItem } from "../types.js";

/**
 * Find the workspace root by looking for package.json with workspaces
 */
async function findWorkspaceRoot(startDir: string): Promise<string | null> {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    try {
      const pkgPath = resolve(currentDir, "package.json");
      const content = await readFile(pkgPath, "utf-8");
      const pkg = JSON.parse(content);

      if (pkg.workspaces) {
        return currentDir;
      }
    } catch {
      // Continue searching
    }

    currentDir = dirname(currentDir);
  }

  return null;
}

/**
 * Fetch registry from npm CDN (unpkg)
 */
async function fetchFromCDN(packageName: string): Promise<RegistryItem[]> {
  const cdnUrls = [
    `https://unpkg.com/${packageName}/public/registry.json`,
    `https://cdn.jsdelivr.net/npm/${packageName}/public/registry.json`,
  ];

  for (const url of cdnUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data as RegistryItem[];
      }
    } catch {
      // Try next CDN
    }
  }

  throw new Error(`Could not fetch registry from CDN for ${packageName}`);
}

/**
 * Load registry from a package
 * Tries in order:
 * 1. Workspace packages (monorepo development)
 * 2. node_modules (installed packages)
 * 3. npm CDN (unpkg/jsdelivr - no installation needed)
 */
export async function loadRegistry(
  packageName: string,
): Promise<RegistryItem[]> {
  try {
    // First, try workspace packages (for monorepo development)
    const workspaceRoot = await findWorkspaceRoot(process.cwd());

    if (workspaceRoot) {
      // Extract package name without scope
      const pkgName = packageName.startsWith("@")
        ? packageName.split("/")[1]
        : packageName;

      // Try common workspace locations
      const workspacePaths = [
        resolve(workspaceRoot, "apps", pkgName, "public", "registry.json"),
        resolve(workspaceRoot, "packages", pkgName, "public", "registry.json"),
      ];

      for (const path of workspacePaths) {
        try {
          const content = await readFile(path, "utf-8");
          return JSON.parse(content) as RegistryItem[];
        } catch {
          // Try next path
        }
      }
    }

    // Try node_modules
    try {
      const registryPath = resolve(
        process.cwd(),
        "node_modules",
        packageName,
        "public",
        "registry.json",
      );

      const content = await readFile(registryPath, "utf-8");
      return JSON.parse(content) as RegistryItem[];
    } catch {
      // Fall through to CDN
    }

    // Fallback to npm CDN (no installation needed)
    return await fetchFromCDN(packageName);
  } catch (error) {
    throw new Error(
      `Failed to load registry from ${packageName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Find a registry item by ID
 */
export function findItem(
  registry: RegistryItem[],
  itemId: string,
): RegistryItem | undefined {
  return registry.find((item) => item.id === itemId);
}

/**
 * Filter registry items by category
 */
export function filterByCategory(
  registry: RegistryItem[],
  category: string,
): RegistryItem[] {
  return registry.filter((item) => item.category === category);
}

/**
 * Get all unique categories from registry
 */
export function getCategories(registry: RegistryItem[]): string[] {
  return [...new Set(registry.map((item) => item.category))];
}
