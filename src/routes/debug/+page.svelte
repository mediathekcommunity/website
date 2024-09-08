<script>
	// @ts-nocheck

	let url;
	let data1 = $state();
	let text = $state('');

	let data = $state();
	async function getdata(url) {
		var response = await fetch('/debug/url?url1=' + url);
		response = await response.json();
		data1 = response;
	}
	$effect(() => {
		console.log('count', data1);
		console.log('text', text);
	});
</script>

<div>
	<input type="text" autocomplete="off" bind:value={text} placeholder="Enter a URL" />
	<button aria-label="Mark as complete" onclick={() => getdata(text)}> Fetch Data </button><br />
	{#if data1}
		{#each data1.formats as item, index}
			{#if item.protocol == 'm3u8_native' && item.resolution !="audio only"}
				<div>{index + 1}.</div>
				{item.url}<br />
				{item.language}<br />
				{item.resolution}<br />
				{item.format}<br />
				<br />
			{/if}
		{/each}
	{/if}
</div>
