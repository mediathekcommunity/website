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
	export let currentSeason: number | null = null; // Track current season for series

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
		console.log('Player loading new source:', src);
		
		videoSource = {
			sources: [{ src, type: videoType }],
			poster,
			title: title || ''
		};
		
		// Force player to reload the source
		if (player) {
			player.pause();
			player.currentTime(0);
			player.poster(poster);
			player.src(videoSource.sources);
			player.load(); // Force reload
		}
	}

	// Convert our new schema data to video player format
	function convertMovieFileToVideoData(file: MovieFile, media: MediaItem | null): any {
		// Use the appropriate video URL (prioritize the one that was clicked)
		const videoUrl = file.videoUrl || file.localVideoUrl;
		
		if (!videoUrl) {
			console.warn('No video URL found in file:', file);
		}
		
		const result = {
			src: videoUrl,
			type: getVideoType(file.format || 'mp4'),
			title: media?.title || 'Untitled',
			poster: media?.poster_url || '',
			quality: file.quality,
			tracks: parseSubtitles(file.subtitlesInfo),
			// Add a unique identifier to help with reactivity
			_sourceId: `${videoUrl}_${Date.now()}`
		};
		
		return result;
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
			if (subtitlesInfo.startsWith('[') || subtitlesInfo.startsWith('{')) {
				const parsed = JSON.parse(subtitlesInfo);
				return Array.isArray(parsed) ? parsed : [parsed];
			}

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
			console.warn('Failed to parse subtitles info:', subtitlesInfo, e);
			return [];
		}
	}

	function setSource(): void {
		if (!player || !mediaData) {
			console.log('setSource: Missing player or mediaData');
			return;
		}

		console.log('setSource called for:', mediaData.type, currentFile ? 'with currentFile' : 'without currentFile');

		let videoData;

		if (mediaData.type === 'movie' && currentFile) {
			videoData = convertMovieFileToVideoData(currentFile, mediaData);
			updatePlayer(videoData);
		} else if (mediaData.type === 'movie' && movieFiles.length > 0) {
			if (movieFiles.length === 1) {
				videoData = convertMovieFileToVideoData(movieFiles[0], mediaData);
				updatePlayer(videoData);
			} else {
				const playlistData = movieFiles.map((file) => ({
					...convertMovieFileToVideoData(file, mediaData),
					id: file.id || ''
				}));
				updatePlaylist(playlistData);
			}
		} else if (mediaData.type === 'series' && episodes.length > 0) {
			// Filter episodes by current season if specified, otherwise use all episodes
			const episodesToUse = currentSeason 
				? episodes.filter(episode => episode.seasonNumber === currentSeason)
				: episodes;
			
			console.log('Creating playlist for season:', currentSeason, 'Episodes:', episodesToUse.length);
			
			const playlistData = episodesToUse.map((episode) => ({
				...convertEpisodeToVideoData(episode, mediaData),
				id: episode.id
			}));
			updatePlaylist(playlistData);
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
		console.log('handlePlaylistChange called:', { 
			seriestype: $seriestype, 
			playlistLength: $playlist.length, 
			playlistindex: $playlistindex,
			hasPlayer: !!player 
		});
		
		if ($seriestype === 'playlist' && $playlist.length > 0 && player) {
			if (player.playlist && typeof player.playlist.currentItem === 'function') {
				console.log('Using video.js playlist.currentItem');
				player.playlist.currentItem($playlistindex);
				player.playlist.autoadvance?.(0);
			} else {
				console.log('Using manual playlist switching');
				const currentItem = $playlist[$playlistindex];
				if (currentItem) {
					console.log('Switching to playlist item:', currentItem.src);
					player.src([{ src: currentItem.src, type: currentItem.type }]);
					player.poster(currentItem.poster);
					modalvideo.set({
						...currentItem,
						id: String(currentItem.id)
					});
				} else {
					console.warn('No playlist item found at index:', $playlistindex);
				}
			}
		}
	}

	function updatePlayer(videoData: any): void {
		if (!player || !videoData) {
			console.log('updatePlayer: Missing player or videoData');
			return;
		}
		
		console.log('Updating player source to:', videoData.src);
		
		seriestype.set('single');
		modalvideo.set(videoData);
		
		// Set new source (setCommonSource handles the reset)
		setCommonSource(videoData.src, videoData.poster, videoData.type, videoData.title);
	}

	function updatePlaylist(playlistData: any[]): void {
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

	onMount(() => {
		console.log('Videoplayer mounted with mediaData:', mediaData);
		console.log('Initial currentFile:', currentFile);
		console.log('Episodes:', episodes);
		console.log('Movie files:', movieFiles);

		if (videoElement) {
			player = videojs(videoElement, videojsOptions);

			player.ready(() => {
				if (player.nuevo) {
					player.nuevo(nuevoOptions);
				}
				if (player.hotkeys) {
					player.hotkeys({ seekStep: 10 });
				}

				setSource();
				player.pause();

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

	// React to external changes - consolidated reactive block
	$: if (player && mediaData && currentFile && mediaData.type === 'movie') {
		console.log('Movie currentFile reactive block triggered:', currentFile._switchTime);
		setSource();
	}
	
	// Separate reactive block for series and other cases
	$: if (player && mediaData && ($seriestype === 'single' || $seriestype === 'default') && $modalvideo && !currentFile) {
		console.log('Modal video reactive block triggered');
		setSource();
	}

	$: if (
		player &&
		$seriestype === 'playlist' &&
		$playlist &&
		typeof $playlistindex !== 'undefined'
	) {
		console.log('Playlist reactive block triggered:', {
			playlistIndex: $playlistindex,
			playlistLength: $playlist.length,
			seriestype: $seriestype
		});
		handlePlaylistChange();
	}

	// React to currentSeason changes for series - rebuild playlist when season changes
	$: if (player && mediaData && mediaData.type === 'series' && episodes.length > 0 && currentSeason !== null) {
		console.log('Current season changed, rebuilding playlist for season:', currentSeason);
		setSource();
	}

	$: if (mediaData && player && currentFile) {
		if (player.playlist && typeof player.playlist.currentItem === 'function') {
			const playlistIndex = playlist.get().findIndex(item => item.src === currentFile.videoUrl || item.src === currentFile.localVideoUrl);
			if (playlistIndex !== -1) {
				player.playlist.currentItem(playlistIndex);
				console.log('Switched to playlist index:', playlistIndex);
				console.log('Active playlist item:', player.playlist()[playlistIndex]);
			} else {
				player.playlist.insert(convertMovieFileToVideoData(currentFile, mediaData));
				console.log('Inserted new media item into playlist:', currentFile);
			}
		} else {
			player.playlist.new([convertMovieFileToVideoData(currentFile, mediaData)]);
			console.log('Loaded new playlist with current file:', currentFile);
		}
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