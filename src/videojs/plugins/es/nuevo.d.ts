import { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";

declare global {
	interface Window {
		videojs: any;
	}
	interface Window {
		nuevoskin: string;
	}
}

declare module "video.js" {
	export interface VideoJsPlayer {
		nuevo(options: any): void;
		loadTracks(tracks?: any): void;
		video_id(): string;
		video_title(): string;
		setRate(rate?: any): void;
		resetNuevo(how?: boolean): void;
		setSource(item?: any): void;
		changeSource(item?: any): void;
		changeSrc(item?: any): void;
		textTracksStyle(style?: any): void;
		setQuality(level?: any, toggle?: boolean): void;
		vroll(list?: any): void;
		thumbnails(thumbnails?: any): void;
		playlist: any;
		upnext: any;
		liveclock: any;
		filters: any;
		events: any;
		hotkeys: any;
		visualizer(options?: any): void;
		offline: any;
		hlsjs: any;
		ima: any;
		vastAds: any;
		airplay: any;
		dai: any;
		chromecast: any;
		vast: any;
		ticker: any;
		youtube: any;
		id3: any;
	}
}

export interface nuevoOptions {
	logo?: string;
	logoposition: string;
	logooffsetX: number;
	logooffsetY: number;
	logourl: string;
	target: string;
	zoomMenu: boolean;
	relatedMenu: boolean;
	rateMenu: boolean;
	shareMenu: boolean;
	qualityMenu: boolean;
	filtersMenu: boolean;
	contextMenu: boolean;
	contextLink: boolean;
	pipButton: boolean;
	ccButton: boolean;
	settingsButton: boolean;
	downloadButton: boolean;
	buttonRewind: boolean;
	buttonForward: boolean;
	rewindforward: number;
	video_id: string;
	url: string;
	title: string;
	description: string;
	embed: string;
	endAction: string;
	pubid: string;
	slideWidth: number;
	slideHeight: number;
	slideType: string;
	currentSlide: string;
	chapterMarkers: boolean;
	rate: number;
	resume: boolean;
	infoSize: number;
	infoIcon: string;
	hdicon: boolean;
	zoomInfo: boolean;
	timetooltip: boolean;
	captionsSettings: any;
	mousedisplay: boolean;
	related: any;
	limit: number;
	limitmessage: string;
	playlistID: string;
	playlistMaxH: number;
	playlistUI: boolean;
	playlistShow: boolean;
	playlistAutoHide: boolean;
	playlist: boolean;
	metatitle: string;
	metasubtitle: string;
	tooltips: boolean;
	singlePlay: boolean;
	snapshot: boolean;
	snapshotType: string;
	snapshotWatermark: string;
	ghostThumb: false;
	minhd: number;
	liveReconnect: boolean;
	paused: boolean;
	controlbar: boolean;
	touchRewindForward: boolean;
	touchControls: boolean;
	iosFullscreen: string;
	androidLock: boolean;
	playsinline: boolean;
	keepSource: boolean;
	log: boolean;
}
