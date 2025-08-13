#!/usr/bin/env bun
import { addCommand } from "./commands/add.js";
import { infoCommand } from "./commands/info.js";
import { listCommand } from "./commands/list.js";
import { handleError, logger } from "./utils/logger.js";

type Args = {
  command: string;
  positional: string[];
  options: Record<string, string | boolean>;
};

/**
 * Simple argument parser
 */
function parseArgs(args: string[]): Args {
  const [command = "help", ...rest] = args;
  const positional: string[] = [];
  const options: Record<string, string | boolean> = {};

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = rest[i + 1];
      if (next && !next.startsWith("-")) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    } else if (arg.startsWith("-")) {
      options[arg.slice(1)] = true;
    } else {
      positional.push(arg);
    }
  }

  return { command, positional, options };
}

/**
 * Display help message
 */
function showHelp(): void {
  const { log, bold, dim } = logger;
  const pkg = "@nui/blocks-provider";

  log("");
  log(bold("Blocks CLI"));
  log(dim("Copy blocks from external registries to your project"));
  log("");
  log(bold("Usage:"));
  log("  nui-blocks <command> [options]");
  log("");
  log(bold("Commands:"));
  log("  list                List available blocks from a package");
  log("  add <id...>         Add one or more blocks to your project");
  log("  info <id>           Show detailed information about a block");
  log("  help                Show this help message");
  log("");
  log(bold("Options:"));
  log("  --package <name>    Package name (required)");
  log("  --dir <path>        Target directory (default: src/blocks)");
  log("  --category <name>   Filter by category (list only)");
  log("  --type <type>       Filter by type: block, component (list only)");
  log("  --overwrite         Overwrite existing blocks (add only)");
  log("");
  log(bold("Examples:"));
  log(dim("  # List all blocks"));
  log(`  nui-blocks list --package ${pkg}`);
  log("");
  log(dim("  # Add blocks"));
  log(`  nui-blocks add button-01 input-01 --package ${pkg}`);
  log("");
  log(dim("  # Get block info"));
  log(`  nui-blocks info button-01 --package ${pkg}`);
  log("");
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const { command, positional, options } = parseArgs(process.argv.slice(2));

  switch (command) {
    case "list":
      await listCommand({
        package: options.package as string,
        category: options.category as string,
        type: options.type as "block" | "component" | undefined,
      });
      break;

    case "add":
      await addCommand(positional, {
        package: options.package as string,
        dir: options.dir as string,
        overwrite: options.overwrite === true,
      });
      break;

    case "info":
      await infoCommand(positional[0], options.package as string);
      break;

    case "help":
    case "--help":
    case "-h":
      showHelp();
      break;

    default:
      logger.error(`Unknown command: ${command}`);
      logger.log("");
      showHelp();
      process.exit(1);
  }
}

main().catch(handleError);
