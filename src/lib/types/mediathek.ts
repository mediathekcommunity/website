export type MediaType = 'movie' | 'series' | 'music' | 'y-series' | 'y-movie';

export interface CastMember {
    id: number;
    // Add other cast member properties as needed
}

export interface CrewMember {
    id: number;
    // Add other crew member properties as needed
}

export interface Channel {
    country: string;
    // Add other channel properties as needed
}

export interface MediathekItem {
    id: number;
    type: MediaType;
    channel: Channel;
    cast?: CastMember[];
    crew?: CrewMember[];
}

export interface PersonDetails {
    name: string;
    birthday?: string;
    place_of_birth?: string;
    heroImage?: string;
    bio?: string;
}

export interface GroupedByCountry {
    [key: string]: MediathekItem[];
}

export interface PersonData {
    raw: any;
    grouped: GroupedByCountry;
    birthday: string;
    place_of_birth: string;
    name: string;
    bio: string;
    heroImage: string;
}

export interface PageData {
    mediaSorted: MediathekItem[];
    person: PersonData;
    paramid: string;
}

export interface ApiResponse {
    data: PageData;
    error?: string;
}
