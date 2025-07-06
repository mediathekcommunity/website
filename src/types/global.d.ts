// Global type declarations for devonly.astro window properties
export {};
declare global {
	interface Window {
		castArr: Array<{ id: number | string; name: string }>;
		crewArr: Array<{ id: number | string; name: string }>;
		playlist: any;
	}
}
