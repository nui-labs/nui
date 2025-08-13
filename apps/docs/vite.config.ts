import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypePrettyCode from "rehype-pretty-code";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";

import { docs } from "../../packages/plugin-docs/src";
import { registry } from "../../packages/plugin-registry/src";
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

      registry(),

      docs({
        contentsDir: "src/pages",
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

    server: {
      port: 5173,
    },
  };
});
