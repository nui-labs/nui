import type { Plugin } from "vite";

import { scanContents, scanSamples } from "./lib/scan";
import { generateStaticFiles } from "./lib/ssg";
import { generateContentsModule, generateSamplesModule } from "./lib/virtual";
import type { ContentFile, PluginOptions, Samples } from "./types";

const VIRTUAL_CONTENTS_ID = "virtual:contents";
const VIRTUAL_SAMPLES_ID = "virtual:samples";

/**
 * Vite plugin to index docs content and samples,
 * expose them as virtual modules, and optionally generate static files.
 */
export function docsPlugin(options: PluginOptions = {}): Plugin {
  const {
    contentsDir = "content",
    samplesDir = "samples",
    sort,
    ssg,
  } = options;

  let contents: ContentFile[] = [];
  let samples: Samples = { components: [] };
  let basePath = "/";
  let initialized = false;

  async function initialize(config: any) {
    if (initialized) return;

    basePath = config.base || "/";

    const resolveDir = (dir: string) =>
      config.root ? `${config.root}/${dir}` : dir;

    try {
      // Scan content and samples directories
      [contents, samples] = await Promise.all([
        scanContents(resolveDir(contentsDir), sort),
        scanSamples(resolveDir(samplesDir), sort),
      ]);

      initialized = true;

      console.log(
        `[vite-plugin-docs] Indexed ${contents.length} content files and ${samples.components.length} samples`,
      );
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
      return [VIRTUAL_CONTENTS_ID, VIRTUAL_SAMPLES_ID].includes(id) ? id : null;
    },

    // Load virtual modules
    async load(id) {
      if (id === VIRTUAL_CONTENTS_ID) {
        return generateContentsModule(contents, true);
      }
      if (id === VIRTUAL_SAMPLES_ID) {
        return generateSamplesModule(samples);
      }
      return null;
    },

    // Handle hot updates for content/sample files
    handleHotUpdate({ file, server }) {
      const normalizedPath = file.replace(/\\/g, "/");

      const isContentFile = normalizedPath.includes(`/${contentsDir}/`);
      const isSampleFile = normalizedPath.includes(`/${samplesDir}/`);

      if (!isContentFile && !isSampleFile) return;

      // Force re-scan
      initialized = false;

      if (isContentFile) {
        const mod = server.moduleGraph.getModuleById(VIRTUAL_CONTENTS_ID);
        if (mod) server.reloadModule(mod);
      }

      if (isSampleFile) {
        const mod = server.moduleGraph.getModuleById(VIRTUAL_SAMPLES_ID);
        if (mod) server.reloadModule(mod);
      }

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

export type { Block, BlockFile, ContentFile, NavItem, TocItem } from "./types";
