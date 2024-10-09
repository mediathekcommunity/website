<script>
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/treso/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';
	import { modalProps, modalvideo, omulist, noomulist, seriestype } from '$lib/store.js';

	let player;
	let videoElement;

	const videojsOptions = {
		controls: true,
		preload: 'auto',
		playsinline: true,
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
		zoomMenu: false
	};

	onMount(() => {
		player = videojs(videoElement, videojsOptions);
		player.nuevo(nuevoOptions);

		return () => {
			if (player) {
				player.dispose();
			}
		};
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
	});
</script>

<video
	id="my-video"
	class="video-js vjs-default-skin vjs-big-play-centered"
	controls
	preload="auto"
	bind:this={videoElement}
></video>
