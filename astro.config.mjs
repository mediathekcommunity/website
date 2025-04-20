// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import node from "@astrojs/node";

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), icon()],
  },

  integrations: [icon()],

  adapter: node({
    mode: "standalone",
  }),
});