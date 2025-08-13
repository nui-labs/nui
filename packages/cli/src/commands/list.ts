import type { ListCommandOptions, RegistryType } from "../types.js";
import { calculateItemSize, formatSize } from "../utils/files.js";
import { handleError, logger, require } from "../utils/logger.js";
import {
  filterByCategory,
  getCategories,
  loadRegistry,
} from "../utils/registry.js";

/**
 * Format registry item type as a colored badge
 */
function formatTypeBadge(type: RegistryType): string {
  const badges = {
    block: logger.yellow("[block]"),
    component: logger.magenta("[component]"),
  };
  return badges[type];
}

/**
 * List command - display available registry items
 */
export async function listCommand(options: ListCommandOptions): Promise<void> {
  const { package: pkg, category, type } = options;

  require(pkg, "Package name is required. Use --package <name>");

  try {
    logger.info(`Loading registry from ${logger.cyan(pkg)}...`);
    const registry = await loadRegistry(pkg);
    let items = category ? filterByCategory(registry, category) : registry;

    // Filter by type if specified
    if (type) {
      items = items.filter((item) => item.type === type);
    }

    if (items.length === 0) {
      const filters = [];
      if (category) filters.push(`category "${category}"`);
      if (type) filters.push(`type "${type}"`);
      const filterText =
        filters.length > 0 ? ` with ${filters.join(" and ")}` : "";
      logger.warn(`No items found${filterText}`);
      return;
    }

    logger.log("");
    logger.log(
      logger.bold(
        `Available items from ${logger.cyan(pkg)} (${items.length} total):`,
      ),
    );
    logger.log("");

    for (const cat of getCategories(items)) {
      logger.log(logger.bold(`  ${cat.toUpperCase()}`));

      for (const item of filterByCategory(items, cat)) {
        const size = formatSize(calculateItemSize(item));
        const typeBadge = formatTypeBadge(item.type);
        const meta = logger.dim(
          `${item.files.length} files, ${item.dependencies.length} deps, ${size}`,
        );

        logger.log(
          `    ${logger.cyan(item.id.padEnd(20))} ${typeBadge.padEnd(20)} ${item.name.padEnd(30)} ${meta}`,
        );
        logger.log(`      ${logger.dim(item.description)}`);
      }

      logger.log("");
    }

    logger.log(logger.dim("Usage:"));
    logger.log(logger.dim(`  nui-blocks add <item-id> --package ${pkg}`));
    logger.log("");
  } catch (error) {
    handleError(error);
  }
}
