import type { Plugin } from "vite";

import { scanRegistry } from "./lib/scan";
import { generateVirtualModule } from "./lib/virtual";
import type { PluginOptions, RegistryItem } from "./types";

/**
 * Vite plugin for registry capabilities
 */
export function registry(options: PluginOptions = {}): Plugin {
  const {
    registryDir = "src/registry",
    registryOutput = "public/registry.json",
  } = options;

  let items: RegistryItem[] = [];
  let projectRoot: string;
  const virtualModuleId = "virtual:registry";

  const initialize = async (root: string) => {
    projectRoot = root;
    items = await scanRegistry(registryDir, ["**/meta.json"]);

    const { writeFile, mkdir } = await import("fs/promises");
    const { join, dirname } = await import("path");
    const outputPath = join(projectRoot, registryOutput);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, JSON.stringify(items, null, 2));
  };

  return {
    name: "vite-plugin-registry",

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
      // Local registry items
      if (id === virtualModuleId) {
        return generateVirtualModule(items, registryDir);
      }

      // External registry items from other packages
      if (id.startsWith("virtual:@") && id !== virtualModuleId) {
        const packageName = id.slice("virtual:".length);

        try {
          const registryModule = await import(
            `${packageName}/${registryOutput}`,
            { with: { type: "json" } }
          );
          const externalRegistry = registryModule.default || registryModule;

          return generateVirtualModule(externalRegistry, registryDir, {
            isExternal: true,
            packageName,
          });
        } catch (error) {
          console.warn(
            `Could not load registry items from ${packageName}:`,
            error instanceof Error ? error.message : String(error),
          );
          return generateVirtualModule([], registryDir);
        }
      }
    },

    async handleHotUpdate({ file, server }) {
      // Reload virtual module when registry items change
      if (file.replace(/\\/g, "/").includes(`/${registryDir}/`)) {
        await initialize(projectRoot);
        const module = server.moduleGraph.getModuleById(virtualModuleId);
        return module ? [module] : [];
      }
    },
  };
}

// Export types
export type {
  PluginOptions,
  RegistryFile,
  RegistryItem,
  RegistryMetadata,
  RegistryType,
} from "./types";
