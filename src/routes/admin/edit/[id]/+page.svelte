<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

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
    type: string; // Add type to MediaData for initial fetch
    moviesFiles?: MovieFile[]; // Corrected property name
    episodes?: Episode[];
    channelId: string; // New field for channel selection
  }

  interface MediaPayload extends MediaData {
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
    type: 'movie', // Default type
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
    const id = $page.params.id;
    const [mediaResponse, channelsResponse] = await Promise.all([
      fetch(`/api/media/${id}`),
      fetch('/api/channels')
    ]);

    const mediaDataFetched: MediaData = await mediaResponse.json();
    const channelsFetched: Channel[] = await channelsResponse.json();

    if (mediaDataFetched) {
      mediaData = { ...mediaDataFetched };
      mediaType = mediaDataFetched.type as 'movie' | 'series';
      if (mediaDataFetched.type === 'movie' && mediaDataFetched.moviesFiles) { // Corrected property name
        movieFiles = mediaDataFetched.moviesFiles;
      } else if (mediaDataFetched.type === 'series' && mediaDataFetched.episodes) {
        episodes = mediaDataFetched.episodes;
      }
    }

    if (channelsFetched) {
      channels = channelsFetched;
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

    try {
      // Only update the main media record (without files/episodes)
      const response = await fetch('/api/media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: mediaData.id,
          type: mediaType,
          title: mediaData.title,
          description: mediaData.description,
          thumbnail_url: mediaData.thumbnail_url,
          genre: mediaData.genre,
          release_date_year: mediaData.release_date_year,
          cast_crew: mediaData.cast_crew,
          channelId: mediaData.channelId,
        }),
      });

      if (response.ok) {
        alert('Media information updated successfully!');
        // Reload to show updated data
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to update media: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred during submission.');
    }
  }

  async function updateMovieFile(fileIndex) {
    const file = movieFiles[fileIndex];
    if (!file.id) {
      // New file - create it
      await addNewMovieFile(file);
      return;
    }

    try {
      const response = await fetch(`/api/movie-files/${file.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(file),
      });

      if (response.ok) {
        alert('Movie file updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update movie file: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating movie file:', error);
      alert('An unexpected error occurred.');
    }
  }

  async function addNewMovieFile(file) {
    try {
      const response = await fetch('/api/movie-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...file,
          movieId: mediaData.id,
        }),
      });

      if (response.ok) {
        const newFile = await response.json();
        // Update the file in the array with the returned ID
        const fileIndex = movieFiles.findIndex(f => f === file);
        if (fileIndex !== -1) {
          movieFiles[fileIndex] = newFile;
          movieFiles = [...movieFiles]; // Trigger reactivity
        }
        alert('Movie file added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add movie file: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding movie file:', error);
      alert('An unexpected error occurred.');
    }
  }

  async function deleteMovieFile(fileIndex) {
    const file = movieFiles[fileIndex];
    if (!file.id) {
      // Just remove from array if it's a new unsaved file
      removeMovieFile(fileIndex);
      return;
    }

    if (!confirm('Are you sure you want to delete this movie file?')) {
      return;
    }

    try {
      const response = await fetch(`/api/movie-files/${file.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        removeMovieFile(fileIndex);
        alert('Movie file deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete movie file: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting movie file:', error);
      alert('An unexpected error occurred.');
    }
  }

  async function updateEpisode(episodeIndex) {
    const episode = episodes[episodeIndex];
    if (!episode.id) {
      // New episode - create it
      await addNewEpisode(episode);
      return;
    }

    try {
      const response = await fetch(`/api/episodes/${episode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(episode),
      });

      if (response.ok) {
        alert('Episode updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update episode: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating episode:', error);
      alert('An unexpected error occurred.');
    }
  }

  async function addNewEpisode(episode) {
    try {
      const response = await fetch('/api/episodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...episode,
          seriesId: mediaData.id,
        }),
      });

      if (response.ok) {
        const newEpisode = await response.json();
        // Update the episode in the array with the returned ID
        const episodeIndex = episodes.findIndex(e => e === episode);
        if (episodeIndex !== -1) {
          episodes[episodeIndex] = newEpisode;
          episodes = [...episodes]; // Trigger reactivity
        }
        alert('Episode added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add episode: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding episode:', error);
      alert('An unexpected error occurred.');
    }
  }

  async function deleteEpisode(episodeIndex) {
    const episode = episodes[episodeIndex];
    if (!episode.id) {
      // Just remove from array if it's a new unsaved episode
      removeEpisode(episodeIndex);
      return;
    }

    if (!confirm('Are you sure you want to delete this episode?')) {
      return;
    }

    try {
      const response = await fetch(`/api/episodes/${episode.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        removeEpisode(episodeIndex);
        alert('Episode deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete episode: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting episode:', error);
      alert('An unexpected error occurred.');
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
          <select id="mediaType" bind:value={mediaType} disabled class="select select-bordered w-full">
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
          <input type="text" id="id" bind:value={mediaData.id} disabled class="input input-bordered w-full" />
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
                <div class="flex gap-2 mt-3">
                  <button type="button" class="btn btn-primary btn-sm" on:click={() => updateMovieFile(i)}>
                    {file.id ? 'Update' : 'Save'} File
                  </button>
                  <button type="button" class="btn btn-error btn-sm" on:click={() => deleteMovieFile(i)}>
                    {file.id ? 'Delete' : 'Remove'} File
                  </button>
                </div>
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
                <div class="flex gap-2 mt-3">
                  <button type="button" class="btn btn-primary btn-sm" on:click={() => updateEpisode(i)}>
                    {episode.id ? 'Update' : 'Save'} Episode
                  </button>
                  <button type="button" class="btn btn-error btn-sm" on:click={() => deleteEpisode(i)}>
                    {episode.id ? 'Delete' : 'Remove'} Episode
                  </button>
                </div>
              </div>
            </div>
          {/each}
          <button type="button" class="btn btn-secondary" on:click={addEpisode}>Add Another Episode</button>
        {/if}
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button type="submit" class="btn btn-primary btn-lg">Update General Info</button>
    </div>
  </form>