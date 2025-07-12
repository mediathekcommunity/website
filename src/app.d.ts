// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Security } from './hooks.server';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DATABASE_URL: string;
				DATABASE_AUTH_TOKEN: string;
				AUTH_SECRET: string;
				// Add other environment variables as needed
			};
		}
	}
}

export {};
