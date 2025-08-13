import { access, mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

import type { RegistryItem } from "../types.js";

/**
 * Check if a file or directory exists
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Write a registry item to the filesystem
 * - Single file: write directly to registry folder
 * - Folder: create subfolder with item id in registry folder
 */
export async function writeItem(
  item: RegistryItem,
  targetDir: string,
  overwrite: boolean = false,
): Promise<void> {
  const isSingleFile =
    item.files.length === 1 && item.files[0].path === item.files[0].name;

  if (isSingleFile) {
    // Single file: write directly to registry folder
    await mkdir(targetDir, { recursive: true });

    const file = item.files[0];
    const filePath = join(targetDir, file.path);

    if (!overwrite && (await exists(filePath))) {
      throw new Error(
        `File ${file.path} already exists at ${filePath}. Use --overwrite to replace it.`,
      );
    }

    await writeFile(filePath, file.content, "utf-8");
    return;
  }

  // Folder: create subfolder with item id
  const itemDir = join(targetDir, item.id);

  // Check if item already exists
  if (!overwrite && (await exists(itemDir))) {
    throw new Error(
      `Item ${item.id} already exists at ${itemDir}. Use --overwrite to replace it.`,
    );
  }

  // Create item directory
  await mkdir(itemDir, { recursive: true });

  // Write all files
  for (const file of item.files) {
    const filePath = join(itemDir, file.path);
    const fileDir = dirname(filePath);

    // Ensure directory exists
    await mkdir(fileDir, { recursive: true });

    // Write file
    await writeFile(filePath, file.content, "utf-8");
  }
}

/**
 * Format file size
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Calculate total size of registry item files
 */
export function calculateItemSize(item: RegistryItem): number {
  return item.files.reduce((total, file) => {
    return total + Buffer.from(file.content, "utf-8").length;
  }, 0);
}
