// Global type declarations for devonly.astro window properties
import type { mediathek } from "../schema"; // Import mediathek for MediathekItem types
import type { InferSelectModel } from "drizzle-orm";

declare global {
	interface Window {
		castArr: Array<{ id: number | string; name: string }>;
		crewArr: Array<{ id: number | string; name: string }>;
		playlist: Array<MediathekEntry>;
	}
}


export interface MediathekEntry {
  id: string;
  slug: string;
  data: {
    id: string;
    title: string | null;
    orgtitle: string | null;
    description: string | null;
    poster: string | null;
    backdrop: string | null;
    backdropup: string | null;
    posterup: string | null;
    type: "movie" | "series" | "other" | "music" | "ymovie" | "yseries" | null;
    created: Date | null;
    lastupdated: Date | null;
    info: {
      metascore: string | null;
      quality: "4k" | "1080p" | "720p" | "SD" | null;
      onlineuntil: number | null;
      channel: {
        name: string;
        country: string;
      };
    };
  };
}

export interface HeroItem {
  backdrop: string;
  backdropup: string | null;
  poster: string;
  posterup: string | null;
  title: string;
  orgtitle: string;
  id: string;
  channel: {
    country: string;
    icon: string;
  };
  quality: string;
  type: string;
  channelicon: string;
  special?: { name: string };
}

export interface CardData {
  id: string;
  title: string;
  orgtitle: string;
  metascore: string;
  type: string;
  poster: string;
  backdropup: string | null;
  posterup: string | null;
  channel: { country: string };
  remainingDays: number;
}
