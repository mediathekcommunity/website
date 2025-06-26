// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "server",
  adapter: cloudflare(),
  integrations: [mdx(), sitemap(), icon(), svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
