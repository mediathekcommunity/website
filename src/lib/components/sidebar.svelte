<script lang="ts">
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import { nav1 } from '$lib/store.js';
	// Icons
	import IconHouse from 'lucide-svelte/icons/house';
	import IconClapperboard from 'lucide-svelte/icons/clapperboard';
	import IconTv from 'lucide-svelte/icons/tv';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sticky hidden h-[calc(100vh-1rem)] w-full border-[1px] border-surface-900/80 sm:block">
	<Nav.Rail  value="nothing" background="bg-surface-900/80">
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
		{/snippet}
	</Nav.Rail>
</div>
