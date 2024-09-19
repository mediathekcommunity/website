<script>
	// @ts-nocheck
	let { data } = $props();
	let data1 = $state();
	let channelinfo = $state();
	let omu = {};
	let noomu = {};
	//import { TabGroup, Tab, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	//import { TabGroup, Tab, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import * as Flag from 'svelte-flag-icons';

	import LibraryBig from 'lucide-svelte/icons/library-big';
	import Film from 'lucide-svelte/icons/film';
	import Tv from 'lucide-svelte/icons/tv';
	import Videoplayer from '$lib/components/Videoplayer.svelte';
	import { modalvideo, omulist, noomulist, seriestype } from '$lib/store.js';
	let myPlaylist = [];
	let myPlaylistomu = [];
	let group = $state('details');
	let value = $state('0');

	function sortepisodes(data2) {
		if (data2.episodes.length > 0) {
			//console.log(data2.episodelist);
		}
	}

	let showvideo = $state(false);
	$effect(() => {
		data1 = data.page;
	});
	$effect(() => {
		channelinfo = data.page.channel;
	});
	$effect(() => {
		sortepisodes(data1);
	});

	let tabSet = 0;

	function playvideo() {
		seriestype.set('');
		let poster1 = data1.backdrop
			? `https://img.mediathek.rocks/t/p/original/${data1.backdrop}`
			: `https://img2.mediathek.rocks/assets/${data1.heroimage}`;

		showvideo = true;
		modalvideo.set({
			src: data1.streamlink,
			type: data1.format,
			poster: poster1,
			title: data1.title
		});
	}

	function playepisode(alldata, type) {
		myPlaylist = [];
		myPlaylistomu = [];
		seriestype.set(type);

		data1.episodes.forEach((episode) => {
			let sources = [];
			if (episode.streamlink) {
				sources.push({
					src: episode.streamlink,
					type: episode.format,
					default: true
				});
			}

			let poster12 = data1.backdrop
				? `https://img.mediathek.rocks/t/p/original/${data1.backdrop}`
				: `https://img2.mediathek.rocks/assets/${data1.heroimage}`;

			if (!episode.omu) {
				myPlaylist.push({
					title: episode.title,
					infoTitle: episode.title,
					poster: poster12,
					thumb: poster12,
					sources: sources
				});
			} else {
				if (episode.directlinklq) {
					sources.push({
						src: episode.directlinklq,
						type: episode.format,
						res: '360',
						label: '360p'
					});
				}
				myPlaylistomu.push({
					title: `omu${episode.title}`,
					infoTitle: episode.title,
					poster: `https://img.mediathek.corocksmunity/t/p/original/${data1.backdrop}`,
					sources: sources
				});
			}
		});
		//console.log(myPlaylist);
		//console.log(omulist);
		noomulist.set(myPlaylist);
		omulist.set(myPlaylistomu);
		showvideo = true;
	}
</script>

