<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/gold1/videojs.min.css'; // Then override with custom skin
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';
	import { modalvideo, playlist, subs, seriestype, playlistindex } from '$lib/store';
	console.log('playlistindex', $playlistindex);
	console.log('playlist', $playlist);
	console.log('seriestype', $seriestype);
	console.log('modalvideo', $modalvideo);

	let player: any = null;
	let videoSource: {
		sources: { src: string; type: string }[];
		poster: string;
		title: string;
	} | null = null;

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

	function initializePlayer(videoElement: HTMLVideoElement) {
		player = videojs(videoElement, videojsOptions);
		player.nuevo(nuevoOptions);
		player.hotkeys({ seekStep: 10 });

		if ($seriestype === 'playlist') {
			updatePlayerSource($seriestype);

			player.playlist.currentItem($playlistindex);
			player.pause();
		} else {
			player.pause();
			updatePlayerSource($seriestype);
		}
	}

	function updatePlayerSource(type: 'playlist' | 'single' | 'default') {
		if (!player) return;
		player.currentTime(0);

		const setCommonSource = (src: string, poster: string, videoType: string) => {
			videoSource = {
				sources: [{ src, type: videoType }],
				poster,
				title: $modalvideo?.title || ''
			};
			player.poster(poster);
			player.src(videoSource.sources);
		};

		switch (type) {
			case 'playlist':
				player.playlist($playlist);
				const playlistItem = $playlist[$playlistindex];
				if (playlistItem) {
					player.poster(playlistItem.thumb);
					player.pause();
				}
				player.playlist.currentItem($playlistindex + 1);
				//console.log('playlist', $playlistindex);
				break;
			case 'single':
			case 'default':
				if ($modalvideo) {
					setCommonSource(
						$modalvideo.src,
						$modalvideo.thumb || $modalvideo.poster,
						$modalvideo.type
					);
				}
				break;
		}

		player.on('loadeddata', handleLoadedData);
	}

	function handleLoadedData() {
		const index = $playlistindex;
		const currentModalVideo = $modalvideo;
		const currentPlaylist = $playlist;
		player.playlist($playlist);
		if (currentModalVideo?.tracks) {
			player?.loadTracks(currentModalVideo.tracks);
		} else if (currentPlaylist && currentPlaylist[index]?.tracks) {
			player?.loadTracks(currentPlaylist[index].tracks);
		}
		player?.pause();
		if ($seriestype === 'playlist') {
			player.playlist.currentItem($playlistindex);
		}
		player?.off('loadeddata', handleLoadedData);
		console.log('loadeddata', $playlistindex, currentModalVideo, currentPlaylist, player);
	}

	$: if (player && ($modalvideo || $seriestype || $playlistindex || $playlist)) {
		updatePlayerSource($seriestype);
		if ($seriestype === 'playlist') {
			player.playlist.currentItem($playlistindex + 1);
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
			player = null;
		}
	});
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video id="my-video" playsinline class="video-js overflow-hidden"></video>

<style>
	.overflow-hidden {
		overflow: hidden !important;
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
