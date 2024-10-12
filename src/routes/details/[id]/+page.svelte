<script>
	// @ts-nocheck
	import { Tabs, Accordion } from '@skeletonlabs/skeleton-svelte';
	import * as Flag from 'svelte-flags';
	import LibraryBig from 'lucide-svelte/icons/library-big';
	import Film from 'lucide-svelte/icons/film';
	import Tv from 'lucide-svelte/icons/tv';
	import Videoplayer from '$lib/components/Videoplayer.svelte';
	import { modalvideo, omulist, noomulist, seriestype } from '$lib/store.js';

	function getformat(id) {
		switch (id) {
			case 'mpd':
				return 'application/dash+xml';
			case 'm3u8':
				return 'application/x-mpegURL';
			default:
				return 'application/dash+xml';
		}
	}

	let myPlaylist = [];
	let myPlaylistomu = [];
	let group = $state('episodes');
	let value = $state('0');
	let { data } = $props();
	let data1 = $state();
	let channelinfo = $state();
	let backgroundImage = $state('');

	let omu = {};
	let noomu = {};
	let showvideo = $state(false);

	$effect(() => {
		data1 = data.page;
		//channelinfo = data.page.channel;
	});

	let tabSet = 0;

	function playvideo() {
		showvideo = !showvideo; // Toggle the showvideo state
		if (showvideo) {
			seriestype.set('');
			let poster1 = data1.backdrop
				? `https://img.mediathek.rocks/t/p/original/${data1.backdrop}`
				: `https://img2.mediathek.rocks/assets/${data1.heroimage}`;

			modalvideo.set({
				src: data1.streamlink,
				type: getformat(data1.streamformat),
				poster: poster1,
				title: data1.title
			});
		} else {
			// Optional: Reset the video player when hiding it
			modalvideo.set({
				src: '',
				type: '',
				poster: '',
				title: ''
			});
		}
	}

	function playepisode(episode, type) {
		showvideo = true; // Always show video for episodes
		myPlaylist = [];
		myPlaylistomu = [];
		seriestype.set(type);

		let sources = [];
		if (episode.streamlink) {
			sources.push({
				src: episode.streamlink,
				type: getformat(data1.streamformat),
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
					type: getformat(episode.streamformat),
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

		noomulist.set(myPlaylist);
		omulist.set(myPlaylistomu);

		modalvideo.set({
			src: episode.streamlink,
			type: getformat(data1.streamformat),
			poster: poster12,
			title: episode.title
		});
	}
</script>

{#if data1}
	<div class="details-container">
		{#if showvideo}
			<div class="video-player-container">
				<Videoplayer />
				<button class="close-video-btn" onclick={playvideo}>Close Video</button>
			</div>
		{:else}
			<div
				class="hero-container"
				style="background-image: url({data1.backdrop
					? `https://img.mediathek.rocks/t/p/original${data1.backdrop}`
					: `https://api.mediathek.rocks/assets/${data1.heroimage}.jpg`})"
			>
				<div class="hero-overlay"></div>
				<div class="hero-content">
					<h1 class="title">{data1.title}</h1>
					{#if data1.orgtitle && data1.orgtitle !== data1.title}
						<h2 class="subtitle">{data1.orgtitle}</h2>
					{/if}
					<div class="meta-info"></div>
				</div>
			</div>
		{/if}

		<div class="content-wrapper">
			<Tabs bind:value={group} listJustify="justify-center" class="details-tabs">
				{#snippet list()}
					<Tabs.Control value="details" title="Details">Details</Tabs.Control>
					{#if data1.links}
						{#if data1.type === 'movie'}
							<Tabs.Control value="links" title="Links">Links</Tabs.Control>
						{:else}
							<Tabs.Control value="episodes" title="Episodes">Episodes</Tabs.Control>
						{/if}
					{/if}
				{/snippet}
				{#snippet content()}
					<Tabs.Panel value="details">
						<div class="details-grid">
							<div class="info-section">
								<h3 class="section-title">Information</h3>
								<table class="info-table">
									<tbody>
										{#if data1.type == 'movie'}
											<tr>
												<th>Duration</th>
												<td>{data1.duration}m</td>
											</tr>
										{/if}
										<!--  
											<th>Country</th>
											<td>
 												<svelte:component
													this={Flag[data1.channel.country]}
													class="flag-icon"
													size="25"
												/>
												{data1.channel.country}
											</td>
										</tr>
										<tr>
											<th>Channel</th>
											<td>{data1.channel.name}</td>
										</tr>
										<tr>
											<th>Quality</th>
											<td>{data1.quality}</td>
										</tr>
								
										{#if data1.episodes.length > 0}
											<tr>
												<th>Seasons</th>
												<td>{data1.episodes.length || 1}</td>
											</tr>
											<tr>
												<th>Episodes</th>
												<td>{data1.episodes.length}</td>
											</tr>
										{/if}
											-->
									</tbody>
								</table>
							</div>
							<div class="description-section">
								<h3 class="section-title">Description</h3>
								<p>{data1.description}</p>
							</div>
						</div>
					</Tabs.Panel>
					<Tabs.Panel value="links">
						<table style="table-layout: fixed; width: 100%;">
							<thead>
								<tr>
									<th style="width: 33.33%; text-align: center;">Channel</th>
									<th style="width: 33.33%; text-align: center;">Online until</th>
									<th style="width: 33.33%; text-align: center;">Links</th>
								</tr>
							</thead>
							<tbody>
								{#if data1.type == 'movie'}
									<tr>
										<td style="text-align: center;"> link.channel </td>
										<td style="text-align: center;">{link.onlineUntil}</td>
										<td style="text-align: center;"> </td>
									</tr>
								{/if}
							</tbody>
						</table>
					</Tabs.Panel>
					<Tabs.Panel value="episodes">
						<Accordion {value} collapsible>
							{#if data1.links}
								{#each data1.links as link,index}
									<Accordion.Item value={index.toString()}>
										{#snippet lead()}
											<div class="episode-title">
												<span class="episode-number">S{link.season}-E{link.episode}:</span>
												<span>{link.title}</span>
											</div>
										{/snippet}
										{#snippet control()}<div class="flex justify-center"> {link.channel.name}</div>{/snippet}
										{#snippet panel()}
											<div class="episode-content">
												<p class="episode-overview">{link.description}</p>
												<button
													type="button"
													class="play-episode-button btn preset-filled-primary-500"
													onclick={() => playepisode(episode, 'noomu')}
												>
													Play Episode
												</button>
											</div>
										{/snippet}
									</Accordion.Item>
								{/each}
							{/if}
						</Accordion>
					</Tabs.Panel>
				{/snippet}
			</Tabs>
		</div>
	</div>
{/if}

<style>
	.video-player-container {
		position: relative;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto 2rem;
		aspect-ratio: 16 / 9;
		background-color: black;
		border-radius: 8px;
		overflow: hidden;
	}

	.close-video-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 5px 10px;
		cursor: pointer;
		z-index: 10;
	}

	.close-video-btn:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}

	.details-container {
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 0;
	}

	.hero-container {
		position: relative;
		width: 100%;
		height: 50vh;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.hero-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%);
	}

	.hero-content {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 2rem;
		color: white;
		z-index: 1;
	}

	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.subtitle {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.meta-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.content-wrapper {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	/*
	.details-tabs {
		margin-bottom: 1rem;
	}
*/
	.details-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: semibold;
		margin-bottom: 0.5rem;
	}

	.info-table {
		width: 100%;
	}

	.info-table th {
		text-align: left;
		padding: 0.5rem 0;
		font-weight: 600;
		color: var(--color-primary-500);
	}

	.info-table td {
		padding: 0.5rem 0;
	}
	/*
	.flag-icon {
		vertical-align: middle;
		margin-right: 0.5rem;
	}

	.play-button {
		margin-top: 1rem;
	}

	.play-button-container {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}

	.episodes-accordion {
		width: 100%;
	}
*/
	.episode-title {
		display: flex;
		align-items: center;
	}

	.episode-number {
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.episode-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.episode-overview {
		margin-bottom: 0.5rem;
	}

	@media (min-width: 768px) {
		.hero-container {
			height: 60vh;
		}

		.title {
			font-size: 2.5rem;
		}

		.subtitle {
			font-size: 1.5rem;
		}

		.details-grid {
			grid-template-columns: 1fr 1fr;
		}

		.episode-content {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.episode-overview {
			flex: 1;
			margin-bottom: 0;
		}
	}

	@media (min-width: 1024px) {
		.hero-container {
			height: 70vh;
		}

		.title {
			font-size: 3rem;
		}

		.subtitle {
			font-size: 1.75rem;
		}
	}
</style>
