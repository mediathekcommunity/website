<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/treso/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';

	import { modalvideo, playlist, subs, seriestype, playlistindex } from '$lib/store';

	let player: any = null;
	let videoSource: {
		sources: { src: string; type: string }[];
		poster: string;
		title: string;
	} | null = null;
	const videojsOptions = {
		controls: true,
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
		videoInfo: true,
		playlistUI: true,
		ccButton: true,
		playlistShow: true,
		playlistAutoHide: false,
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
		console.log('initializePlayer');
		/*
		console.log($modalvideo);
		console.log($playlist);
		console.log($seriestype);
		console.log($playlistindex);
		*/
		//updatePlayerSource($seriestype);
		if ($seriestype === 'playlist') {
			player.playlist.currentItem($playlistindex);
		}
		player.pause();
	}

	function updatePlayerSource(type: string) {
		if (!player) return;
		player.currentTime(0);
		switch (type) {
			case 'playlist':
				player.playlist($playlist);
				//console.log('playlist', $playlistindex);
				var index = $playlistindex;

				player.poster($playlist[index].thumb);
				break;
			case 'single':
				//console.log($modalvideo);
				videoSource = {
					sources: [{ src: $modalvideo.src, type: $modalvideo.type }],
					poster: $modalvideo.thumb,
					title: $modalvideo.title
				};

				player.poster($modalvideo.thumb);
				player.src(videoSource.sources);
				break;
			default:
				videoSource = {
					sources: [{ src: $modalvideo.src, type: $modalvideo.type }],
					poster: $modalvideo.poster,
					title: $modalvideo.title
				};
				player.poster($modalvideo.poster);
				player.src(videoSource.sources);
				break;
		}
		player.on('loadeddata', function () {
			console.log('loadeddata');
			var index = $playlistindex;

			if ($modalvideo.tracks) {
				//console.log('subssingle', $modalvideo.tracks);
				player.loadTracks($modalvideo.tracks);
			} else if ($playlist && $playlist[index].tracks) {
				//console.log('subsplaylist', $playlist[index].tracks);
				player.loadTracks($playlist[index].tracks);
			}
			player.pause();
		});
	}
	$: if (player && ($modalvideo || $seriestype || $playlistindex)) {
		console.log('updatePlayerSource');
		updatePlayerSource($seriestype);
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
		}
	});
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video id="my-video" playsinline webkit-playsinline class="video-js vjs-16-9 overflow-hidden"
></video>

<style>
	.overflow-hidden {
		overflow: hidden !important;
	}
</style>
