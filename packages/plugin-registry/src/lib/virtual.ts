import type { RegistryItem } from "../types";

interface VirtualModuleOptions {
  isExternal?: boolean;
  packageName?: string;
}

/**
 * Determine the import path for a registry item.
 */
function getImportPath(item: RegistryItem, registryDir: string): string {
  const { files, path: itemPath } = item;

  // Single file component
  if (files.length === 1 && files[0].path === files[0].name) {
    return `/${registryDir}/${files[0].name}`;
  }

  // Multi-file block
  return `/${registryDir}/${itemPath}/page.tsx`;
}

/**
 * Generate a registry item entry (without component).
 */
function generateItemEntry(item: RegistryItem): string {
  return `  {
    id: "${item.id}",
    name: "${item.name}",
    category: "${item.category}",
    type: "${item.type}",
    size: "${item.size || "full"}",
    description: "${item.description}",
    files: ${JSON.stringify(item.files)},
    dependencies: ${JSON.stringify(item.dependencies)},
    updatedAt: "${item.updatedAt}"
  }`;
}

/**
 * Generate a lazy-loaded registry item entry.
 */
function generateLazyItemEntry(
  item: RegistryItem,
  registryDir: string,
): string {
  const importPath = getImportPath(item, registryDir);

  return `  {
    id: "${item.id}",
    name: "${item.name}",
    category: "${item.category}",
    type: "${item.type}",
    size: "${item.size || "full"}",
    description: "${item.description}",
    files: ${JSON.stringify(item.files)},
    dependencies: ${JSON.stringify(item.dependencies)},
    updatedAt: "${item.updatedAt}",
    component: lazy(() => import("${importPath}"))
  }`;
}

/**
 * Generate virtual module code with registry items
 */
export function generateVirtualModule(
  items: RegistryItem[],
  registryDir: string,
  options: VirtualModuleOptions = {},
): string {
  const { isExternal = false, packageName = "" } = options;

  // Generate item entries
  const itemEntries = isExternal
    ? items.map(generateItemEntry).join(",\n")
    : items.map((item) => generateLazyItemEntry(item, registryDir)).join(",\n");

  // Generate module header
  const importStatement = isExternal ? "" : 'import { lazy } from "react";\n';
  const comment = isExternal
    ? `// External registry items from ${packageName}\n// Components cannot be imported - use CLI to copy items locally\n\n`
    : "";

  // Generate module code
  return `${comment}${importStatement}
export const blocks = [
${itemEntries}
];

export const registry = ${JSON.stringify(items, null, 2)};
`;
}
