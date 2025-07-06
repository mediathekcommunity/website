<script>
export const prerender = false;

import { createEventDispatcher, onDestroy, onMount } from "svelte";
import "../videojs/skins/gold1/videojs.min.css";
import videojs from "video.js";
import "../videojs/plugins/es/nuevo.js";
import "../videojs/plugins/es/playlist.js";
import "../videojs/plugins/es/videojs.hotkeys";

// Create event dispatcher to communicate with parent
const dispatch = createEventDispatcher();

// Single data prop for Astro integration
export let data = {};
export let playlistType = "regular"; // Can be 'regular' or 'ov'
export let episodeIndex = 0; // Index of episode to play
export let active = 1; // Controls whether player should be active (1) or disposed (0)

// Log when component is created
console.log("Videoplayer component created with active =", active);

// Watch for active prop changes to handle cleanup/initialization
$: {
	console.log("Active prop changed to:", active);

	if (active === 0 && player) {
		// Active is set to 0, dispose the player
		console.log("Disposing player due to active=0");
		player.pause();
		player.dispose();
		player = null;

		// Let parent component know the player was destroyed
		dispatch("playerDestroyed");
	} else if (active === 1 && !player) {
		// Active is set to 1, initialize player if not already done
		console.log("Initializing player due to active=1");
		const videoElement = document.getElementById("main-videoplayer");

		if (videoElement) {
			player = videojs(videoElement, videojsOptions);
			player.ready(() => {
				player.nuevo?.(nuevoOptions);
				player.hotkeys?.({ seekStep: 10 });
				if (seriestype === "playlist") {
					setSource("playlist");
				} else {
					setSource(seriestype);
				}
			});
		}
	}
}

$: console.log(
	"Videoplayer data:",
	data,
	"playlistType:",
	playlistType,
	"episodeIndex:",
	episodeIndex,
);

// Declare reactive variables
let modalvideo = null;
let playlistindex = 0;

// Derived values from the data prop based on content schema
$: modalvideo = data?.info?.type?.includes("movie")
	? {
			src:
				data?.videosource?.src ||
				"https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
			type: data?.videosource?.type || "video/mp4",
			poster: data?.info?.poster || data?.info?.backdrop || "",
			thumb: data?.info?.poster || data?.info?.backdrop || "",
			title: data?.title || "",
			sources: data?.videosource?.sources || [
				{
					src:
						data?.videosource?.src ||
						"https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
					type: data?.videosource?.type || "video/mp4",
				},
			],
			tracks:
				data?.sublangs?.map((sub) => ({
					kind: "subtitles",
					srclang: sub.srclang,
					label: sub.srclang,
				})) || [],
		}
	: data?.modalvideo || null;

// Define the playlist variable
let playlist = {};

// For series, select the correct playlist based on playlistType
$: {
	// Debug log the data and playlistType before determining playlist
	console.log(
		"Processing playlist with data:",
		data?.info?.type,
		"playlistType:",
		playlistType,
	);
	console.log(
		"Available playlists:",
		data?.playlist?.ov ? "OV available" : "No OV",
		data?.playlist?.regular ? "Regular available" : "No regular",
	);

	// For series, select the correct playlist based on playlistType
	if (data?.info?.type?.includes("series")) {
		// It's a series, so we need to select the right language version
		if (data?.playlist) {
			// We have a playlist object
			const selectedPlaylist =
				playlistType === "ov"
					? data.playlist.ov // Get original version if requested
					: data.playlist.regular; // Otherwise get regular/default version

			// Log what we selected
			console.log(
				"Selected playlist:",
				playlistType,
				selectedPlaylist ? "found" : "not found",
			);

			// Set the playlist, falling back to empty object if needed
			playlist = selectedPlaylist || {};
		} else {
			// No playlist found in data
			console.log("No playlist found in data");
			playlist = {};
		}
	} else {
		// Not a series, use whatever playlist is available
		console.log("Not a series, using default playlist");
		playlist = data?.playlist || {};
	}
}

// Process playlist to ensure all items have sources property
$: {
	// Store the current playlist value to avoid modifications during processing
	const currentPlaylist = playlist;

	if (
		currentPlaylist &&
		typeof currentPlaylist === "object" &&
		!Array.isArray(currentPlaylist)
	) {
		try {
			// Process seasons in playlist object
			const processedPlaylist = Object.entries(currentPlaylist).map(
				([seasonKey, episodes]) => {
					// Check if episodes is an array
					if (Array.isArray(episodes)) {
						// For each season, ensure all episodes have sources
						const processedEpisodes = episodes.map((episode) => {
							if (!episode.sources) {
								return {
									...episode,
									sources: [
										{
											src:
												episode.src ||
												"https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
											type: episode.type || "video/mp4",
										},
									],
								};
							}
							return episode;
						});
						return [seasonKey, processedEpisodes];
					}
					return [seasonKey, []]; // Return empty array if episodes is not an array
				},
			);

			// Convert back to object and update playlist
			if (processedPlaylist.length > 0) {
				const processedObject = Object.fromEntries(processedPlaylist);
				// Update the playlist with the processed data
				playlist = processedObject;
				console.log("Processed playlist:", playlist);
			}
		} catch (error) {
			console.error("Error processing playlist:", error);
			// Don't modify playlist in case of error
		}
	}
}

