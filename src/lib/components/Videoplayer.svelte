<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/treso/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';

	import { modalProps, modalvideo, omulist, noomulist, seriestype } from '$lib/store.js';

	let player: videojs.Player | null = null;

	const videojsOptions = {
		controls: true,
		preload: 'auto',
		playsinline: true,
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

	const nuevoOptions = {
		video_id: $modalvideo.id,
		playlistUI: true,
		playlistShow: true,
		playlistNavigation: true,
		qualityMenu: true,
		shareMenu: false,
		pipButton: false,
		buttonForward: true,
		androidLock: true,
		zoomMenu: false,
		theaterButton: false,
		rateMenu: false,
		settingsButton: true,
		resume: true
	};

	function initializePlayer(videoElement: HTMLVideoElement) {
		player = videojs(videoElement, videojsOptions);
		player.nuevo(nuevoOptions);
		player.hotkeys({ seekStep: 10 });
		updatePlayerSource($seriestype);

		player.on('mode', (event, mode) => {
			const leftColumn = document.querySelector('#left_column');
			if (leftColumn) {
				leftColumn.style.width = mode === 'large' ? '100%' : '70%';
			}
		});
	}

	function updatePlayerSource(type: string) {
		if (!player) return;

		player.pause();
		player.currentTime(0);

		switch (type) {
			case 'noomu':
				player.playlist($noomulist);
				break;
			case 'omu':
				player.playlist($omulist);
				break;
			default:
				const videoSource = {
					sources: [{ src: $modalvideo.src, type: $modalvideo.type }],
					poster: $modalvideo.poster,
					title: $modalvideo.title
				};
				player.poster($modalvideo.poster);
				player.src(videoSource.sources);
				break;
		}
	}

	$: if (player && ($modalvideo || $seriestype)) {
		updatePlayerSource($seriestype);
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
		}
	});
</script>

<div id="left_column" class="left-column">
	<video 
		id="my-video" 
		playsinline 
		webkit-playsinline 
		class="video-js vjs-16-9 overflow-hidden"
	></video>
</div>

<style>
	.overflow-hidden {
		overflow: hidden !important;
	}
	.left-column {
		width: 100%;
		display: flex;
		height: fit-content;
		max-height: fit-content;
		align-items: center;
		overflow: hidden;
	}
</style>