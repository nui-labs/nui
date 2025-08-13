import { calculateItemSize, formatSize } from "../utils/files.js";
import { handleError, logger, require } from "../utils/logger.js";
import { findItem, loadRegistry } from "../utils/registry.js";

/**
 * Info command - display detailed information about a specific registry item
 */
export async function infoCommand(id: string, pkg: string): Promise<void> {
  require(pkg, "Package name is required. Use --package <name>");
  require(id, "Item ID is required");

  try {
    logger.info(`Loading registry from ${logger.cyan(pkg)}...`);
    const registry = await loadRegistry(pkg);
    const item = findItem(registry, id);

    require(item, `Item "${id}" not found in ${pkg}`);

    const size = formatSize(calculateItemSize(item));
    const date = new Date(item.updatedAt).toLocaleDateString();

    logger.log("");
    logger.log(logger.bold(logger.cyan(item.name)));
    logger.log(logger.dim(item.description));
    logger.log("");

    logger.log(logger.bold("Details:"));
    logger.log(`  ID:          ${item.id}`);
    logger.log(`  Category:    ${item.category}`);
    logger.log(`  Type:        ${item.type}`);
    logger.log(`  Files:       ${item.files.length}`);
    logger.log(`  Size:        ${size}`);
    logger.log(`  Updated:     ${date}`);
    logger.log("");

    if (item.dependencies.length > 0) {
      logger.log(logger.bold("Dependencies:"));
      item.dependencies.forEach((dep: string) => logger.log(`  • ${dep}`));
      logger.log("");
    }

    logger.log(logger.bold("Files:"));
    item.files.forEach(
      (file: { path: string; content: string; language: string }) => {
        const fileSize = formatSize(Buffer.from(file.content, "utf-8").length);
        const meta = logger.dim(`${file.language.padEnd(12)} ${fileSize}`);
        logger.log(`  ${file.path.padEnd(30)} ${meta}`);
      },
    );
    logger.log("");

    logger.log(logger.dim("To add this item:"));
    logger.log(logger.dim(`  nui-blocks add ${id} --package ${pkg}`));
    logger.log("");
  } catch (error) {
    handleError(error);
  }
}
