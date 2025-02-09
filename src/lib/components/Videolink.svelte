<script lang="ts">
	import '../videojs/skins/gold1/videojs.min.css';
	import Icon from '@iconify/svelte';

	export let posterUrl: string;
	export let videoUrl: string;
	export let channel: object;
	export let videotitle: string;
	/*
	console.log(videotitle);
	console.log(channel);
	console.log(videoUrl);
	*/
</script>

<div class="video-player-container" style="background-image: url({posterUrl});">
	<div class="video-placeholder">
		<div class="content grid">
			<div style="  display: inline-block;">
				To watch {videotitle} you need to go to the homepage of
				{channel.name}
			</div>
			<button
				type="button"
				class="btn btn-accent"
				onclick={() => (window.location.href = videoUrl)}
			>
				Go to {channel.name} & watch {videotitle}
			</button>
		</div>
	</div>
</div>

<style>
	.video-player-container {
		position: relative;
		width: 100%;
		height: 100%;
		max-width: 1200px;
		margin: 0 auto 2rem;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		overflow: hidden;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.video-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(20, 20, 20, 0.9);
		padding: 20px;
	}

	.content {
		text-align: center;
		color: white;
		font-size: 24px;
	}

	.content div {
		margin-bottom: 10px; /* Add some spacing between lines */
	}
</style>
