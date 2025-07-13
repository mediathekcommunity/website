<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { modalvideo, playlist, seriestype, playlistindex } from '$lib/store';
	import videojs from 'video.js';
	import type { Player } from 'video.js';
	// Import nuevo plugins
	import '$lib/videojs/skins/gold1/videojs.min.css';
	import '$lib/videojs/plugins/es/nuevo.js';
	import '$lib/videojs/plugins/es/playlist.js';
	import '$lib/videojs/plugins/es/videojs.hotkeys.js';

	export let mediaData: MediaItem | null = null; // Explicitly define type
	export let currentFile: MovieFile | null = null; // Explicitly define type
	export let episodes: Episode[] = []; // Explicitly define type
	export let movieFiles: MovieFile[] = []; // Explicitly define type

	let player: Player | null = null; // Explicitly define type
	let videoElement: HTMLVideoElement | null = null; // Explicitly define type
	let videoSource: { sources: { src: string; type: string }[]; poster: string; title: string } | null = null;

	interface MovieFile {
		id: string; // Added 'id' property
		videoUrl: string;
		localVideoUrl?: string;
		quality?: string;
		format?: string;
		audioLanguageFormat?: string;
		subtitlesInfo?: string;
	}

	interface Episode {
		id: string;
		seasonNumber: number;
		episodeNumber: number;
		title: string;
		description?: string;
		originalVideoUrl?: string;
		localVideoUrl?: string;
		subtitlesInfo?: string;
	}

	interface MediaItem {
		id: string;
		title: string;
		type: 'movie' | 'series';
		poster_url?: string;
	}

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

	function setCommonSource(src: string, poster: string, videoType: string, title: string): void {
		videoSource = {
			sources: [{ src, type: videoType }],
			poster,
			title: title || ''
		};
		player?.poster(poster);
		player?.src(videoSource.sources);
	}

	// Convert our new schema data to video player format
	function convertMovieFileToVideoData(file: MovieFile, media: MediaItem | null): any {
		return {
			src: file.videoUrl,
			type: getVideoType(file.format || 'mp4'),
			title: media?.title || 'Untitled',
			poster: media?.poster_url || '',
			quality: file.quality,
			tracks: parseSubtitles(file.subtitlesInfo)
		};
	}

	function convertEpisodeToVideoData(episode: Episode, media: MediaItem | null): any {
		return {
			src: episode.originalVideoUrl || episode.localVideoUrl,
			type: getVideoType('mp4'), // Default to mp4
			title: `${media?.title || 'Series'} - S${episode.seasonNumber}E${episode.episodeNumber}: ${episode.title}`,
			poster: media?.poster_url || '',
			tracks: parseSubtitles(episode.subtitlesInfo),
			// Episode metadata
			seasonNumber: episode.seasonNumber,
			episodeNumber: episode.episodeNumber,
			description: episode.description
		};
	}

	function getVideoType(format: string): string {
		const formatMap: { [key: string]: string } = {
			mp4: 'video/mp4',
			webm: 'video/webm',
			ogg: 'video/ogg',
			m3u8: 'application/x-mpegURL',
			hls: 'application/x-mpegURL',
			dash: 'application/dash+xml'
		};
		return formatMap[format?.toLowerCase()] || 'video/mp4';
	}

	function parseSubtitles(subtitlesInfo: string | undefined): any[] {
		if (!subtitlesInfo) return [];

		try {
			// Try to parse as JSON first
			if (subtitlesInfo.startsWith('[') || subtitlesInfo.startsWith('{')) {
				const parsed = JSON.parse(subtitlesInfo);
				return Array.isArray(parsed) ? parsed : [parsed];
			}

			// Simple format: "English:en.vtt,German:de.vtt"
			return subtitlesInfo
				.split(',')
				.map((sub) => {
					const [label, src] = sub.split(':');
					const lang = src ? src.split('.')[0] : 'en';
					return {
						kind: 'subtitles',
						src: src?.trim(),
						label: label?.trim(),
						srclang: lang
					};
				})
				.filter((track) => track.src);
		} catch (e) {
			console.warn('Could not parse subtitles info:', subtitlesInfo);
			return [];
		}
	}

	function setSource(): void {
		if (!player || !mediaData) return;

		player.currentTime(0);

		let videoData;

		if (mediaData.type === 'movie' && currentFile) {
			// Single movie file
			videoData = convertMovieFileToVideoData(currentFile, mediaData);
			seriestype.set('single');
			modalvideo.set(videoData);
			setCommonSource(videoData.src, videoData.poster, videoData.type, videoData.title);
		} else if (mediaData.type === 'movie' && movieFiles.length > 0) {
			// Multiple movie files - use first one or create playlist
			if (movieFiles.length === 1) {
				videoData = convertMovieFileToVideoData(movieFiles[0], mediaData);
				seriestype.set('single');
				modalvideo.set(videoData);
				setCommonSource(videoData.src, videoData.poster, videoData.type, videoData.title);
			} else {
				// Multiple quality files - create playlist
				const playlistData = movieFiles.map((file) => ({
					...convertMovieFileToVideoData(file, mediaData),
					id: file.id || '' // Ensure id exists or provide a fallback
				}));
				playlist.set(playlistData);
				seriestype.set('playlist');
				if (player.playlist) {
					player.playlist(playlistData);
					const playlistItem = playlistData[$playlistindex] || playlistData[0];
					if (playlistItem) {
						player.poster(playlistItem.poster);
						if (player.playlist && typeof player.playlist.currentItem === 'function') {
							player.playlist.currentItem($playlistindex || 0);
						}
					}
				}
			}
		} else if (mediaData.type === 'series' && episodes.length > 0) {
			// Series with episodes
			const playlistData = episodes.map((episode) => ({
				...convertEpisodeToVideoData(episode, mediaData),
				id: episode.id
			}));
			playlist.set(playlistData);
			seriestype.set('playlist');
			if (player.playlist) {
				player.playlist(playlistData);
				const playlistItem = playlistData[$playlistindex] || playlistData[0];
				if (playlistItem) {
					player.poster(playlistItem.poster);
					if (player.playlist && typeof player.playlist.currentItem === 'function') {
						player.playlist.currentItem($playlistindex || 0);
					}
				}
			}
		}

		player.one('loadeddata', handleLoadedData);
	}

	function handleLoadedData(): void {
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
		if (
			$seriestype === 'playlist' &&
			player.playlist &&
			typeof player.playlist.currentItem === 'function'
		) {
			player.playlist.currentItem($playlistindex || 0);
		}
	}

	function handlePlaylistChange(): void {
		if ($seriestype === 'playlist' && $playlist.length > 0 && player) {
			if (player.playlist && typeof player.playlist.currentItem === 'function') {
				player.playlist.currentItem($playlistindex);
				player.playlist.autoadvance?.(0);
			} else {
				// Fallback for when playlist plugin isn't fully loaded
				const currentItem = $playlist[$playlistindex];
				if (currentItem) {
					player.src([{ src: currentItem.src, type: currentItem.type }]);
					player.poster(currentItem.poster);
					modalvideo.set({
						...currentItem,
						id: String(currentItem.id)
					});
				}
			}
		}
	}

	onMount(() => {
		if (videoElement) {
			player = videojs(videoElement, videojsOptions);

			player.ready(() => {
				console.log('Video player ready');

				// Initialize nuevo plugins
				if (player.nuevo) {
					player.nuevo(nuevoOptions);
				}
				if (player.hotkeys) {
					player.hotkeys({ seekStep: 10 });
				}

				// Set initial source
				if ($seriestype === 'playlist') {
					setSource();
					player.pause();
				} else {
					player.pause();
					setSource();
				}

				// Set up playlist navigation for series
				if (mediaData?.type === 'series' && episodes.length > 1) {
					player.on('ended', () => {
						const nextIndex = $playlistindex + 1;
						if (nextIndex < episodes.length) {
							playlistindex.set(nextIndex);
						}
					});
				}
			});

			player.on('error', (e: Event) => {
				console.error('Video player error:', e);
			});
		}
	});

	// React to external changes
	$: if (
		player &&
		mediaData &&
		($seriestype === 'single' || $seriestype === 'default') &&
		$modalvideo
	) {
		setSource();
	}

	$: if (
		player &&
		$seriestype === 'playlist' &&
		$playlist &&
		typeof $playlistindex !== 'undefined'
	) {
		handlePlaylistChange();
	}

	onDestroy(() => {
		if (player) {
			player.dispose();
			player = null;
		}
	});
</script>

	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={videoElement}
		id="my-video"
		class="video-js overflow-hidden"
		controls
		preload="metadata"
	>
		<p class="vjs-no-js">
			To view this video please enable JavaScript, and consider upgrading to a web browser that
			<a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener">
				supports HTML5 video
			</a>.
		</p>
	</video>

<style>
	.overflow-hidden {
		overflow: hidden !important;
	}

	/* Custom nuevo/video.js styling from oldsite */
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
