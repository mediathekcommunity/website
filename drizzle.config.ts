// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/schema.ts",
	out: "./migrations",
	dialect: "turso",
	dbCredentials: {
		// Support local file for development
		url: process.env.TURSO_LOCAL_FILE
			? `file:${process.env.TURSO_LOCAL_FILE}`
			: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_LOCAL_FILE
			? undefined // No auth token needed for local files
			: process.env.TURSO_AUTH_TOKEN!,
	},
} satisfies Config;
