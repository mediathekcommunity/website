<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/gold1/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';
	import '../videojs/plugins/es/videojs.skipintro';
	import { env } from '$env/dynamic/public';
	import { modalvideo, playlist, subs, seriestype, playlistindex } from '$lib/store';

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
				backBufferLength: 90
			}
		}
	};

	const nuevoOptions = {
		pipButton: false,
		shareMenu: false,
		rateMenu: false,
		zoomMenu: false,
		qualityMenu: false,
		settingsButton: false,
		contextMenu: true,
		rewindforward: 30
	};

	function initializePlayer(videoElement: HTMLVideoElement) {
		player = videojs(videoElement, videojsOptions);
		player.nuevo(nuevoOptions);
		player.hotkeys({ seekStep: 10 });
		console.log('initializePlayer');
		console.log(player);
		/*if ($modalvideo.skip) {
			player.skipintro({ skipStart: 1, skipDuration: $modalvideo.skip, skipTarget: 30 });
		}
		*/
		console.log($modalvideo);
		console.log($playlist);
		console.log($seriestype);
		console.log($playlistindex);

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
				console.log('playlist', $playlist);
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
<video id="my-video" playsinline webkit-playsinline class="video-js overflow-hidden"></video>

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
