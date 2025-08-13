import type { Plugin } from "vite";

import { scanContents } from "./lib/scan";
import { generateStaticFiles } from "./lib/ssg";
import { generateContentsModule } from "./lib/virtual";
import type { ContentFile, PluginOptions } from "./types";

const VIRTUAL_CONTENTS_ID = "virtual:contents";

/**
 * Vite plugin to index docs pages,
 * expose them as virtual modules, and optionally generate static files.
 */
export function docs(options: PluginOptions = {}): Plugin {
  const { contentsDir = "src/pages", sort, ssg } = options;

  let contents: ContentFile[] = [];
  let basePath = "/";
  let initialized = false;

  async function initialize(config: any) {
    if (initialized) return;

    basePath = config.base || "/";

    const resolveDir = (dir: string) =>
      config.root ? `${config.root}/${dir}` : dir;

    try {
      // Scan pages directory
      contents = await scanContents(resolveDir(contentsDir), sort);

      initialized = true;

      console.log(`[vite-plugin-docs] Indexed ${contents.length} pages`);
    } catch (error) {
      console.error("[vite-plugin-docs] Initialization failed:", error);
      throw error;
    }
  }

  return {
    name: "vite-plugin-docs",

    async configResolved(config) {
      await initialize(config);
    },

    // Resolve virtual module IDs
    resolveId(id) {
      return id === VIRTUAL_CONTENTS_ID ? id : null;
    },

    // Load virtual modules
    async load(id) {
      if (id === VIRTUAL_CONTENTS_ID) {
        return generateContentsModule(contents, true);
      }
      return null;
    },

    // Handle hot updates for content files
    handleHotUpdate({ file, server }) {
      const normalizedPath = file.replace(/\\/g, "/");

      const isContentFile = normalizedPath.includes(`/${contentsDir}/`);

      if (!isContentFile) return;

      // Force re-scan
      initialized = false;

      const mod = server.moduleGraph.getModuleById(VIRTUAL_CONTENTS_ID);
      if (mod) server.reloadModule(mod);

      return []; // No direct HMR payload
    },

    // Generate static files in build mode
    writeBundle: {
      order: "post" as const,
      async handler(outputOptions) {
        if (!ssg?.enabled) return;

        const outDir = outputOptions.dir || ssg.outDir || "dist";
        console.log(
          `📄 Generating ${contents.length} static files to "${outDir}"...`,
        );

        await generateStaticFiles(contents, outDir, basePath);
      },
    },
  };
}

export type { ContentFile, NavItem, TocItem } from "./types";
