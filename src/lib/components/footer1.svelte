<script lang="ts">
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import IconFolder from 'lucide-svelte/icons/folder';
	import IconImage from 'lucide-svelte/icons/image';
	import IconMusic from 'lucide-svelte/icons/music';
	import IconVideo from 'lucide-svelte/icons/video';

	// You may optionally bind a selected state value
	// Pass the ID item you wish to be selected by default.
	let value = $state('0');
</script>

<!-- Component -->
<div class="w-screen bottom-0 sticky z-50 border-surface-900/80 block sm:hidden" >

<Nav.Bar bind:value onchange={console.log}>
	<Nav.Tile id="0">
		<IconFolder />
	</Nav.Tile>
	<Nav.Tile id="1">
		<IconImage />
	</Nav.Tile>
	<Nav.Tile id="2">
		<IconMusic />
	</Nav.Tile>
	<Nav.Tile id="3">
		<IconVideo />
	</Nav.Tile>
</Nav.Bar>

</div>