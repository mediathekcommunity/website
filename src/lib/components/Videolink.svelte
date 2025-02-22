<script lang="ts">
	import '../videojs/skins/gold1/videojs.min.css';
	import Icon from '@iconify/svelte';

	interface Channel {
		name: string;
	}

	let { posterUrl, videoUrl, channel, videotitle } = $props<{
		posterUrl: string;
		videoUrl: string;
		channel: Channel;
		videotitle: string;
	}>();

	function navigateToVideo() {
		window.location.href = videoUrl;
	}
</script>

<div 
	class="video-player-container" 
	style:background-image="url({posterUrl})"
>
	<div class="video-placeholder">
		<div class="content">
			<div>
				To watch {videotitle} you need to go to the homepage of {channel.name}
			</div>
			<button
				type="button"
				class="btn btn-accent"
				onclick={navigateToVideo}
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
		transform: translateZ(0);
		will-change: transform;
		contain: content;
	}

	.video-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(20, 20, 20, 0.9);
		padding: 20px;
		backdrop-filter: blur(8px);
	}

	.content {
		text-align: center;
		color: white;
		font-size: clamp(1rem, 2vw, 1.5rem);
		display: grid;
		gap: 1rem;
	}

	.btn {
		font-size: clamp(0.875rem, 1.5vw, 1rem);
		transition: transform 0.2s ease;
	}

	.btn:hover {
		transform: translateY(-2px);
	}

	@media (max-width: 640px) {
		.video-player-container {
			margin: 0 auto 1rem;
		}

		.video-placeholder {
			padding: 1rem;
		}
	}
</style>
