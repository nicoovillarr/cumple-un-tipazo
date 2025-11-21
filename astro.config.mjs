// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import vercelAdapter from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercelAdapter(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
