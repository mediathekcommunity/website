<script lang="ts">
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import { page } from '$app/stores';

	// Extract error details from the page store
	$: error = $page.error;
	$: status = $page.status;
	$: isDev = import.meta.env.DEV;
</script>

<ErrorBoundary message={error?.message} {status} stack={error?.stack} dev={isDev} />