// Subtitles info
$: subs = data?.sublangs || data?.subs || null;

// Determine content type
$: seriestype = data?.info?.type?.includes("series")
	? "playlist"
	: data?.seriestype || "single";

// Episode/playlist index - use episodeIndex prop if provided
$: {
	// Update playlistindex when episodeIndex changes
	playlistindex = episodeIndex ?? data?.playlistindex ?? 0;
	console.log("Updated playlistindex:", playlistindex);
}

let player = null;
let videoSource = null;

const videojsOptions = {
	license: "0902555a051359560f49525c090a445d0d1348",
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
			maxBufferLength: 30,
		},
	},
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
	rewindforward: 30,
};

function setSource(type) {
	if (!player) return;
	player.currentTime(0);

	const setCommonSource = (src, poster, videoType) => {
		videoSource = {
			sources: [{ src, type: videoType }],
			poster,
			title: modalvideo?.title || "",
		};
		player.poster(poster);
		player.src(videoSource.sources);
	};

	switch (type) {
		case "playlist":
			console.log(
				"Setting playlist source, playlist:",
				playlist,
				"index:",
				playlistindex,
			);

			// Check if playlist is populated and has the correct season/episode structure
			if (playlist && typeof playlist === "object") {
				// Get the selected season
				const seasonKeys = Object.keys(playlist);
				if (seasonKeys.length > 0) {
					// Get the active season (default to the first one if not specified)
					const activeSeason = playlistindex.toString() || seasonKeys[0];
					console.log("Active season:", activeSeason);

					// Get episodes for this season
					const episodes = playlist[activeSeason];
					if (Array.isArray(episodes) && episodes.length > 0) {
						// Get the active episode (default to the first one)
						const activeEpisodeIndex = 0; // We can make this configurable later
						const episode = episodes[activeEpisodeIndex];

						console.log("Active episode:", episode);

						// Setup the playlist in the player
						try {
							player.playlist(episodes);

							// Set the poster
							if (episode) {
								player.poster(episode.thumb || episode.poster || "");

								// Handle sources
								if (episode.sources && episode.sources.length > 0) {
									console.log("Using sources array:", episode.sources);
									player.src(episode.sources);
								} else if (episode.src) {
									// Fallback to src/type fields
									console.log(
										"Using src/type fields:",
										episode.src,
										episode.type,
									);
									const sources = [
										{
											src: episode.src,
											type: episode.type || "video/mp4",
										},
									];
									player.src(sources);
								} else {
									// Ultimate fallback to default source
									console.log("Using default source");
									const sources = [
										{
											src: "https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
											type: "video/mp4",
										},
									];
									player.src(sources);
								}

								// Set current item if playlist API is available
								if (
									player.playlist &&
									typeof player.playlist.currentItem === "function"
								) {
									player.playlist.currentItem(activeEpisodeIndex);
								}
							}
						} catch (error) {
							console.error("Error setting up playlist:", error);
							// Fallback to default source in case of error
							player.src([
								{
									src: "https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
									type: "video/mp4",
								},
							]);
						}
					} else {
						console.warn("No episodes found for season:", activeSeason);
						// Fallback to default source
						player.src([
							{
								src: "https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
								type: "video/mp4",
							},
						]);
					}
				} else {
					console.warn("No seasons found in playlist");
					// Fallback to default source
					player.src([
						{
							src: "https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
							type: "video/mp4",
						},
					]);
				}
			} else {
				console.warn("Invalid playlist structure:", playlist);
				// Fallback to default source
				player.src([
					{
						src: "https://tvdlzdf-a.akamaihd.net/dach/zdf/24/09/240908_2015_sendung_agg/1/240908_2015_sendung_agg_a3a4_6660k_p37v17.mp4",
						type: "video/mp4",
					},
				]);
			}
			break;
		case "single":
		case "default":
			if (modalvideo) {
				// Use sources array if available, otherwise fall back to src/type
				if (modalvideo.sources && modalvideo.sources.length > 0) {
					player.poster(modalvideo.thumb || modalvideo.poster);
					player.src(modalvideo.sources);
				} else {
					setCommonSource(
						modalvideo.src,
						modalvideo.thumb || modalvideo.poster,
						modalvideo.type,
					);
				}
			}
			break;
	}
	player.one("loadeddata", handleLoadedData);
}

