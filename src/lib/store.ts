import { writable, type Writable } from 'svelte/store';

// Modal and video states
interface ModalProps {
    isOpen?: boolean;
    title?: string;
    content?: any;
    [key: string]: any;
}

interface VideoData {
    src?: string;
    thumb?: string;
    poster?: string;
    type?: string;
    title?: string;
    tracks?: Array<{
        kind: string;
        src: string;
        label: string;
        srclang?: string;
    }>;
    // New schema fields
    id?: string;
    quality?: string;
    format?: string;
    audioLanguageFormat?: string;
    subtitlesInfo?: string;
}

interface PlaylistItem {
    // Base video properties
    src?: string;
    thumb?: string;
    poster?: string;
    type?: string;
    title?: string;
    tracks?: Array<{
        kind: string;
        src: string;
        label: string;
        srclang?: string;
    }>;
    // Schema fields
    id: string | number;
    quality?: string;
    format?: string;
    audioLanguageFormat?: string;
    subtitlesInfo?: string;
    // Episode-specific fields for series
    seasonNumber?: number;
    episodeNumber?: number;
    episodeTitle?: string;
    description?: string;
    originalVideoUrl?: string;
    localVideoUrl?: string;
    releaseDate?: string;
}

// Subtitle and track interface
interface SubtitleData {
    language?: string;
    src?: string;
    label?: string;
    default?: boolean;
}

// Type-safe store exports
export const modalProps: Writable<ModalProps> = writable({});
export const modalvideo: Writable<VideoData | null> = writable(null);
export const playlist: Writable<PlaylistItem[]> = writable([]);
export const playlistindex: Writable<number> = writable(0);
export const subtitle: Writable<SubtitleData> = writable({});
export const seriestype: Writable<'playlist' | 'single' | 'default'> = writable('default');
export const subs: Writable<SubtitleData[]> = writable([]);
export const detailsid: Writable<string | null> = writable(null);
export const playlistov: Writable<boolean> = writable(false);

// Navigation state
export const nav1 = writable<string>('0');

// Filter and visibility states  
export const alllang = writable<boolean>(false);
export const visible = writable<boolean>(false);
