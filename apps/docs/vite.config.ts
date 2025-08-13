import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";

import { docsPlugin } from "../../packages/vite-plugin-docs";
import { REHYPE_PRETTY_CONFIG } from "./src/lib/rehype";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: process.env.VITE_BASE_PATH || "/",

    plugins: [
      react(),

      mdx({
        jsxImportSource: "react",
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkFrontmatter],
        rehypePlugins: [[rehypePrettyCode, REHYPE_PRETTY_CONFIG]],
      }),

      tailwindcss(),

      docsPlugin({
        contentsDir: "src/content",
        demosDir: "src/demos",
        blocksDir: "src/content/blocks",
        sort: {
          order: [
            "/docs/introduction",
            "/docs/installation",
            "*",
            "/docs/changelog",
            "/docs/roadmap",
            "/components/button",
            "/components",
            "/blocks",
            "/themes",
          ],
        },
        ssg: {
          enabled: isProduction,
          outDir: "dist",
        },
      }),

      // Bundle analyzer - only in development
      ...(mode === "development"
        ? [
            analyzer({
              analyzerMode: "static",
            }),
          ]
        : []),
    ],
  };
});
