import type { Block } from "../types";

/**
 * Generate virtual module code with blocks and registry
 */
export function generateVirtualModule(
  blocks: Block[],
  blocksDir: string,
  options: { isExternal?: boolean; packageName?: string } = {},
): string {
  const { isExternal = false, packageName = "" } = options;

  // Generate lazy-loaded block entries (only for local blocks)
  const blockEntries = isExternal
    ? ""
    : blocks
        .map((block) => {
          const { category, id, name, size = "full" } = block;

          // Handle blocks without category subdirectory (category === id)
          const importPath =
            category === id
              ? `/${blocksDir}/${id}/index.tsx`
              : `/${blocksDir}/${category}/${id}/index.tsx`;

          return `  {
    id: "${id}",
    name: "${name}",
    category: "${category}",
    path: "/blocks/${category}/${id}",
    component: lazy(() => import("${importPath}")),
    size: "${size}",
    files: ${JSON.stringify(block.files)}
  }`;
        })
        .join(",\n");

  const registryJson = JSON.stringify(blocks, null, 2);
  const importStatement = isExternal ? "" : 'import { lazy } from "react";\n';
  const comment = isExternal
    ? `// External blocks from ${packageName}\n// Components cannot be imported - use CLI to copy blocks locally\n\n`
    : "";

  return `${comment}${importStatement}
export const blocks = [
${blockEntries}
];

export const registry = ${registryJson};

export const getBlock = (id) => registry.find(b => b.id === id);
export const getBlocksByCategory = (category) => registry.filter(b => b.category === category);
export const getCategories = () => [...new Set(registry.map(b => b.category))];
`;
}