{#if data1}
	<div class="pb-4">
		{#if channelinfo.info}
			<aside class="alert variant-ghost-error">
				<div class="alert-message">
					<h3 class="h3">{channelinfo.name}</h3>
					<p>{channelinfo.info}</p>
				</div>
			</aside>
		{/if}
		{#if !showvideo}
			{#if data1.backdrop != 'backdrop' && data1.backdrop}
				<img
					class="relative mx-auto aspect-video max-h-[624px] rounded-lg"
					src="https://img.mediathek.rocks/t/p/original{data1.backdrop}"
					alt="description"
				/>
			{:else}
				<img
					class="relative mx-auto aspect-video max-h-[624px] rounded-lg"
					src="https://api.mediathek.rocks/assets/{data1.heroimage}.jpg"
					alt="description"
				/>
			{/if}
		{:else}
			<div class="relative mx-auto aspect-video max-h-[624px] rounded-lg">
				<svelte:component this={Videoplayer} />
			</div>
		{/if}
	</div>

	<Tabs bind:value={group} listJustify="justify-center">
		{#snippet list()}
			<Tabs.Control value="details" title="Details">
				Details
			</Tabs.Control>
			{#if data1.type == 'movie'}
				<Tabs.Control value="links" title="Links">
					Links
				</Tabs.Control>
			{:else}
				<Tabs.Control value="episodes" title="Episoden">
					Episoden
				</Tabs.Control>
			{/if}
		{/snippet}
		{#snippet content()}
			<Tabs.Panel value="details">
				<div class="shadow-md sm:rounded-lg">
					<table class="w-full table-auto text-left text-sm text-gray-500 dark:text-gray-400">
						<tbody>
							<tr class="w-full border-b dark:border-gray-700">
								<th
									scope="row"
									class="w-full whitespace-nowrap px-6 py-4 font-medium text-gray-900 lg:w-1/4 dark:text-white"
								>
									Land
								</th>
								<td class="px-6 py-4">
									<svelte:component
										this={Flag[data1.country]}
										class="mr-1 inline-flex place-self-center"
										size="25"
									/>
								</td>
							</tr>
							<tr class="border-b dark:border-gray-700">
								<th
									scope="row"
									class="w-full whitespace-nowrap px-6 py-4 font-medium text-gray-900 lg:w-1/4 dark:text-white"
								>
									Sender
								</th>
								<td class="px-6 py-4">
									{data1.channel.name}
								</td>
							</tr>
							<tr class="border-b dark:border-gray-700">
								<th
									scope="row"
									class="w-full whitespace-nowrap px-6 py-4 font-medium text-gray-900 lg:w-1/4 dark:text-white"
								>
									Qualität
								</th>
								<td class="px-6 py-4">
									{data1.quality}
								</td>
							</tr>
							{#if data1.episodes.length > 0}
								<tr class="border-b dark:border-gray-700">
									<th
										scope="row"
										class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
									>
										Staffeln
									</th>
									<td class="px-6 py-4">
										{data1.episodes.length || 1}
									</td>
								</tr>
								<tr class="border-b dark:border-gray-700">
									<th
										scope="row"
										class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
									>
										Folgen
									</th>
									<td class="px-6 py-4">
										{data1.episodes.length}
									</td>
								</tr>
							{/if}
							<tr class="border-b dark:border-gray-700">
								<th
									scope="row"
									class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
								>
									Description
								</th>
								<td class="px-6 py-4">
									{data1.overview}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Tabs.Panel>

			<Tabs.Panel value="links">
				<div class="flex justify-center">
					<button type="button" class="btn preset-filled-primary-500" onclick={playvideo}
						>play</button
					>
				</div>
			</Tabs.Panel>

			<Tabs.Panel value="episodes">
				<Accordion {value}>
					{#each data1.episodes as episode, index (episode.id)}
						<Accordion.Item id={index.toString()}>
							{#snippet controlLead()}
								E: {episode.episode} - {episode.title}
							{/snippet}
							{#snippet panel()}
								<div class="grid grid-cols-4 grid-rows-1 gap-0">
									<div class="col-span-3">{episode.overview}</div>
									<div class="col-span-1 flex items-center justify-center">
										<button
											type="button"
											class="btn preset-filled-primary-500"
											onclick={() => playepisode(episode, 'noomu')}>Play</button
										>
									</div>
								</div>{/snippet}
						</Accordion.Item>
					{/each}
				</Accordion>
			</Tabs.Panel>
		{/snippet}
	</Tabs>
	<!-- 
	<TabGroup justify="justify-center">
		<Tab bind:group={tabSet} name="tab1" value={0}>
			<span>Details</span>
		</Tab>
		{#if data1.mediatype == 'movie'}
			<Tab bind:group={tabSet} name="tab2" value={1}>Links</Tab>
		{:else}
			<Tab bind:group={tabSet} name="tab3" value={2}>Episoden</Tab>
		{/if}
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
	 
			{:else if tabSet === 1}
 
			{:else if tabSet === 2}
				<Accordion>
					{#each data1.episodes as episode, index (episode.id)}
						{#if !episode.omu}
							<AccordionItem>
								<svelte:fragment slot="summary"
									>E: {episode.episode} - {episode.title}</svelte:fragment
								>
								<svelte:fragment slot="content">
									<div class="grid grid-cols-4 grid-rows-1 gap-0">
										<div class="col-span-3">{episode.overview}</div>
										<div class="col-span-1 flex items-center justify-center">
											<button
												type="button"
												class="variant-filled btn"
												on:click={() => playepisode(episode, 'noomu')}>Play</button
											>
										</div>
									</div>
								</svelte:fragment>
							</AccordionItem>
						{/if}
					{/each}
				</Accordion>
			{:else if tabSet === 3}
				<Accordion>
					{#each data1.episodes as episode, index}
						{#if episode.omu}
							<AccordionItem>
								<svelte:fragment slot="summary"
									>E: {episode.episode} - {episode.title}</svelte:fragment
								>
								<svelte:fragment slot="content">
									<div class="grid grid-cols-4 grid-rows-1 gap-0">
										<div class="col-span-3">{episode.overview}</div>
										<div class="col-span-1 flex items-center justify-center">
											<button
												type="button"
												class="variant-filled btn"
												on:click={() => playepisode(episode, 'omu')}>Play</button
											>
										</div>
									</div>
								</svelte:fragment>
							</AccordionItem>
						{/if}
					{/each}
				</Accordion>
			{/if}
		</svelte:fragment>
	</TabGroup>
    -->
{/if}
<!---->
