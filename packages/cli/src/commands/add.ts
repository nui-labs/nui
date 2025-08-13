import type { AddCommandOptions } from "../types.js";
import { calculateItemSize, formatSize, writeItem } from "../utils/files.js";
import { handleError, logger, require } from "../utils/logger.js";
import { findItem, loadRegistry } from "../utils/registry.js";

type Result = { id: string; success: boolean; error?: string };

/**
 * Add command - copy registry items from external registry to local directory
 */
export async function addCommand(
  itemIds: string[],
  options: AddCommandOptions,
): Promise<void> {
  const { dir = "src/registry", overwrite = false, package: pkg } = options;

  require(pkg, "Package name is required. Use --package <name>");
  require(itemIds.length > 0, "At least one item ID is required");

  try {
    logger.info(`Loading registry from ${logger.cyan(pkg)}...`);
    const registry = await loadRegistry(pkg);
    logger.success(`Found ${registry.length} items in registry`);

    const results: Result[] = [];

    for (const id of itemIds) {
      try {
        const item = findItem(registry, id);
        if (!item) {
          results.push({ id, success: false, error: "Not found in registry" });
          continue;
        }

        logger.info(`Copying ${logger.bold(item.name)} (${id})...`);
        await writeItem(item, dir, overwrite);

        const size = formatSize(calculateItemSize(item));
        const isSingleFile =
          item.files.length === 1 && item.files[0].path === item.files[0].name;

        // Determine path: single file or folder
        const path = isSingleFile
          ? logger.dim(`${dir}/${item.files[0].name}`)
          : logger.dim(`${dir}/${id}`);

        logger.success(`Copied ${logger.bold(item.name)} → ${path} (${size})`);

        results.push({ id, success: true });
      } catch (error) {
        results.push({
          id,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    printSummary(results);
  } catch (error) {
    handleError(error);
  }
}

function printSummary(results: Result[]): void {
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success);

  logger.log("");
  logger.log(logger.bold("Summary:"));
  logger.log(`  ${logger.green(`✓ ${successful} successful`)}`);

  if (failed.length > 0) {
    logger.log(`  ${logger.yellow(`✗ ${failed.length} failed`)}`);
    logger.log("");
    logger.log(logger.bold("Failed items:"));
    failed.forEach((r) =>
      logger.log(`  ${logger.yellow(`• ${r.id}`)}: ${r.error}`),
    );
    process.exit(1);
  }
}
