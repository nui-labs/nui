import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { registry } from "../../packages/plugin-registry/src";

export default defineConfig({
  plugins: [react(), tailwindcss(), registry()],

  server: {
    port: 5175,
  },
});
