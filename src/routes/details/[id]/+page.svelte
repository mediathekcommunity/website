<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import Videoplayer from '$lib/components/Videoplayer.svelte';
	import { playlistindex } from '$lib/store';

	let mediaItem: any = null;
	let movieFiles: any[] = [];
	let episodes: any[] = [];
	let loading: boolean = true;
	let error: string | null = null;
	let activeTab: string = 'details'; // Default active tab
	let expandedSections: Set<string> = new Set();

	// Video player state
	let showVideo: boolean = false;
	let currentFile: any = null;
	let currentSeason: number | null = null;
	onMount(async () => {
		try {
			const id = $page.params.id;
			const response = await fetch(`/api/media/${id}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			mediaItem = data;

			if (mediaItem) {
				mediaItem.cast = data.cast || '';
				mediaItem.crew = data.crew || '';
			}

			if (mediaItem && mediaItem.type === 'movie') {
				movieFiles = mediaItem.moviesFiles || [];
			} else if (mediaItem && mediaItem.type === 'series') {
				episodes = mediaItem.episodes || [];
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	});

	function getUniqueSeasons(episodes: any[]): number[] {
		const seasons = new Set<number>();
		episodes.forEach((episode: any) => seasons.add(Number(episode.seasonNumber)));
		return Array.from(seasons).sort((a, b) => a - b);
	}

	function filterEpisodesBySeason(seasonNumber: number) {
		return episodes.filter((episode) => episode.seasonNumber === seasonNumber);
	}

	function toggleSection(sectionId: string) {
		if (expandedSections.has(sectionId)) {
			expandedSections.delete(sectionId);
		} else {
			expandedSections.add(sectionId);
		}
		expandedSections = new Set(expandedSections);
	}

	function isSectionExpanded(sectionId: string): boolean {
		return expandedSections.has(sectionId);
	}

	function playVideo() {
		if (!showVideo) {
			// For movies, use the first available file
			if (mediaItem.type === 'movie' && movieFiles.length > 0) {
				currentFile = movieFiles[0];
			} else if (mediaItem.type === 'series' && episodes.length > 0) {
				// For series, always start with Season 1, Episode 1
				const season1Episodes = episodes.filter(ep => ep.seasonNumber === 1);
				if (season1Episodes.length > 0) {
					currentSeason = 1;
					// Set playlist index to 0 for the first episode of Season 1
					playlistindex.set(0);
					console.log('Starting series playback from Season 1, Episode 1');
				} else {
					console.warn('No Season 1 episodes found, using first available episode');
					const firstEpisode = episodes[0];
					currentSeason = firstEpisode.seasonNumber;
					playlistindex.set(0);
				}
			}
			console.log('Playing video:', currentFile || 'series');
			document.body.scrollIntoView();
			showVideo = true;
		} else {
			stopVideo();
		}
	}

	function stopVideo() {
		showVideo = false;
		currentFile = null;
	}

	function playEpisode(episode: any, index: number) {
		const seasonNumber = episode.seasonNumber;
		
		if (showVideo) {
			// If the player is already active, switch to the episode in the playlist
			console.log('Switching to episode in playlist:', episode.title, 'Season:', seasonNumber);
			
			// Check if we're switching seasons
			if (currentSeason !== seasonNumber) {
				console.log('Switching seasons from', currentSeason, 'to', seasonNumber);
				currentSeason = seasonNumber;
				// When switching seasons, we need to reinitialize the player with the new season's playlist
				// The Videoplayer will react to currentSeason change and rebuild the playlist
				setTimeout(() => {
					// Find the episode index within the current season
					const seasonEpisodes = episodes.filter(ep => ep.seasonNumber === seasonNumber);
					const episodeIndex = seasonEpisodes.findIndex(ep => ep.id === episode.id);
					if (episodeIndex !== -1) {
						playlistindex.set(episodeIndex);
						console.log('Set playlist index to:', episodeIndex, 'within season', seasonNumber);
					}
				}, 100); // Small delay to allow playlist to be rebuilt
			} else {
				// Same season, just switch episode index
				const seasonEpisodes = episodes.filter(ep => ep.seasonNumber === seasonNumber);
				const episodeIndex = seasonEpisodes.findIndex(ep => ep.id === episode.id);
				if (episodeIndex !== -1) {
					playlistindex.set(episodeIndex);
					console.log('Updated playlist index to:', episodeIndex, 'within season', seasonNumber);
				} else {
					console.warn('Episode not found in season episodes:', episode);
				}
			}
		} else {
			// Initialize player with the episode from the selected season
			console.log('Playing episode:', episode.title, 'Season:', seasonNumber);
			currentSeason = seasonNumber;
			
			// Find the episode index within the current season
			const seasonEpisodes = episodes.filter(ep => ep.seasonNumber === seasonNumber);
			const episodeIndex = seasonEpisodes.findIndex(ep => ep.id === episode.id);
			if (episodeIndex !== -1) {
				playlistindex.set(episodeIndex);
			}
			
			document.body.scrollIntoView();
			showVideo = true;
		}
	}

	function playMovieFile(file: any) {
		const switchTime = Date.now();
		
		if (showVideo) {
			// If the player is already active, reset the player state and switch to the new source
			console.log('Switching to new movie file in active player:', file.videoUrl || file.localVideoUrl);
			currentFile = {
				...file,
				// Keep the videoUrl as passed from the button click
				videoUrl: file.videoUrl,
				localVideoUrl: file.localVideoUrl,
				// Add timestamp to force reactivity
				_switchTime: switchTime
			};
		} else {
			// Initialize player with the selected file
			currentFile = {
				...file,
				// Keep the videoUrl as passed from the button click
				videoUrl: file.videoUrl,
				localVideoUrl: file.localVideoUrl,
				// Add timestamp to force reactivity
				_switchTime: switchTime
			};
			console.log('Playing movie file:', currentFile.videoUrl || currentFile.localVideoUrl);
			document.body.scrollIntoView();
			showVideo = true;
		}
	}
	const getImageUrl = (poster_url: any) => {
		if (poster_url) {
			return 'https://img.mediathek.community/images/t/p/original' + poster_url;
		}
		console.warn('No poster_url found for poster_url', poster_url);
		return 'https://via.placeholder.com/1280x720.png?text=No+Image'; // Placeholder image
	};

	function parseMember(member: string) {
		const nameMatch = member.match(/^(.*?)(?=\()/);
		const roleMatch = member.match(/\((.*?)\)/);
		const name = nameMatch ? nameMatch[0].trim() : member.trim();
		const role = roleMatch ? roleMatch[1].trim() : 'N/A';
		return { name, role };
	}
</script>

<main>
	<div>
		{#if loading}
			<p>Loading...</p>
		{:else if error}
			<p>Error: {error}</p>
		{:else if mediaItem}
			{#if showVideo}
				<div class="hero-container2 top60 relative w-full">
					<div class="video-player-container h-full">
						<Videoplayer mediaData={mediaItem} {currentFile} {episodes} {movieFiles} {currentSeason} />
						<button class="close-video-btn" on:click={stopVideo}>Close Video</button>
					</div>
				</div>
			{:else}
				<div class="hero-container relative w-full">
					{#if mediaItem.backdrop_url}
						<img
							src={getImageUrl(mediaItem.backdrop_url)}
							alt={mediaItem.title}
							class="h-full w-full object-cover"
						/>
						<div class="gradient-overlay absolute inset-x-0 bottom-0"></div>
						<div
							class="text-overlay absolute bottom-4 left-4 text-white sm:bottom-8 sm:left-8 md:bottom-12 md:left-16 lg:bottom-16 lg:left-32"
						>
							<h1
								class="mb-2 text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
							>
								{mediaItem.title}
							</h1>
							<div class="flex gap-3">
								<button class="btn btn-primary" on:click={playVideo}>
									<Icon icon="mdi:play" class="mr-2 h-5 w-5" />
									Watch Now
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<div class="w-full">
				<div class="tabs tabs-lift content-wrapper top602 w-full">
					<label class="tab">
						<input
							type="radio"
							name="media_tabs"
							checked={activeTab === 'details'}
							on:change={() => (activeTab = 'details')}
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="me-2 size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
							/>
						</svg>
						Details
					</label>
					<div class="tab-content bg-base-100 border-base-300 p-6">
						<div class="bg-base-100 rounded-lg p-6 shadow-lg">
							<h2 class="mb-4 text-2xl font-bold">Details</h2>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<!-- Left column: Info -->
								<div class="space-y-0">
									<table class="w-full">
										<tbody>
											<tr>
												<td class="py-2 pr-4 align-top font-semibold">Type:</td>
												<td class="py-2"
													><span class="badge badge-primary">{mediaItem.type}</span></td
												>
											</tr>
											<tr>
												<td class="py-2 pr-4 align-top font-semibold">Channel:</td>
												<td class="py-2">{mediaItem.channel?.name || 'Unknown'}</td>
											</tr>
											<tr>
												<td class="py-2 pr-4 align-top font-semibold">Genre:</td>
												<td class="py-2">
													{#each mediaItem.genre.split(',') as genre}
														<span class="badge badge-secondary mr-2">{genre.trim()}</span>
													{/each}
												</td>
											</tr>
											<tr>
												<td class="py-2 pr-4 align-top font-semibold">Release Year:</td>
												<td class="py-2">{mediaItem.release_date_year}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<!-- Right column: Description only -->
								<div>
									<h3 class="mb-2 text-lg font-semibold">Description</h3>
									<p class="text-base-content/80 leading-relaxed">{mediaItem.description}</p>
								</div>
							</div>

							<h2 class="mt-6 mb-4 text-2xl font-bold">Cast & Crew</h2>
							<div class="tabs">
								<input type="radio" name="cast_crew_tabs" class="tab" aria-label="Cast" checked />
								<div class="tab-content bg-base-100 border-base-300 p-6">
									<div class="max-h-[calc(6*2.5rem)] overflow-auto">
										<table class="w-full">
											<tbody>
												{#each mediaItem.cast.split(',') as castMember}
													<tr>
														<td class="py-2 pr-4 align-top font-semibold"
															>{parseMember(castMember).name}</td
														>
														<td class="py-2">{parseMember(castMember).role}</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								</div>

								<input type="radio" name="cast_crew_tabs" class="tab" aria-label="Crew" />
								<div class="tab-content bg-base-100 border-base-300 p-6">
									<div class="max-h-[calc(6*2.5rem)] overflow-auto">
										<table class="w-full">
											<tbody>
												{#each mediaItem.crew.split(',') as crewMember}
													<tr>
														<td class="py-2 pr-4 align-top font-semibold"
															>{parseMember(crewMember).name}</td
														>
														<td class="py-2">{parseMember(crewMember).role}</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>

					{#if mediaItem.type === 'movie'}
						<label class="tab">
							<input
								type="radio"
								name="media_tabs"
								checked={activeTab === 'links'}
								on:change={() => (activeTab = 'links')}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="me-2 size-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
								/>
							</svg>
							Links
						</label>
						<div class="tab-content bg-base-100 border-base-300 p-6">
							<div class="space-y-4">
								<h2 class="mb-4 text-2xl font-bold">Available Files</h2>
								{#if movieFiles.length > 0}
									{#each movieFiles as file, index (file.id)}
										<div class="bg-base-100 border-base-300 rounded-lg border p-4">
											<h3 class="mb-3 text-lg font-medium">{file.quality}</h3>
											<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
												<!-- Left column: File Info -->
												<div class="min-w-0">
													<table class="w-full table-fixed">
														<tbody>
															<tr>
																<td class="w-1/2 py-2 pr-4 align-top font-semibold">Quality:</td>
																<td class="w-1/2 py-2"
																	><span class="badge badge-primary">{file.quality}</span></td
																>
															</tr>
															<tr>
																<td class="w-1/2 py-2 pr-4 align-top font-semibold">Format:</td>
																<td class="w-1/2 py-2"
																	><span class="badge badge-secondary">{file.format}</span></td
																>
															</tr>
															<tr>
																<td class="w-1/2 py-2 pr-4 align-top font-semibold">Audio:</td>
																<td class="w-1/2 py-2">{file.audioLanguageFormat}</td>
															</tr>
															<tr>
																<td class="w-1/2 py-2 pr-4 align-top font-semibold">Subtitles:</td>
																<td class="w-1/2 py-2">{file.subtitlesInfo}</td>
															</tr>
														</tbody>
													</table>
												</div>
												<!-- Right column: Play Actions -->
												<div class="flex flex-col justify-center gap-3">
													{#if file.videoUrl}
														<button
															class="btn btn-primary btn-sm"
															on:click={() => playMovieFile({ ...file, videoUrl: file.videoUrl })}
														>
															<Icon icon="mdi:play" class="mr-1 h-4 w-4" />
															Play OV
														</button>
													{/if}
													{#if file.localVideoUrl}
														<button
															class="btn btn-secondary btn-sm"
															on:click={() =>
																playMovieFile({ ...file, videoUrl: file.localVideoUrl })}
														>
															<Icon icon="mdi:play" class="mr-1 h-4 w-4" />
															Play Local
														</button>
													{/if}
													{#if !file.videoUrl && !file.localVideoUrl}
														<div class="text-base-content/60 text-sm">No video URLs available</div>
													{/if}
												</div>
											</div>
										</div>
									{/each}
								{:else}
									<div class="alert alert-info">
										<Icon icon="mdi:information" class="h-5 w-5" />
										<span>No video files available for this movie.</span>
									</div>
								{/if}
							</div>
						</div>
					{:else if mediaItem.type === 'series'}
						{#each getUniqueSeasons(episodes) as seasonNumber}
							<label class="tab">
								<input
									type="radio"
									name="media_tabs"
									checked={activeTab === `season-${seasonNumber}`}
									on:change={() => (activeTab = `season-${seasonNumber}`)}
								/>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="me-2 size-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 20.25h12m-7.5-3v3m3-3v3m-10.5-3h15M7.5 4.5h9m-9 0a1.5 1.5 0 0 0-1.5 1.5v4.25h12V6a1.5 1.5 0 0 0-1.5-1.5h-9Zm9 0V3a.75.75 0 0 0-.75-.75h-7.5A.75.75 0 0 0 7.5 3v1.5"
									/>
								</svg>
								Season {seasonNumber}
							</label>
							<div class="tab-content bg-base-100 border-base-300 p-6">
								<div class="space-y-4">
									<h2 class="mb-4 text-2xl font-bold">Episodes for Season {seasonNumber}</h2>
									{#each filterEpisodesBySeason(seasonNumber) as episode, index (episode.id)}
										<div class="collapse-arrow bg-base-100 border-base-300 collapse border">
											<input
												type="radio"
												name="season-{seasonNumber}-accordion"
												checked={index === 0}
											/>
											<div class="collapse-title text-lg font-medium">
												Episode {episode.episodeNumber}: {episode.title}
											</div>
											<div class="collapse-content">
												<div class="space-y-3">
													<p class="text-base-content/80">{episode.description}</p>
													<div class="flex flex-wrap gap-2">
														{#if episode.audioLanguageFormat}
															<span class="badge badge-primary">{episode.audioLanguageFormat}</span>
														{/if}
														{#if episode.subtitlesInfo}
															<span class="badge badge-secondary">{episode.subtitlesInfo}</span>
														{/if}
													</div>
													<div class="flex gap-3 pt-2">
														{#if episode.originalVideoUrl || episode.localVideoUrl}
															{#if episode.originalVideoUrl}
																<button
																	class="btn btn-primary btn-sm"
																	on:click={() =>
																		playEpisode(
																			{ ...episode, videoUrl: episode.originalVideoUrl },
																			index
																		)}
																>
																	<Icon icon="mdi:play" class="mr-1 h-4 w-4" />
																	Play OV
																</button>
															{/if}
															{#if episode.localVideoUrl}
																<button
																	class="btn btn-secondary btn-sm"
																	on:click={() =>
																		playEpisode(
																			{ ...episode, videoUrl: episode.localVideoUrl },
																			index
																		)}
																>
																	<Icon icon="mdi:play" class="mr-1 h-4 w-4" />
																	Play Local
																</button>
															{/if}
														{:else}
															<button class="btn btn-disabled btn-sm" disabled
																>Link comes later</button
															>
														{/if}
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					{/if}
				</div>

				<div class="py-6"></div>
			</div>
		{:else}
			<p>Media not found or an error occurred.</p>
		{/if}
	</div>
</main>

<style>
	main {
		padding: 0;
	}

	.hero-container {
		position: relative;
		width: 100%;
		height: 85vh;
		max-height: 95vh;
		top: auto;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.hero-container2 {
		position: relative;
		width: 100%;
		height: 52vh;
		top: auto;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.video-player-container {
		position: relative;
		/* top: 60px !important; */
		width: 100%;
		/*max-width: 1200px;*/
		margin: 0 auto 2rem;
		aspect-ratio: 16 / 9;
		background-color: black;
		border-radius: 8px;
		overflow: hidden;
	}

	/* Mobile-specific styling for video player - 50% height on mobile */
	@media (max-width: 768px) {
		.video-player-container {
			height: 50vh;
			aspect-ratio: unset;
		}
	}

	.close-video-btn {
		position: absolute;
		top: 20px;
		left: 10px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 5px 10px;
		cursor: pointer;
		z-index: 10;
		opacity: 0;
		display: none;
	}

	.close-video-btn:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	.video-player-container:hover .close-video-btn {
		display: block;
		opacity: 1;
	}

	.content-wrapper {
		width: 100%;
		margin: 0;
		padding: 0 1rem 2rem 1rem;
	}

	.top60 {
		top: 60px;
	}

	.top602 {
		margin-top: 60px;
	}

	.gradient-overlay {
		height: 75%;
		background: linear-gradient(
			to top,
			rgb(17, 17, 17) 0%,
			rgba(17, 17, 17, 0.987) 7.8%,
			rgba(17, 17, 17, 0.951) 15.2%,
			rgba(17, 17, 17, 0.896) 22.1%,
			rgba(17, 17, 17, 0.825) 28.7%,
			rgba(17, 17, 17, 0.741) 35.1%,
			rgba(17, 17, 17, 0.648) 41.2%,
			rgba(17, 17, 17, 0.55) 47.1%,
			rgba(17, 17, 17, 0.45) 52.9%,
			rgba(17, 17, 17, 0.352) 58.8%,
			rgba(17, 17, 17, 0.259) 64.9%,
			rgba(17, 17, 17, 0.175) 71.3%,
			rgba(17, 17, 17, 0.104) 77.9%,
			rgba(17, 17, 17, 0.049) 84.8%,
			rgba(17, 17, 17, 0.013) 92.2%,
			rgba(17, 17, 17, 0) 100%
		);
	}

	.text-overlay {
		text-align: left;
		width: calc(100% - 2rem);
		max-width: 100%;
	}

	@media (max-width: 480px) {
		.hero-container {
			height: 40vh;
			min-height: 250px;
			max-height: 50vh;
		}
		.hero-container2 {
			height: 40vh;
			min-height: 250px;
			max-height: 50vh;
		}
		.gradient-overlay {
			height: 85%;
		}
	}

	@media (min-width: 481px) and (max-width: 640px) {
		.hero-container {
			height: 50vh;
			min-height: 300px;
			max-height: 60vh;
		}
		.hero-container2 {
			height: 50vh;
			min-height: 300px;
			max-height: 60vh;
		}
		.gradient-overlay {
			height: 80%;
		}
	}

	@media (min-width: 641px) and (max-width: 768px) {
		.hero-container {
			height: 60vh;
			max-height: 75vh;
		}
		.hero-container2 {
			height: 60vh;
			max-height: 75vh;
		}
		.gradient-overlay {
			height: 75%;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.hero-container {
			height: 70vh;
			max-height: 85vh;
		}
		.hero-container2 {
			height: 70vh;
			max-height: 85vh;
		}
		.gradient-overlay {
			height: 75%;
		}
	}

	@media (min-width: 1025px) {
		.hero-container {
			height: 85vh;
			max-height: 95vh;
		}
		.hero-container2 {
			height: 85vh;
			max-height: 95vh;
		}
		.gradient-overlay {
			height: 75%;
		}
	}
</style>
