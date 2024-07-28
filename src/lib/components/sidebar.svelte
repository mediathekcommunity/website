<script lang="ts">
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import { nav1 } from '$lib/store.js';

	// Icons
	import IconHouse from 'lucide-svelte/icons/house';
	import IconClapperboard from 'lucide-svelte/icons/clapperboard';
	import IconTv from 'lucide-svelte/icons/tv';
	let hrefExample = '#';
  	let isHovered = false;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sticky hidden h-[calc(100vh-1rem)] w-full border-[1px] border-surface-900/80 sm:block">
	<Nav.Rail  value={$nav1} background="bg-surface-900/80">
		{#snippet tiles()}
			<Nav.Tile id="0" labelExpanded="Browse Files" href="/">
				<IconHouse />
			</Nav.Tile>
			<Nav.Tile id="1" labelExpanded="Browse Images" href="/movie">
				<IconClapperboard />
			</Nav.Tile>
			<Nav.Tile id="2" labelExpanded="Browse Music" href="/series">
				<IconTv />
			</Nav.Tile>
			<!-- Add more tiles as needed
			<Nav.Tile id="3" labelExpanded="Browse Videos" href={hrefExample}>
				<IconVideo />
			</Nav.Tile>
			<Nav.Tile id="4" labelExpanded="Browse Games" href={hrefExample}>
				<IconGames />
			</Nav.Tile> -->
		{/snippet}
	</Nav.Rail>
</div>
