import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { blocksPlugin } from "../../packages/vite-plugin-blocks";

export default defineConfig({
  plugins: [
    react(),

    blocksPlugin({
      blocksDir: "src/blocks",
    }),
  ],

  server: {
    port: 5175,
  },
});
