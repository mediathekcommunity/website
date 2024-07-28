<script lang="ts">
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/treso/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo';
	// import '../videojs/plugins/es/hlsjs.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';

	import { modalProps, modalvideo, omulist, noomulist, seriestype } from '$lib/store.js';

	let videoPlayer;
	let player;

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

	function changeVideo(video, type) {
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
				player.changeSource(videoSource);
				break;
		}
	}
	//console.log($modalvideo)
	$: changeVideo($modalvideo, $seriestype);

	onMount(() => {
		let videoElement = document.getElementById('my-video');
		if (videoElement) {
			player = videojs(videoElement, videojsOptions);

			player.nuevo({
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
			});

			player.hotkeys({ seekStep: 10 });

			if ($seriestype === 'noomu') {
				player.playlist($noomulist);
			} else if ($seriestype === 'omu') {
				player.playlist($omulist);
			} else {
				player.src([{ src: $modalvideo.src, type: $modalvideo.type }]);
			}

			player.on('mode', (event, mode) => {
				document.querySelector('#left_column').style.width = mode === 'large' ? '100%' : '70%';
			});

			player.on('fullscreenchange', (evt, mode) => {
				// fullscreen change logic goes here if needed
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
	<video
		id="my-video"
		playsinline
		webkit-playsinline
		bind:this={videoPlayer}
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
