<script>
	// @ts-nocheck

	let url;
	let data1 = $state();
	let text = $state('');
	import 'media-chrome';
	import 'media-chrome/media-theme-element';
	import 'media-chrome/menu';

	let data = $state();
	async function getdata(url) {
		var response = await fetch('/debug/url?url1=' + url);
		response = await response.json();
		data1 = response;
		//console.log('data1', data1);
	}
	$effect(() => {
		//console.log('count', data1);
		//console.log('text', text);
	});
	function next() {
		//console.log('next');
		document.querySelector('media-playlist').next();
	}
	function previous() {
		//console.log('previous');
		document.querySelector('media-playlist').previous();
	}
</script>

<div>
	<input type="text" autocomplete="off" bind:value={text} placeholder="Enter a URL" />
	<button aria-label="Mark as complete" onclick={() => getdata(text)}> Fetch Data </button><br />

	{#if data1}
		<table>
			<thead>
				<tr>
					<th>item.index</th>
					<th>item.manifest_url</th>
					<th>item.language</th>
					<th>item.resolution</th>
					<th>item.format</th>
				</tr>
			</thead>
		<tbody>
		{#each data1.formats as item, index}
			{#if item.protocol == 'm3u8_native' && item.resolution != 'audio only'}
				<tr>
					<td>{index + 1}.</td>
 					<td style="word-wrap: break-word">{item.manifest_url}</td>
					<td>{item.language}</td>
					<td>{item.resolution}</td>
					<td>{item.format}</td>
				</tr>
			{/if}
		{/each}
	</tbody>
	</table>
	{/if}
</div>

<style>
	media-controller:not([audio]) {
		display: block; /* expands the container if preload=none */
		max-width: 1000px; /* allows the container to shrink if small */
		aspect-ratio: 16 / 9; /* set container aspect ratio if preload=none */
	}

	.examples {
		margin-top: 20px;
	}
</style>
