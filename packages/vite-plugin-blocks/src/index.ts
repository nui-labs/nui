import type { Plugin } from "vite";

import { scanBlocks } from "./lib/scan";
import { generateVirtualModule } from "./lib/virtual";
import type { Block, PluginOptions } from "./types";

/**
 * Vite plugin for block registry capabilities
 */
export function blocksPlugin(options: PluginOptions = {}): Plugin {
  const {
    blocksDir = "src/blocks",
    patterns = ["**/config.{ts,js,tsx,jsx}"],
    registryOutput,
  } = options;

  let blocks: Block[] = [];
  let projectRoot: string;
  const virtualModuleId = "virtual:blocks";

  const initialize = async (root: string) => {
    projectRoot = root;
    blocks = await scanBlocks(blocksDir, patterns);

    // Write registry JSON if configured
    if (registryOutput) {
      const { writeFile, mkdir } = await import("fs/promises");
      const { join, dirname } = await import("path");
      const outputPath = join(projectRoot, registryOutput);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, JSON.stringify(blocks, null, 2));
    }
  };

  return {
    name: "vite-plugin-blocks",

    async configResolved(config) {
      await initialize(config.root);
    },

    resolveId(id) {
      // Resolve local virtual module
      if (id === virtualModuleId) {
        return id;
      }
      // Resolve external virtual modules (but not our own)
      if (id.startsWith("virtual:@") && id !== virtualModuleId) {
        return id;
      }
    },

    async load(id) {
      // Local blocks
      if (id === virtualModuleId) {
        return generateVirtualModule(blocks, blocksDir);
      }

      // External blocks from other packages
      if (id.startsWith("virtual:@") && id !== virtualModuleId) {
        const packageName = id.slice("virtual:".length);

        try {
          const registryModule = await import(
            `${packageName}/public/registry.json`,
            { with: { type: "json" } }
          );
          const externalRegistry = registryModule.default || registryModule;

          return generateVirtualModule(externalRegistry, blocksDir, {
            isExternal: true,
            packageName,
          });
        } catch (error) {
          console.warn(
            `Could not load blocks from ${packageName}:`,
            error instanceof Error ? error.message : String(error),
          );
          return generateVirtualModule([], blocksDir);
        }
      }
    },

    async handleHotUpdate({ file, server }) {
      // Reload virtual module when blocks change
      if (file.replace(/\\/g, "/").includes(`/${blocksDir}/`)) {
        await initialize(projectRoot);
        const module = server.moduleGraph.getModuleById(virtualModuleId);
        return module ? [module] : [];
      }
    },
  };
}

// Export types
export type { Block, BlockFile, BlockMetadata } from "./types";
