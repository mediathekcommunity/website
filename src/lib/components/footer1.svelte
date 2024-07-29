<script lang="ts">
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import IconHouse from 'lucide-svelte/icons/house';
	import IconClapperboard from 'lucide-svelte/icons/clapperboard';
	import IconTv from 'lucide-svelte/icons/tv';

	// You may optionally bind a selected state value
	// Pass the ID item you wish to be selected by default.
	let value = $state('0');
</script>

<!-- Component -->
<div class="sticky bottom-0 z-50 block w-screen border-surface-900/80 sm:hidden">
	<Nav.Bar bind:value onchange={console.log}>
		<Nav.Tile id="0" labelExpanded="Browse Files" href="/">
			<IconHouse />
		</Nav.Tile>
		<Nav.Tile id="1" labelExpanded="Browse Images" href="/movie">
			<IconClapperboard />
		</Nav.Tile>
		<Nav.Tile id="2" labelExpanded="Browse Music" href="/series">
			<IconTv />
		</Nav.Tile>
	</Nav.Bar>
</div>
