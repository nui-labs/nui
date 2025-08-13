import type { Plugin } from "vite";

import { scanBlocks } from "./lib/blocks";
import { scanContents, scanDemos } from "./lib/content";
import { createBlocksVirtualModule, createVirtualModule } from "./lib/modules";
import { generateStaticFiles } from "./lib/ssg";
import type { Block, ContentFile, PluginOptions } from "./types";

/** Virtual module ID for documentation content */
const VIRTUAL_DOCS = "virtual:docs";

/** Virtual module ID for demo content */
const VIRTUAL_DEMOS = "virtual:demos";

/** Virtual module ID for blocks content */
const VIRTUAL_BLOCKS = "virtual:blocks";

/**
 * Creates a Vite plugin for processing documentation and demo files.
 *
 * This plugin scans specified directories for markdown, MDX, and TSX files,
 * processes them into a structured format, and exposes them as virtual modules
 * that can be imported in your application.
 */
export function docsPlugin(options: PluginOptions = {}): Plugin {
  const {
    contentsDir = "src/content",
    demosDir = "src/demos",
    blocksDir = "src/blocks",
    sort,
    ssg,
  } = options;

  let contentEntries: ContentFile[] = [];
  let demoEntries: ContentFile[] = [];
  let blockEntries: Block[] = [];
  let basePath: string = "/";

  return {
    name: "vite-plugin-docs",

    async configResolved(config) {
      // Store the base path from Vite config
      basePath = config.base || "/";
      try {
        const resolvedContentsDir = config.root
          ? `${config.root}/${contentsDir}`
          : contentsDir;

        const resolvedDemosDir = config.root
          ? `${config.root}/${demosDir}`
          : demosDir;

        const resolvedBlocksDir = config.root
          ? `${config.root}/${blocksDir}`
          : blocksDir;

        contentEntries = await scanContents(resolvedContentsDir, sort);
        demoEntries = await scanDemos(resolvedDemosDir);
        blockEntries = await scanBlocks(resolvedBlocksDir);
      } catch (err) {
        console.warn("[vite-plugin-docs] Failed to initialize:", err);
      }
    },

    resolveId(id) {
      return id === VIRTUAL_DOCS ||
        id === VIRTUAL_DEMOS ||
        id === VIRTUAL_BLOCKS
        ? id
        : null;
    },

    load(id) {
      if (id === VIRTUAL_DOCS) {
        return createVirtualModule(contentEntries, true);
      }
      if (id === VIRTUAL_DEMOS) {
        return createVirtualModule(demoEntries, false);
      }
      if (id === VIRTUAL_BLOCKS) {
        return createBlocksVirtualModule(blockEntries);
      }
      return null;
    },

    writeBundle: {
      order: "post" as const,
      handler: async (outputOptions: any) => {
        // SSG processing if enabled
        if (ssg?.enabled) {
          const outDir = outputOptions.dir || ssg.outDir || "dist";

          console.log("📄 SSG processing...");
          console.log(`📊 Found ${contentEntries.length} content files`);
          console.log(`📁 Output directory: ${outDir}`);

          // Generate static files
          await generateStaticFiles(contentEntries, outDir, basePath);
        }
      },
    },
  };
}

// Re-export types
export type {
  Block,
  BlockConfig,
  BlockFile,
  BlockPreview,
  ContentFile,
  NavItem,
  TocItem,
} from "./types";
