<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  interface MovieFile {
    videoUrl: string;
    localVideoUrl: string;
    quality: string;
    format: string;
    audioLanguageFormat: string;
    subtitlesInfo: string;
  }

  interface Episode {
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    description: string;
    originalVideoUrl: string;
    localVideoUrl: string;
    releaseDate: string;
    audioLanguageFormat: string;
    subtitlesInfo: string;
    tmdbid: string; // New field for TMDB Episode ID
  }

  interface MediaData {
    id: string;
    title: string;
    description: string;
    backdrop_url: string;
    poster_url: string;
    genre: string;
    release_date_year: string;
    cast_crew: string;
    channelId: string; // New field for channel selection
    tmdbid: string; // New field for TMDB ID
  }

  interface MediaPayload extends MediaData {
    type: string;
    videoFiles?: MovieFile[];
    episodes?: Episode[];
  }

  let mediaType: 'movie' | 'series' | 'y-movie' | 'y-series' = 'movie';
  let mediaData: MediaData = {
    id: '',
    title: '',
    description: '',
    backdrop_url: '',
    poster_url: '',
    genre: '',
    release_date_year: '',
    cast_crew: '',
    channelId: '', // Initialize new field
    tmdbid: '', // Initialize new field
  };
  let movieFiles: MovieFile[] = [{ videoUrl: '', localVideoUrl: '', quality: '', format: '', audioLanguageFormat: '', subtitlesInfo: '' }];
  let episodes: Episode[] = [{ seasonNumber: 1, episodeNumber: 1, title: '', description: '', originalVideoUrl: '', localVideoUrl: '', releaseDate: '', audioLanguageFormat: '', subtitlesInfo: '', tmdbid: '' }];

  interface Channel {
    id: string;
    name: string;
    title: string;
    poster: string;
    icon: string;
    country: string;
  }

  let channels: Channel[] = [];

  onMount(async () => {
    try {
      const response = await fetch('/api/channels');
      if (response.ok) {
        channels = await response.json();
      } else {
        console.error('Failed to fetch channels:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  });

  function addMovieFile() {
    movieFiles = [...movieFiles, { videoUrl: '', localVideoUrl: '', quality: '', format: '', audioLanguageFormat: '', subtitlesInfo: '' }];
  }

  function removeMovieFile(index: number) {
    movieFiles = movieFiles.filter((_, i) => i !== index);
  }

  function addEpisode() {
    episodes = [...episodes, { seasonNumber: 1, episodeNumber: 1, title: '', description: '', originalVideoUrl: '', localVideoUrl: '', releaseDate: '', audioLanguageFormat: '', subtitlesInfo: '', tmdbid: '' }];
  }

  function removeEpisode(index: number) {
    episodes = episodes.filter((_, i) => i !== index);
  }

  async function handleSubmit() {
    // Basic validation
    if (!mediaData.title || !mediaData.id) {
      alert('Title and ID are required!');
      return;
    }

    const payload: MediaPayload = {
      ...mediaData,
      type: mediaType,
    };

    if (mediaType === 'movie') {
      payload.videoFiles = movieFiles;
      if (movieFiles.some(file => !file.videoUrl)) {
        alert('All movie files must have a video URL!');
        return;
      }
    } else if (mediaType === 'series') {
      payload.episodes = episodes;
      if (episodes.some(episode => !episode.title || !episode.originalVideoUrl)) {
        alert('All episodes must have a title and original video URL!');
        return;
      }
    }

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Media added successfully!');
        goto('/admin');
      } else {
        const errorData = await response.json();
        alert(`Failed to add media: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred during submission.');
    }
  }

  async function fetchTMDBData() {
    try {
      const url = mediaType === "movie" || mediaType === "y-movie" 
        ? `https://api3.mediathek.community/movie/${mediaData.tmdbid}` 
        : `https://api3.mediathek.community/tv/${mediaData.tmdbid}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Map fetched data to general information
      mediaData.title = data.title;
      mediaData.description = data.overview;
      mediaData.backdrop_url = data.backdrop_path;
      mediaData.poster_url = data.poster_path;
      mediaData.genre = data.genres.map(genre => genre.name).join(", ");
      mediaData.release_date_year = data.release_date.split("-")[0];
      mediaData.cast_crew = data.credits.cast.map(cast => `${cast.name} (${cast.character})`).join(", ");
      mediaData.tmdbid = data.id;

      fetchedData = "Data successfully mapped to general information.";
    } catch (error) {
      console.error("Error fetching TMDB data:", error);
      fetchedData = "Failed to fetch data.";
    }
  }

  function mapEpisodeData(data) {
    return {
      seriesId: data.show_id.toString(),
      seasonNumber: data.season,
      episodeNumber: data.episode,
      title: data.name,
      description: data.overview,
      originalVideoUrl: null,
      localVideoUrl: null,
      releaseDate: data.air_date,
      audioLanguageFormat: null,
      subtitlesInfo: null,
      tmdbid: data.id.toString(),
    };
  }

  async function fetchEpisodeData(tmdbid, season, episode) {
    try {
      const url = `https://api3.mediathek.community/episode/${tmdbid}/${season}/${episode}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      fetchedEpisodeData = JSON.stringify(data, null, 2); // Format JSON for display
    } catch (error) {
      console.error("Error fetching episode data:", error);
      fetchedEpisodeData = "Failed to fetch episode data.";
    }
  }

  let fetchedData = ""; // Only visible after fetch
  let fetchedEpisodeData = "";
</script>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column - General Info -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold mb-4">General Information</h2>
        
        <div class="form-control">
          <label for="id" class="label">
            <span class="label-text">ID:</span>
          </label>
          <input type="text" id="id" bind:value={mediaData.id} disabled class="input input-bordered w-full" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-control">
            <label for="mediaType" class="label">
              <span class="label-text">Media Type:</span>
            </label>
            <select id="mediaType" bind:value={mediaType} class="select select-bordered w-full">
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
          </div>

          <div class="form-control">
            <label for="tmdbid" class="label">
              <span class="label-text">TMDB ID:</span>
            </label>
            <div class="flex items-center gap-2">
              <input type="text" id="tmdbid" bind:value={mediaData.tmdbid} class="input input-bordered w-full" on:input={(e) => mediaData.tmdbid = e.target.value.replace(/\D/g, '')} />
              <button type="button" class="btn btn-primary" on:click={fetchTMDBData}>Fetch</button>
            </div>
          </div>
        </div>

        <div class="form-control">
          <label for="title" class="label">
            <span class="label-text">Title:</span>
          </label>
          <input type="text" id="title" bind:value={mediaData.title} required class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label for="description" class="label">
            <span class="label-text">Description:</span>
          </label>
          <textarea id="description" bind:value={mediaData.description} class="textarea textarea-bordered w-full h-24"></textarea>
        </div>

        <div class="form-control">
          <label for="backdropUrl" class="label">
            <span class="label-text">Backdrop URL:</span>
          </label>
          <input type="text" id="backdropUrl" bind:value={mediaData.backdrop_url} class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label for="posterUrl" class="label">
            <span class="label-text">Poster URL:</span>
          </label>
          <input type="text" id="posterUrl" bind:value={mediaData.poster_url} class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label for="genre" class="label">
            <span class="label-text">Genre:</span>
          </label>
          <input type="text" id="genre" bind:value={mediaData.genre} class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label for="releaseDateYear" class="label">
            <span class="label-text">Release Date Year:</span>
          </label>
          <input type="text" id="releaseDateYear" bind:value={mediaData.release_date_year} class="input input-bordered w-full" />
        </div>

        <div class="form-control">
          <label for="castCrew" class="label">
            <span class="label-text">Cast & Crew:</span>
          </label>
          <input type="text" id="castCrew" bind:value={mediaData.cast_crew} class="input input-bordered w-full" />
        </div>

      </div>

      <!-- Right Column - Movie/Series Content -->
      <div class="space-y-4">
        {#if mediaType === 'movie'}
          <h2 class="text-2xl font-bold mb-4">Movie Files</h2>
          {#each movieFiles as file, i}
            <div class="card bg-base-200 shadow-xl p-4 mb-4">
              <h3 class="text-lg font-medium mb-2">File {i + 1}</h3>
              <div class="space-y-3">
                <div class="form-control">
                  <label for="movieVideoUrl-{i}" class="label">
                    <span class="label-text">Video URL:</span>
                  </label>
                  <input type="text" id="movieVideoUrl-{i}" bind:value={file.videoUrl} required class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="movieLocalVideoUrl-{i}" class="label">
                    <span class="label-text">Local Video URL:</span>
                  </label>
                  <input type="text" id="movieLocalVideoUrl-{i}" bind:value={file.localVideoUrl} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="movieQuality-{i}" class="label">
                    <span class="label-text">Quality:</span>
                  </label>
                  <input type="text" id="movieQuality-{i}" bind:value={file.quality} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="movieFormat-{i}" class="label">
                    <span class="label-text">Format:</span>
                  </label>
                  <input type="text" id="movieFormat-{i}" bind:value={file.format} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="movieAudioLang-{i}" class="label">
                    <span class="label-text">Audio Language Format:</span>
                  </label>
                  <input type="text" id="movieAudioLang-{i}" bind:value={file.audioLanguageFormat} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="movieSubtitles-{i}" class="label">
                    <span class="label-text">Subtitles Info:</span>
                  </label>
                  <input type="text" id="movieSubtitles-{i}" bind:value={file.subtitlesInfo} class="input input-bordered w-full" />
                </div>
                <button type="button" class="btn btn-error btn-sm" on:click={() => removeMovieFile(i)}>Remove File</button>
              </div>
            </div>
          {/each}
          <button type="button" class="btn btn-secondary" on:click={addMovieFile}>Add Another Movie File</button>
        {:else if mediaType === 'series'}
          <h2 class="text-2xl font-bold mb-4">Episodes</h2>
          {#each episodes as episode, i}
            <div class="card bg-base-200 shadow-xl p-4 mb-4">
              <h3 class="text-lg font-medium mb-2">Episode {i + 1}</h3>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <div class="form-control">
                    <label for="episodeSeason-{i}" class="label">
                      <span class="label-text">Season Number:</span>
                    </label>
                    <input type="number" id="episodeSeason-{i}" bind:value={episode.seasonNumber} class="input input-bordered w-full" />
                  </div>
                  <div class="form-control">
                    <label for="episodeNumber-{i}" class="label">
                      <span class="label-text">Episode Number:</span>
                    </label>
                    <input type="number" id="episodeNumber-{i}" bind:value={episode.episodeNumber} class="input input-bordered w-full" />
                  </div>
                </div>
                <div class="form-control">
                  <label for="episodeTitle-{i}" class="label">
                    <span class="label-text">Title:</span>
                  </label>
                  <input type="text" id="episodeTitle-{i}" bind:value={episode.title} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="episodeDescription-{i}" class="label">
                    <span class="label-text">Description:</span>
                  </label>
                  <textarea id="episodeDescription-{i}" bind:value={episode.description} class="textarea textarea-bordered w-full h-20"></textarea>
                </div>
                <div class="form-control">
                  <label for="episodeOriginalUrl-{i}" class="label">
                    <span class="label-text">Original Video URL:</span>
                  </label>
                  <input type="text" id="episodeOriginalUrl-{i}" bind:value={episode.originalVideoUrl} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="episodeLocalUrl-{i}" class="label">
                    <span class="label-text">Local Video URL:</span>
                  </label>
                  <input type="text" id="episodeLocalUrl-{i}" bind:value={episode.localVideoUrl} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="episodeReleaseDate-{i}" class="label">
                    <span class="label-text">Release Date:</span>
                  </label>
                  <input type="text" id="episodeReleaseDate-{i}" bind:value={episode.releaseDate} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="episodeAudioLang-{i}" class="label">
                    <span class="label-text">Audio Language Format:</span>
                  </label>
                  <input type="text" id="episodeAudioLang-{i}" bind:value={episode.audioLanguageFormat} class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label for="episodeSubtitles-{i}" class="label">
                    <span class="label-text">Subtitles Info:</span>
                  </label>
                  <input type="text" id="episodeSubtitles-{i}" bind:value={episode.subtitlesInfo} class="input input-bordered w-full" />
                </div>
                <div class="form-control flex flex-row items-center gap-2">
                  <label for="episodeTmdbId-{i}" class="label">
                    <span class="label-text">TMDB Episode ID:</span>
                  </label>
                  <input type="text" id="episodeTmdbId-{i}" bind:value={episode.tmdbid} class="input input-bordered w-1/2" />
                  <button type="button" class="btn btn-primary" on:click={() => fetchEpisodeData(episode.tmdbid, episode.seasonNumber, episode.episodeNumber)}>Fetch</button>
                </div>
                <button type="button" class="btn btn-error btn-sm" on:click={() => removeEpisode(i)}>Remove Episode</button>
              </div>
            </div>
          {/each}
          <button type="button" class="btn btn-secondary" on:click={addEpisode}>Add Another Episode</button>
        {/if}
      </div>
    </div>

    {#if fetchedData}
      <div class="form-control">
        <label for="fetchedData" class="label">
          <span class="label-text">Fetched Data:</span>
        </label>
        <textarea id="fetchedData" readonly class="textarea textarea-bordered w-full h-24">{fetchedData}</textarea>
      </div>
    {/if}

    {#if fetchedEpisodeData}
      <div class="form-control">
        <label for="fetchedEpisodeData" class="label">
          <span class="label-text">Fetched Episode Data:</span>
        </label>
        <textarea id="fetchedEpisodeData" readonly class="textarea textarea-bordered w-full h-24">{fetchedEpisodeData}</textarea>
      </div>
    {/if}

    <div class="flex justify-center mt-8">
      <button type="submit" class="btn btn-primary btn-lg">Add Media</button>
    </div>
  </form>