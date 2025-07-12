<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
  import Videoplayer from '$lib/components/Videoplayer.svelte';

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

  onMount(async () => {
    try {
      const id = $page.params.id;
      const response = await fetch(`/api/media/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      mediaItem = data;

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
    return episodes.filter(episode => episode.seasonNumber === seasonNumber);
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
      }
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
    // Set the episode with the correct video URL for the player
    currentFile = {
      ...episode,
      // Ensure we use the videoUrl if it's set, otherwise fall back to originalVideoUrl
      originalVideoUrl: episode.videoUrl || episode.originalVideoUrl,
      localVideoUrl: episode.localVideoUrl
    };
    document.body.scrollIntoView();
    showVideo = true;
  }

  function playMovieFile(file: any) {
    currentFile = file;
    document.body.scrollIntoView();
    showVideo = true;
  }
</script>

<main>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if mediaItem}
    {#if showVideo}
      <div class="hero-container2 top60 relative w-full">
        <div class="video-player-container h-full">
          <Videoplayer 
            mediaData={mediaItem} 
            {currentFile} 
            {episodes} 
            {movieFiles} 
          />
          <button class="close-video-btn" on:click={stopVideo}>Close Video</button>
        </div>
      </div>
    {:else}
      <div class="hero-container relative w-full">
        {#if mediaItem.thumbnail_url}
          <img
            src={mediaItem.thumbnail_url}
            alt={mediaItem.title}
            class="w-full h-full object-cover"
          />
          <div class="gradient-overlay absolute inset-x-0 bottom-0"></div>
          <div class="text-overlay absolute bottom-4 left-4 text-white sm:bottom-8 sm:left-8 md:bottom-12 md:left-16 lg:bottom-16 lg:left-32">
            <h1 class="mb-2 text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              {mediaItem.title}
            </h1>
            <p class="text-sm text-gray-300 sm:text-base md:text-lg max-w-2xl mb-4">
              {mediaItem.description}
            </p>
            <div class="flex gap-3">
              <button class="btn btn-primary" on:click={playVideo}>
                <Icon icon="mdi:play" class="w-5 h-5 mr-2" />
                Watch Now
              </button>
              <button class="btn btn-outline btn-ghost text-white border-white hover:bg-white hover:text-black">
                <Icon icon="mdi:plus" class="w-5 h-5 mr-2" />
                Add to List
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <div class="w-full">
      <div class="tabs tabs-lift w-full content-wrapper top602">
        <label class="tab">
          <input type="radio" name="media_tabs" checked={activeTab === 'details'} on:change={() => (activeTab = 'details')} />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 me-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          Details
        </label>
        <div class="tab-content bg-base-100 border-base-300 p-6">
          <div class="bg-base-100 rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-4">Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left column: Info -->
              <div class="space-y-0">
                <table class="w-full">
                  <tbody>
                    <tr>
                      <td class="py-2 pr-4 font-semibold align-top">Type:</td>
                      <td class="py-2"><span class="badge badge-primary">{mediaItem.type}</span></td>
                    </tr>
                    <tr>
                      <td class="py-2 pr-4 font-semibold align-top">Channel:</td>
                      <td class="py-2">{mediaItem.channel?.name || 'Unknown'}</td>
                    </tr>
                    <tr>
                      <td class="py-2 pr-4 font-semibold align-top">Genre:</td>
                      <td class="py-2"><span class="badge badge-secondary">{mediaItem.genre}</span></td>
                    </tr>
                    <tr>
                      <td class="py-2 pr-4 font-semibold align-top">Release Year:</td>
                      <td class="py-2">{mediaItem.release_date_year}</td>
                    </tr>
                    <tr>
                      <td class="py-2 pr-4 font-semibold align-top">Cast & Crew:</td>
                      <td class="py-2">{mediaItem.cast_crew}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- Right column: Description only -->
              <div>
                <h3 class="font-semibold text-lg mb-2">Description</h3>
                <p class="text-base-content/80 leading-relaxed">{mediaItem.description}</p>
              </div>
            </div>
          </div>
        </div>

        {#if mediaItem.type === 'movie'}
          <label class="tab">
            <input type="radio" name="media_tabs" checked={activeTab === 'links'} on:change={() => (activeTab = 'links')} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 me-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            Links
          </label>
          <div class="tab-content bg-base-100 border-base-300 p-6">
            <div class="space-y-4">
              <h2 class="text-2xl font-bold mb-4">Available Files</h2>
              {#if movieFiles.length > 0}
                {#each movieFiles as file, index (file.id)}
                  <div class="bg-base-100 border border-base-300 rounded-lg p-4">
                    <h3 class="text-lg font-medium mb-3">{file.quality}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Left column: File Info -->
                      <div class="min-w-0">
                        <table class="w-full table-fixed">
                          <tbody>
                            <tr>
                              <td class="py-2 pr-4 font-semibold align-top w-1/2">Quality:</td>
                              <td class="py-2 w-1/2"><span class="badge badge-primary">{file.quality}</span></td>
                            </tr>
                            <tr>
                              <td class="py-2 pr-4 font-semibold align-top w-1/2">Format:</td>
                              <td class="py-2 w-1/2"><span class="badge badge-secondary">{file.format}</span></td>
                            </tr>
                            <tr>
                              <td class="py-2 pr-4 font-semibold align-top w-1/2">Audio:</td>
                              <td class="py-2 w-1/2">{file.audioLanguageFormat}</td>
                            </tr>
                            <tr>
                              <td class="py-2 pr-4 font-semibold align-top w-1/2">Subtitles:</td>
                              <td class="py-2 w-1/2">{file.subtitlesInfo}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!-- Right column: Play Actions -->
                      <div class="flex flex-col justify-center gap-3">
                        {#if file.videoUrl}
                          <button class="btn btn-primary btn-sm" on:click={() => playMovieFile({...file, videoUrl: file.videoUrl})}>
                            <Icon icon="mdi:play" class="w-4 h-4 mr-1" />
                            Play OV
                          </button>
                        {/if}
                        {#if file.localVideoUrl}
                          <button class="btn btn-secondary btn-sm" on:click={() => playMovieFile({...file, videoUrl: file.localVideoUrl})}>
                            <Icon icon="mdi:play" class="w-4 h-4 mr-1" />
                            Play Local
                          </button>
                        {/if}
                        {#if !file.videoUrl && !file.localVideoUrl}
                          <div class="text-sm text-base-content/60">No video URLs available</div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              {:else}
                <div class="alert alert-info">
                  <Icon icon="mdi:information" class="w-5 h-5" />
                  <span>No video files available for this movie.</span>
                </div>
              {/if}
            </div>
          </div>
        {:else if mediaItem.type === 'series'}
          {#each getUniqueSeasons(episodes) as seasonNumber}
            <label class="tab">
              <input type="radio" name="media_tabs" checked={activeTab === `season-${seasonNumber}`} on:change={() => (activeTab = `season-${seasonNumber}`)} />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 me-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.5-3h15M7.5 4.5h9m-9 0a1.5 1.5 0 0 0-1.5 1.5v4.25h12V6a1.5 1.5 0 0 0-1.5-1.5h-9Zm9 0V3a.75.75 0 0 0-.75-.75h-7.5A.75.75 0 0 0 7.5 3v1.5" />
              </svg>
              Season {seasonNumber}
            </label>
            <div class="tab-content bg-base-100 border-base-300 p-6">
              <div class="space-y-4">
                <h2 class="text-2xl font-bold mb-4">Episodes for Season {seasonNumber}</h2>
                {#each filterEpisodesBySeason(seasonNumber) as episode, index (episode.id)}
                  <div class="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="season-{seasonNumber}-accordion" checked={index === 0} />
                    <div class="collapse-title text-lg font-medium">
                      Episode {episode.episodeNumber}: {episode.title}
                    </div>
                    <div class="collapse-content">
                      <div class="space-y-3">
                        <p class="text-base-content/80">{episode.description}</p>
                        <div class="flex flex-wrap gap-2">
                          <span class="badge badge-primary">{episode.audioLanguageFormat}</span>
                          <span class="badge badge-secondary">{episode.subtitlesInfo}</span>
                        </div>
                        <div class="flex gap-3 pt-2">
                          <button class="btn btn-primary btn-sm" on:click={() => playEpisode({...episode, videoUrl: episode.originalVideoUrl}, index)}>
                            <Icon icon="mdi:play" class="w-4 h-4 mr-1" />
                            Play OV
                          </button>
                          <button class="btn btn-secondary btn-sm" on:click={() => playEpisode({...episode, videoUrl: episode.localVideoUrl}, index)}>
                            <Icon icon="mdi:play" class="w-4 h-4 mr-1" />
                            Play Local
                          </button>
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

      <div class="py-6">
      </div>
    </div>
  {:else}
    <p>Media not found or an error occurred.</p>
  {/if}
</main>

<style>
  main {
    padding: 0;
  }
  
  .hero-container {
    height: 85vh;
    max-height: 95vh;
    overflow: hidden;
    position: relative;
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

  /* Mobile-specific styling for hero container */
  @media (max-width: 768px) {
    .hero-container2 {
      height: 50vh;
    }
  }

  .video-player-container {
    position: relative;
    width: 100%;
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