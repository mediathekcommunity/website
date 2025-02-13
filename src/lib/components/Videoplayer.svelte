<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import 'video.js/dist/video-js.css'; // Import default video.js styles first
	import '../videojs/skins/gold1/videojs.min.css'; // Then override with custom skin
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';
	import '../videojs/plugins/es/videojs.skipintro';
	import { modalvideo, playlist, subs, seriestype, playlistindex } from '$lib/store';
	import type { VideoJsPlayer } from 'video.js';
	import type { ModalVideo, PlaylistItem } from '$lib/types'; // Assuming you have types defined

	let player: VideoJsPlayer | null = null;
	let videoSource: {
		sources: { src: string; type: string }[];
		poster: string;
		title: string;
	} | null = null;

	// Video.js options configuration
	const videojsOptions = {
		license: '0902555a051359560f49525c090a445d0d1348',
		controls: true,
		playsinline: false,
		fill: true,
		hotkeys: true,
		resume: true,
		html5: {
			hlsjsConfig: {
				debug: false,
				enableWorker: true,
				lowLatencyMode: false,
				backBufferLength: 90
			}
		}
	};

	// Nuevo plugin options configuration
	const nuevoOptions = {
		pipButton: false,
		shareMenu: false,
		rateMenu: false,
		zoomMenu: false,
		buttonForward: true,
		qualityMenu: false,
		settingsButton: false,
		contextMenu: true,
		rewindforward: 30
	};

	/**
	 * Initializes the video.js player with given options and plugins.
	 * @param {HTMLVideoElement} videoElement - The video element to attach the player to.
	 */
	function initializePlayer(videoElement: HTMLVideoElement) {
		player = videojs(videoElement, videojsOptions);
		player.nuevo(nuevoOptions);
		player.hotkeys({ seekStep: 10 });

		// Apply skip intro if available in modalvideo store (commented out logic)
		/* if ($modalvideo.skip) {
			player.skipintro({ skipStart: 1, skipDuration: $modalvideo.skip, skipTarget: 30 });
		} */

		if ($seriestype === 'playlist') {
			player.playlist.currentItem($playlistindex);
		}
		player.pause();
	}

	/**
	 * Sets the video source and poster for the player based on the video type.
	 * @param {string} type - Type of video source ('playlist', 'single', or default).
	 */
	function updatePlayerSource(type: 'playlist' | 'single' | 'default') {
		if (!player) return;
		player.currentTime(0);

		const setCommonSource = (src: string, poster: string, videoType: string) => {
			videoSource = {
				sources: [{ src, type: videoType }],
				poster,
				title: $modalvideo?.title || '' // Fallback title if modalvideo is not set
			};
			player.poster(poster);
			player.src(videoSource.sources);
		};

		switch (type) {
			case 'playlist':
				player.playlist($playlist);
				const playlistItem: PlaylistItem = $playlist[$playlistindex]; // Type assertion for clarity
				if (playlistItem) {
					player.poster(playlistItem.thumb);
				}
				break;
			case 'single':
			case 'default': // 'default' case seems to be the same as 'single' based on original code
				if ($modalvideo) {
					setCommonSource($modalvideo.src, $modalvideo.thumb || $modalvideo.poster, $modalvideo.type); // Use thumb if available, otherwise poster
				}
				break;
		}

		player.on('loadeddata', handleLoadedData);
	}

	/**
	 * Handles the 'loadeddata' event of the video player. Loads tracks (subtitles) if available.
	 */
	function handleLoadedData() {
		const index = $playlistindex;
		const currentModalVideo: ModalVideo | undefined = $modalvideo; // Type assertion for safety
		const currentPlaylist: PlaylistItem[] | undefined = $playlist;

		if (currentModalVideo?.tracks) {
			player?.loadTracks(currentModalVideo.tracks);
		} else if (currentPlaylist && currentPlaylist[index]?.tracks) {
			player?.loadTracks(currentPlaylist[index].tracks);
		}
		player?.pause();
		player?.off('loadeddata', handleLoadedData); // Remove listener after first 'loadeddata' event to avoid potential issues
	}


	// Reactive statement to update player source when relevant stores change
	$: if (player && ($modalvideo || $seriestype || $playlistindex)) {
		updatePlayerSource($seriestype as 'playlist' | 'single' | 'default'); // Type assertion based on usage
		if ($seriestype === 'playlist') {
			player.playlist.currentItem($playlistindex);
		}
	}

	onMount(() => {
		const videoElement = document.getElementById('my-video') as HTMLVideoElement;
		if (videoElement) {
			initializePlayer(videoElement);
		}
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
			player = null; // Good practice to nullify the player instance
		}
	});
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video id="my-video" playsinline webkit-playsinline class="video-js overflow-hidden"></video>

<style>
	.overflow-hidden {
		overflow: hidden !important;
	}
	/* Video.js Skin Customization - Gold1 Skin overrides */
	:root {
		--controlbar-bg-color: transparent;
		--big-play-bg-color: #708090;
		--big-play-color: #ffffff;
		--button-icon-bg-color: #708090;
		--button-icon-hover-bg-color: #c6c6c6;
		--button-icon-color: #ffffff;
		--button-icon-hover-color: #222222;
		--menu-bg-color: #f0f8ff;
		--menu-hover-bg-color: #d4d9de;
		--menu-color: #222222;
		--menu-active-color: #22222;
		--menu-active-bg-color: #b0c4de;
		--menu-secondary-color: #222222;
		--menu-title-bg-color: #708090;
		--menu-title-color: #fff;
		--menu-zoom-level-color: #708090;
		--menu-zoom-slider-color: #cccccc;
		--menu-zoom-thumb-color: #708090;
		--tooltip-bg-color: #ffffff;
		--tooltip-color: #222222;
		--progress-play-color: #c6c6c6;
		--progress-load-color: #999999;
		--progress-ad-color: #cc0000;
		--chapter-marker-color: #ffffff;
		--volume-bg-color: rgba(0, 0, 0, 0.5);
		--volume-slider-color: #666666;
		--volume-level-color: #ffffff;
		--volume-thumb-color: #708090;
	}
</style>
