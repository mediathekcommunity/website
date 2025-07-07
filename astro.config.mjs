// @ts-check

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import kinde from "astro-kinde";




// Environment-based URL configuration
const isProduction = process.env.NODE_ENV === "production";
const baseUrl = isProduction ? "https://mediathek.community" : "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
	site: "https://preview.mediathek.community",
	output: "server",
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
	integrations: [
		kinde({
			clientId: "205eca344cf140c3a043325267a57503",
			clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET,
			domain: process.env.KINDE_DOMAIN,
			callbackUri: `${baseUrl}/api/kinde/callback`,
			signedInUri: baseUrl,
			signedOutUri: baseUrl,
			sessionMaxAge: 3600,
		}),
		mdx(),
		sitemap(),
		icon(),
		svelte(),
	],
	vite: {
		plugins: [tailwindcss()],
		define: {
        "process.env": process.env
		}
	},
});
