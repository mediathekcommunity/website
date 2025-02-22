<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/gold1/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';
	import '../videojs/plugins/es/videojs.skipintro';
	import { modalvideo, playlist, subs, seriestype, playlistindex } from '$lib/store';
 
	let player: any = null;
	let videoElement: HTMLVideoElement;
	let isInitialized = $state(false);
	let updateTimeout: ReturnType<typeof setTimeout>;

	interface PlaylistItem {
		thumb?: string;
		tracks?: any[];
	}

	// Memoized video options
	const videojsOptions = {
		license: '0902555a051359560f49525c090a445d0d1348',
		controls: true,
		playsinline: false,
		fill: true,
		hotkeys: true,
		resume: true,
		preload: 'metadata', // Optimize initial loading
		html5: {
			hlsjsConfig: {
				debug: false,
				enableWorker: true,
				lowLatencyMode: false,
				backBufferLength: 90,
				maxBufferSize: 30 * 1000 * 1000, // 30MB max buffer size
				maxBufferLength: 30 // 30 seconds max buffer length
			}
		}
	};

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

	// Optimized player initialization with lazy loading
	async function initializePlayer() {
		if (!videoElement || isInitialized) return;
		
		player = videojs(videoElement, videojsOptions);
		player.nuevo(nuevoOptions);
		player.hotkeys({ seekStep: 10 });

		if ($seriestype === 'playlist' && $playlist?.length > 0) {
			player.playlist($playlist);
			player.playlist.currentItem(Number($playlistindex) || 0);
		}
		
		isInitialized = true;
		player.pause();
	}

	// Optimized source update with type checking
	function updatePlayerSource(type: 'playlist' | 'single' | 'default') {
		if (!player || !isInitialized) return;

		try {
			player.currentTime(0);

			if (type === 'playlist' && Array.isArray($playlist) && $playlist.length > 0) {
				player.playlist($playlist);
				const index = Number($playlistindex) || 0;
				const playlistItem = $playlist[index] as PlaylistItem;
				if (playlistItem?.thumb) {
					player.poster(playlistItem.thumb);
				}
			} else if ($modalvideo) {
				const { src, thumb, poster, type: videoType, title } = $modalvideo;
				player.poster(thumb || poster);
				player.src([{ src, type: videoType }]);
			}

			player.one('loadeddata', handleLoadedData);
		} catch (error) {
			console.error('Error updating video source:', error);
		}
	}

	// Optimized track loading
	function handleLoadedData() {
		try {
			let tracks;
			if ($seriestype === 'playlist' && Array.isArray($playlist) && $playlist.length > 0) {
				const index = Number($playlistindex) || 0;
				const playlistItem = $playlist[index] as PlaylistItem;
				tracks = playlistItem?.tracks;
			} else {
				tracks = $modalvideo?.tracks;
			}

			if (tracks && player?.loadTracks) {
				player.loadTracks(tracks);
			}
			
			player?.pause();
		} catch (error) {
			console.error('Error handling loaded data:', error);
		}
	}

	// Reactive update with debouncing
	$effect(() => {
		if (!player || !isInitialized) return;

		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}

		updateTimeout = setTimeout(() => {
			if ($modalvideo || $seriestype || (Array.isArray($playlist) && $playlist.length > 0)) {
				updatePlayerSource($seriestype as 'playlist' | 'single' | 'default');
			}
		}, 100);
	});

	onMount(() => {
		if (videoElement) {
			initializePlayer();
		}
	});

	onDestroy(() => {
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}
		if (player) {
			player.dispose();
			player = null;
		}
		isInitialized = false;
	});
</script>

<!-- We disable the a11y warning since captions are handled by video.js -->
<!-- svelte-ignore a11y_media_has_caption -->
<video 
	bind:this={videoElement}
	id="my-video" 
	playsinline 
	class="video-js overflow-hidden"
	preload="metadata"
>
	<!-- Placeholder track to satisfy accessibility requirements -->
	<track kind="captions" src="" label="Captions" />
</video>

<style>
	.overflow-hidden {
		overflow: hidden !important;
		contain: content;
		will-change: transform;
	}
	
	:global(.video-js) {
		transform: translateZ(0);
	}

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
