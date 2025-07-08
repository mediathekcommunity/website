// @ts-check

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import icon from "astro-icon";
import dotenv from "dotenv";
import auth from "auth-astro";
console.log("Loading environment variables...");
// Load environment variables from .env files
// This will load variables from .env and .env.dev if they exist
console.log(JSON.stringify(process.env, null, 2));
dotenv.config();
// Environment-based URL configuration
const isProduction = process.env.NODE_ENV === "production";
const baseUrl = isProduction
  ? "https://mediathek.community"
  : "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
  site: "https://preview.mediathek.community",
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [mdx(), sitemap(), icon(), svelte(), auth()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["node:path"],
    },
  },
  env: {
    schema: {
      PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
        access: "public",
        context: "client",
      }),
      CLERK_SECRET_KEY: envField.string({
        access: "secret",
        context: "server",
      }),
    },
  },
});
