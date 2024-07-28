<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { visible } from '$lib/store.js';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
</script>

<AppBar>
	{#snippet lead()}
		<div class="block sm:hidden"></div>
	{/snippet}
	<span>Mediathek Community</span>
	{#snippet trail()}Debug: disable Countryfilter &nbsp; 

		<Switch id="example" name="example" bind:checked={$visible} onchange={console.log}></Switch>
	{/snippet}
</AppBar>
