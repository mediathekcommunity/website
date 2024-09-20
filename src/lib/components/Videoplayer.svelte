<script lang="ts">
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/treso/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';

	import { modalProps, modalvideo, omulist, noomulist, seriestype } from '$lib/store.js';
	//console.log($modalProps, $modalvideo, $omulist, $noomulist, $seriestype);
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

	function changeVideo(video: any, type: string) {
		if (!player) return;

		player.pause();
		player.currentTime(0);

		switch (type) {
			case 'noomu':
				player.playlist.update($noomulist);
				break;
			case 'omu':
				player.playlist.update($omulist);
				break;
			default:
				const videoSource = {
					sources: [{ src: $modalvideo.src, type: $modalvideo.type }],
					poster: $modalvideo.poster,
					title: $modalvideo.title
				};
				player.poster(video.poster);
				//console.log('changeVideo', videoSource);
				player.changeSource(videoSource);
				break;
		}
	}

	$: changeVideo($modalvideo, $seriestype);

	onMount(() => {
		const videoElement = document.getElementById('my-video');
		if (videoElement) {
			player = videojs(videoElement, videojsOptions);
			player.nuevo(nuevoOptions);
			player.hotkeys({ seekStep: 10 });
			switch ($seriestype) {
				case 'noomu':
					player.playlist($noomulist);
				case 'omu':
					player.playlist($omulist);
				default:
					player.src([{ src: $modalvideo.src, type: $modalvideo.type }]);
			}
			//console.log(player.src);

			player.on('mode', (event, mode) => {
				document.querySelector('#left_column')!.style.width = mode === 'large' ? '100%' : '70%';
			});
		}
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
	});
</script>

<div id="left_column" class="left-column">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video id="my-video" playsinline webkit-playsinline class="video-js vjs-16-9 overflow-hidden"
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
