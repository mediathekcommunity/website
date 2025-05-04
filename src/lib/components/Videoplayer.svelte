<script>
	import { onDestroy, onMount } from 'svelte';
	import '../videojs/skins/gold1/videojs.min.css';
	import videojs from 'video.js';
	import '../videojs/plugins/es/nuevo.js';
	import '../videojs/plugins/es/playlist.js';
	import '../videojs/plugins/es/videojs.hotkeys';
	import { modalvideo, playlist, subs, seriestype, playlistindex } from '$lib/store';

	let player = null;
	let videoSource = null;

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
				maxBufferSize: 30 * 1000 * 1000,
				maxBufferLength: 30
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

	function setSource(type) {
		if (!player) return;
		player.currentTime(0);

		const setCommonSource = (src, poster, videoType) => {
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
				// Defensive: only call currentItem if it is a function and player.changeSource exists
				player.playlist($playlist);
				const playlistItem = $playlist[$playlistindex];
				if (playlistItem) {
					player.poster(playlistItem.thumb);
					if (
						player.playlist &&
						typeof player.playlist.currentItem === 'function' &&
						typeof player.changeSource === 'function'
					) {
						player.playlist.currentItem($playlistindex);
					} else if (player.playlist && typeof player.playlist.currentItem === 'function') {
						// Fallback: just set the src if changeSource is missing
						const item = $playlist[$playlistindex];
						if (item && item.sources) {
							player.src(item.sources);
						}
					}
				}
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
		player.one('loadeddata', handleLoadedData);
	}

	function handleLoadedData() {
		if (!player) return;
		const index = $playlistindex;
		const currentModalVideo = $modalvideo;
		const currentPlaylist = $playlist;
		if (currentModalVideo?.tracks) {
			player.loadTracks?.(currentModalVideo.tracks);
		} else if (currentPlaylist && currentPlaylist[index]?.tracks) {
			player.loadTracks?.(currentPlaylist[index].tracks);
		}
		player.pause();
		if ($seriestype === 'playlist') {
			player.playlist.currentItem($playlistindex);
		}
		/**console.log(
			'loadeddata',
			$seriestype,
			$playlistindex,
			currentModalVideo,
			currentPlaylist,
			player
		);**/
	}

	onMount(() => {
		const videoElement = document.getElementById('my-video');
		if (videoElement) {
			player = videojs(videoElement, videojsOptions);
			player.ready(() => {
				player.nuevo?.(nuevoOptions);
				player.hotkeys?.({ seekStep: 10 });
				if ($seriestype === 'playlist') {
					setSource('playlist');
					player.pause();
				} else {
					player.pause();
					setSource($seriestype);
				}
			});
		}
	});

	$: if (player && ($seriestype === 'single' || $seriestype === 'default') && $modalvideo) {
		setSource($seriestype);
	}

	$: if (
		player &&
		$seriestype === 'playlist' &&
		$playlist &&
		typeof $playlistindex !== 'undefined'
	) {
		setSource('playlist');
		player.playlist?.autoadvance?.(0);
		//console.log('playlist', $playlist, $playlistindex);
	}

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
