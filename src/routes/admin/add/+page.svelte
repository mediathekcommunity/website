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
  }

  interface MediaData {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    genre: string;
    release_date_year: string;
    cast_crew: string;
    channelId: string; // New field for channel selection
  }

  interface MediaPayload extends MediaData {
    type: string;
    videoFiles?: MovieFile[];
    episodes?: Episode[];
  }

  let mediaType: 'movie' | 'series' = 'movie';
  let mediaData: MediaData = {
    id: '',
    title: '',
    description: '',
    thumbnail_url: '',
    genre: '',
    release_date_year: '',
    cast_crew: '',
    channelId: '', // Initialize new field
  };
  let movieFiles: MovieFile[] = [{ videoUrl: '', localVideoUrl: '', quality: '', format: '', audioLanguageFormat: '', subtitlesInfo: '' }];
  let episodes: Episode[] = [{ seasonNumber: 1, episodeNumber: 1, title: '', description: '', originalVideoUrl: '', localVideoUrl: '', releaseDate: '', audioLanguageFormat: '', subtitlesInfo: '' }];

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
    episodes = [...episodes, { seasonNumber: 1, episodeNumber: 1, title: '', description: '', originalVideoUrl: '', localVideoUrl: '', releaseDate: '', audioLanguageFormat: '', subtitlesInfo: '' }];
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
</script>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column - General Info -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold mb-4">General Information</h2>
        
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
          <label for="channel" class="label">
            <span class="label-text">Channel:</span>
          </label>
          <select id="channel" bind:value={mediaData.channelId} class="select select-bordered w-full">
            <option value="">Select a Channel</option>
            {#each channels as channel}
              <option value={channel.id}>{channel.name} - {channel.country}</option>
            {/each}
          </select>
        </div>

        <div class="form-control">
          <label for="id" class="label">
            <span class="label-text">ID:</span>
          </label>
          <input type="text" id="id" bind:value={mediaData.id} required readonly class="input input-bordered w-full" />
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
          <label for="thumbnailUrl" class="label">
            <span class="label-text">Thumbnail URL:</span>
          </label>
          <input type="text" id="thumbnailUrl" bind:value={mediaData.thumbnail_url} class="input input-bordered w-full" />
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
                <button type="button" class="btn btn-error btn-sm" on:click={() => removeEpisode(i)}>Remove Episode</button>
              </div>
            </div>
          {/each}
          <button type="button" class="btn btn-secondary" on:click={addEpisode}>Add Another Episode</button>
        {/if}
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button type="submit" class="btn btn-primary btn-lg">Add Media</button>
    </div>
  </form>