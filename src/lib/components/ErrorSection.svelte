<script lang="ts">
	interface ErrorProps {
		error?: boolean;
		filter?: string;
		text1?: string;
	}

	let { error, filter, text1 } = $props<ErrorProps>();

	const errorMessage = $derived(
		error 
			? "We couldn't find any entries that match your search."
			: filter 
				? `We couldn't find any ${text1 || 'entries'} for "${filter}".`
				: "We couldn't find any entries that match your search."
	);
</script>

<div class="error-section" role="alert">
	<div class="error-content">
		<h1 class="error-title">404 Not Found</h1>
		<p class="error-description">{errorMessage}</p>
		<p class="error-suggestion">Try adjusting your search.</p>
		<a href="/" class="error-button">Back to Home</a>
	</div>
</div>

<style>
	.error-section {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
		padding: 2rem;
		contain: content;
	}

	.error-content {
		text-align: center;
		max-width: 600px;
		transform: translateZ(0);
		will-change: transform;
	}

	.error-title {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: bold;
		margin-bottom: 1rem;
		background: linear-gradient(to right, #ff4b2b, #ff416c);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.error-description {
		font-size: clamp(0.9rem, 2vw, 1.2rem);
		margin-bottom: 1rem;
		color: #ccc;
	}
 
	.error-suggestion {
		font-size: clamp(0.8rem, 1.5vw, 1rem);
		margin-bottom: 2rem;
		color: #999;
	}

	.error-button {
		display: inline-block;
		padding: clamp(8px, 2vw, 10px) clamp(16px, 3vw, 20px);
		font-size: clamp(0.9rem, 1.5vw, 1rem);
		font-weight: bold;
		text-decoration: none;
		color: #fff;
		background-color: #ff4b2b;
		border-radius: 5px;
		transition: transform 0.2s ease, background-color 0.3s ease;
	}

	.error-button:hover {
		background-color: #ff416c;
		transform: translateY(-2px);
	}
</style>
