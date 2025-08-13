import type { Plugin } from "vite";

import { scanContents, scanDemos } from "./lib/content";
import { createVirtualModule } from "./lib/modules";
import { generateStaticFiles } from "./lib/ssg";
import type { ContentFile, PluginOptions } from "./types";

/** Virtual module ID for documentation content */
const VIRTUAL_DOCS = "virtual:docs";

/** Virtual module ID for demo content */
const VIRTUAL_DEMOS = "virtual:demos";

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
    sort,
    ssg,
  } = options;

  let contentEntries: ContentFile[] = [];
  let demoEntries: ContentFile[] = [];
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

        contentEntries = await scanContents(resolvedContentsDir, sort);
        demoEntries = await scanDemos(resolvedDemosDir);
      } catch (err) {
        console.warn("[vite-plugin-docs] Failed to initialize:", err);
      }
    },

    resolveId(id) {
      return id === VIRTUAL_DOCS || id === VIRTUAL_DEMOS ? id : null;
    },

    load(id) {
      if (id === VIRTUAL_DOCS) {
        return createVirtualModule(contentEntries, true);
      }
      if (id === VIRTUAL_DEMOS) {
        return createVirtualModule(demoEntries, false);
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
export type { ContentFile, NavItem, TocItem } from "./types";
