import { existsSync } from "node:fs";
import glob from "fast-glob";

import type { Block } from "../types";
import { loadBlock } from "./parse";

/**
 * Scan the blocks directory for block configurations.
 * - Matches files against DEFAULT_BLOCK_PATTERNS
 * - Loads each block's metadata and files
 * - Returns array of Block objects
 */
export async function scanBlocks(
  blocksDir: string,
  patterns: string[] = ["**/config.{ts,js,tsx,jsx}"],
): Promise<Block[]> {
  if (!existsSync(blocksDir)) return [];

  const configFiles = await glob(patterns, {
    cwd: blocksDir,
    absolute: true,
  });

  const blocks: Block[] = [];

  for (const configPath of configFiles) {
    try {
      const block = await loadBlock(configPath, blocksDir);
      if (block) {
        blocks.push(block);
      }
    } catch (error) {
      console.warn(`Failed to load block from ${configPath}:`, error);
    }
  }

  return blocks;
}
