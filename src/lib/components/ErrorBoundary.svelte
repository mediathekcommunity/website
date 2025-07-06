<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		message?: string;
		status?: number;
		stack?: string;
		dev?: boolean;
	}

	let {
		message = 'An unexpected error occurred',
		status = 500,
		stack = '',
		dev = false
	} = $props<Props>();

	const errorMessages = {
		404: 'Page not found',
		500: 'Internal server error',
		503: 'Service temporarily unavailable'
	};

	const getErrorMessage = (status: number): string => {
		return errorMessages[status as keyof typeof errorMessages] || message;
	};

	function handleRetry() {
		window.location.reload();
	}

	function handleBack() {
		window.history.back();
	}
</script>

<div class="error-boundary" role="alert" aria-live="polite">
	<div class="error-content">
		<div class="error-icon">
			<Icon
				icon={status === 404 ? 'lucide:file-question' : 'lucide:alert-triangle'}
				width="48"
				height="48"
			/>
		</div>

		<h1 class="error-title">{status}</h1>
		<p class="error-description">{getErrorMessage(status)}</p>

		<div class="error-actions">
			<button class="action-button primary" onclick={handleBack} type="button">
				<Icon icon="lucide:arrow-left" />
				Go Back
			</button>
			<button class="action-button secondary" onclick={handleRetry} type="button">
				<Icon icon="lucide:refresh-cw" />
				Try Again
			</button>
		</div>

		{#if dev && stack}
			<details class="error-details">
				<summary>Technical Details</summary>
				<pre class="error-stack">{stack}</pre>
			</details>
		{/if}
	</div>
</div>

<style>
	.error-boundary {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
		color: white;
		text-align: center;
	}

	.error-content {
		max-width: 600px;
		padding: 2rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		contain: content;
	}

	.error-icon {
		color: #ff4b2b;
		margin-bottom: 1rem;
	}

	.error-title {
		font-size: clamp(3rem, 10vw, 4rem);
		font-weight: bold;
		margin-bottom: 1rem;
		background: linear-gradient(to right, #ff4b2b, #ff416c);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.error-description {
		font-size: clamp(1rem, 3vw, 1.25rem);
		color: #ccc;
		margin-bottom: 2rem;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.action-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-weight: 500;
		transition: transform 0.2s ease;
		border: none;
		cursor: pointer;
	}

	.action-button:hover {
		transform: translateY(-2px);
	}

	.primary {
		background: linear-gradient(to right, #ff4b2b, #ff416c);
		color: white;
	}

	.secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.error-details {
		text-align: left;
		margin-top: 2rem;
	}

	.error-details summary {
		cursor: pointer;
		color: #999;
		padding: 0.5rem 0;
	}

	.error-stack {
		margin-top: 1rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.875rem;
		white-space: pre-wrap;
		color: #ff416c;
		overflow-x: auto;
	}

	@media (max-width: 640px) {
		.error-actions {
			flex-direction: column;
		}

		.action-button {
			width: 100%;
			justify-content: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action-button {
			transition: none;
		}
	}
</style>
