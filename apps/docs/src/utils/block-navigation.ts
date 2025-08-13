import type { RegistryItem } from "@nui/plugin-registry";

/**
 * Get blocks in the same category, sorted by name
 */
export function getBlocksByCategory(
  blocks: RegistryItem[],
  category: string,
): RegistryItem[] {
  return blocks
    .filter((block) => block.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Find previous and next blocks within the same category
 */
export function getPrevNextBlocks(
  blocks: RegistryItem[],
  currentBlockId: string,
  category: string,
): { prevBlock: RegistryItem | null; nextBlock: RegistryItem | null } {
  const categoryBlocks = getBlocksByCategory(blocks, category);
  const currentIndex = categoryBlocks.findIndex(
    (block) => block.id === currentBlockId,
  );

  if (currentIndex === -1) {
    return { prevBlock: null, nextBlock: null };
  }

  return {
    prevBlock: currentIndex > 0 ? categoryBlocks[currentIndex - 1] : null,
    nextBlock:
      currentIndex < categoryBlocks.length - 1
        ? categoryBlocks[currentIndex + 1]
        : null,
  };
}

/**
 * Generate block route path from block data
 */
export function getBlockRoutePath(block: RegistryItem): string {
  const blockIdPart = block.id.replace(`${block.category}-`, "");
  return `/blocks/${block.category}/${blockIdPart}`;
}

/**
 * Parse block route parameters from path
 */
export function parseBlockRoute(path: string): {
  category: string;
  blockId: string;
} | null {
  const match = path.match(/^\/blocks\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  return {
    category: match[1],
    blockId: match[2],
  };
}

/**
 * Get full block ID from category and block ID part
 */
export function getFullBlockId(category: string, blockIdPart: string): string {
  return `${category}-${blockIdPart}`;
}

/**
 * Check if a path is a block route
 */
export function isBlockRoute(path: string): boolean {
  return /^\/blocks\/[^/]+\/[^/]+$/.test(path);
}

/**
 * Get all categories from blocks
 */
export function getBlockCategories(blocks: RegistryItem[]): string[] {
  const categories = new Set(blocks.map((block) => block.category));
  return Array.from(categories).sort();
}

/**
 * Get block count by category
 */
export function getBlockCountByCategory(
  blocks: RegistryItem[],
): Record<string, number> {
  return blocks.reduce(
    (acc, block) => {
      acc[block.category] = (acc[block.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}
