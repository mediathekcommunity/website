<script>
	export let filter, text1,error;

</script>

<div class="error-section">
	<div class="error-content">
		<h1 class="error-title">404 Not Found</h1>
		<p class="error-description">
			{error ? "":"We couldn't find any entries that match your search."}
		</p>
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
	}

	.error-content {
		text-align: center;
		max-width: 600px;
	}

	.error-title {
		font-size: 3rem;
		font-weight: bold;
		margin-bottom: 1rem;
		background: linear-gradient(to right, #ff4b2b, #ff416c);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.error-description {
		font-size: 1.2rem;
		margin-bottom: 1rem;
		color: #ccc;
	}

	.error-filter {
		font-weight: bold;
		color: #fff;
	}

	.error-suggestion {
		font-size: 1rem;
		margin-bottom: 2rem;
		color: #999;
	}

	.error-button {
		display: inline-block;
		padding: 10px 20px;
		font-size: 1rem;
		font-weight: bold;
		text-decoration: none;
		color: #fff;
		background-color: #ff4b2b;
		border-radius: 5px;
		transition: background-color 0.3s ease;
	}

	.error-button:hover {
		background-color: #ff416c;
	}

	@media (max-width: 768px) {
		.error-title {
			font-size: 2.5rem;
		}

		.error-description {
			font-size: 1rem;
		}

		.error-suggestion {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.error-title {
			font-size: 2rem;
		}

		.error-description {
			font-size: 0.9rem;
		}

		.error-suggestion {
			font-size: 0.8rem;
		}

		.error-button {
			font-size: 0.9rem;
			padding: 8px 16px;
		}
	}
</style>
