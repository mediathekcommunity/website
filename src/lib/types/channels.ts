export interface Channel {
	id: string;
	name: string;
	title: string;
	poster: string;
	icon: string;
	country: string;
}

export interface PageData {
	channels: Channel[];
	count: number;
	geo: string;
	filter: string | undefined;
}
