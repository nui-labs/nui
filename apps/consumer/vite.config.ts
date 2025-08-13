import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { registry } from "../../packages/plugin-registry/src";

export default defineConfig({
  plugins: [react(), registry()],

  server: {
    port: 5175,
  },
});