function handleLoadedData() {
	if (!player) return;
	const index = playlistindex;
	const currentModalVideo = modalvideo;
	const currentPlaylist = playlist;
	if (currentModalVideo?.tracks) {
		player.loadTracks?.(currentModalVideo.tracks);
	} else if (currentPlaylist && currentPlaylist[index]?.tracks) {
		player.loadTracks?.(currentPlaylist[index].tracks);
	}
	player.pause();
	if (seriestype === "playlist") {
		player.playlist.currentItem(playlistindex);
	}
	/**console.log(
			'loadeddata',
			seriestype,
			playlistindex,
			currentModalVideo,
			currentPlaylist,
			player
		);**/
}

onMount(() => {
	const videoElement = document.getElementById("main-videoplayer");
	console.log("Found video element:", videoElement);
	console.log("Active prop value in onMount:", active);

	// Only initialize player if active is set to 1
	if (videoElement && active === 1) {
		console.log("Initializing player in onMount (active=1)");
		player = videojs(videoElement, videojsOptions);
		player.ready(() => {
			player.nuevo?.(nuevoOptions);
			player.hotkeys?.({ seekStep: 10 });
			if (seriestype === "playlist") {
				setSource("playlist");
				player.pause();
			} else {
				player.pause();
				setSource(seriestype);
			}
		});

		// In Svelte components, we should use a dispatch approach
		// The Astro component will handle setting props on the component instance
		// This is handled through the props reactivity, not event listeners
		console.log(
			"Player initialized with playlistType:",
			playlistType,
			"episodeIndex:",
			episodeIndex,
		);
	} else {
		console.log("Not initializing player in onMount (active=", active, ")");
	}

	return () => {
		console.log("Unmounting video player from onMount cleanup");
		if (player) {
			destroyPlayer();
		}
	};
});
$: if (
	player &&
	(seriestype === "single" || seriestype === "default") &&
	modalvideo
) {
	setSource(seriestype);
}

$: if (
	player &&
	seriestype === "playlist" &&
	playlist &&
	typeof playlistindex !== "undefined"
) {
	setSource("playlist");
	player.playlist?.autoadvance?.(0);
	console.log("playlist", playlist, playlistindex);
}

onDestroy(() => {
	console.log("Manually destroying video player");

	if (player) {
		player.dispose();
		player = null;
	}
});

// Manually destroy the player - can be called from outside
export function destroyPlayer() {
	console.log("Manually destroying video player");
	if (player) {
		player.pause();
		player.dispose();
		player = null;
	}

	// Let parent component know the player was destroyed
	dispatch("playerDestroyed");
	return true;
}

// Reset the player when container visibility changes - called from parent
export function resetPlayer() {
	if (player) {
		console.log("Resetting video player");
		// Trigger player resize to fit container properly
		player.dimensions(player.el().clientWidth, player.el().clientHeight);
	} else {
		// If player was destroyed, reinitialize it
		console.log("Reinitializing video player");
		const videoElement = document.getElementById("main-videoplayer");
		if (videoElement) {
			player = videojs(videoElement, videojsOptions);
			player.ready(() => {
				player.nuevo?.(nuevoOptions);
				player.hotkeys?.({ seekStep: 10 });
				if (seriestype === "playlist") {
					setSource("playlist");
				} else {
					setSource(seriestype);
				}
			});
		}
	}
	return true;
}

// Function to update playlist type and episode index
// This can be called from outside using the exported function
function updatePlaylist(type = "regular", index = 0) {
	console.log("Updating playlist:", type, index);

	// Update the props
	playlistType = type;
	playlistindex = index; // This is the season index

	// Update derived state
	// This will trigger the reactive statement for playlist based on the new playlistType
	// which will then select the correct language version of the playlist

	// If player is ready, update the source
	if (player && seriestype === "playlist") {
		// Short delay to ensure reactive statement has completed
		setTimeout(() => {
			setSource("playlist");
		}, 10);
	}

	// Dispatch an event to notify parent component
	dispatch("episodeChange", { type, index });
}

// Export the function to be accessible via component instance
export function changeEpisode(type = "regular", index = 0) {
	console.log("changeEpisode called with:", type, index);

	// Ensure we're using valid parameters
	const validType = typeof type === "string" ? type : "regular";
	const validIndex =
		typeof index === "number"
			? index
			: typeof index === "string"
				? parseInt(index, 10) || 0
				: 0;

	// Call the internal update function
	updatePlaylist(validType, validIndex);

	// For improved diagnostics, return the values we're using
	return { type: validType, index: validIndex };
}
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video playsinline class="video-js overflow-hidden" id="main-videoplayer" data-videoplayer-component="true"></video>

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
