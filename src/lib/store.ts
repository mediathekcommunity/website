import { writable, type Writable } from 'svelte/store';

// Navigation state
export const nav1 = writable<string>('0');

// Filter and visibility states
export const alllang = writable<boolean>(false);
export const visible = writable<boolean>(false);

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
}

interface PlaylistItem extends VideoData {
    id: string | number;
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
