import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";

import { docsPlugin } from "../../packages/vite-plugin-docs";
import { REHYPE_SHIKI_CONFIG } from "./src/lib/shiki-config";

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
        rehypePlugins: [[rehypeShiki, REHYPE_SHIKI_CONFIG]],
      }),

      tailwindcss(),

      docsPlugin({
        contentsDir: "src/content",
        demosDir: "src/demos",
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
