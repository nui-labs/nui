import { readFile } from "fs/promises";
import { basename, dirname, extname, relative } from "path";
import glob from "fast-glob";

import type { RegistryFile, RegistryItem } from "../types";

/**
 * Load a registry item from its meta file path
 */
export async function loadItem(
  metaPath: string,
  _registryDir: string,
): Promise<RegistryItem | null> {
  const itemDir = dirname(metaPath);
  const itemId = basename(itemDir);

  // Load and parse meta.json
  const metaContent = await readFile(metaPath, "utf8");
  const meta = JSON.parse(metaContent);

  // Load all files in the item directory
  const files = await loadItemFiles(itemDir);

  return {
    id: itemId,
    name: meta.name || itemId,
    description: meta.description || "",
    category: meta.category || "block",
    type: files.some((f) => f.name === "meta.json") ? "block" : "component",
    updatedAt: new Date().toISOString(),
    files,
    dependencies: extractDeps(files),
    size: meta.size,
    path: itemId,
  };
}

/**
 * Load all files in a registry item directory
 */
async function loadItemFiles(itemDir: string): Promise<RegistryFile[]> {
  const filePaths = await glob(["**/*.{ts,tsx,css,json,md}"], {
    cwd: itemDir,
    absolute: true,
  });

  const files = await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      const relativePath = relative(itemDir, filePath);

      return {
        name: basename(filePath),
        path: relativePath,
        content,
        language: getLanguage(extname(filePath)),
      };
    }),
  );

  return files;
}

/**
 * Extract dependencies from registry item files
 */
function extractDeps(files: RegistryFile[]): string[] {
  const deps = new Set<string>();

  for (const file of files) {
    if (file.language !== "typescript") continue;

    const imports = file.content.matchAll(
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
    );

    for (const match of imports) {
      const pkg = match[1];
      if (!pkg.startsWith(".") && !pkg.startsWith("/")) {
        deps.add(pkg);
      }
    }
  }

  return Array.from(deps);
}

/**
 * Load a simple registry item from a standalone .tsx file
 */
export async function loadSimpleItem(
  filePath: string,
  _registryDir: string,
): Promise<RegistryItem | null> {
  const fileName = basename(filePath, extname(filePath));
  const content = await readFile(filePath, "utf8");

  const name = fileName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const files: RegistryFile[] = [
    {
      name: basename(filePath),
      path: basename(filePath),
      content,
      language: getLanguage(extname(filePath)),
    },
  ];

  return {
    id: fileName,
    name,
    description: `${name} component demo`,
    category: "component",
    type: "component",
    updatedAt: new Date().toISOString(),
    files,
    dependencies: extractDeps(files),
    path: "",
  };
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
