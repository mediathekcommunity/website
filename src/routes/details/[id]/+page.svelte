<script>
	// @ts-nocheck
	import { mount, unmount } from 'svelte';
	import { Image } from '@unpic/svelte';

	import * as Flag from 'svelte-flags';
	import Time from 'svelte-time';
	import Icon from '@iconify/svelte';
	import LibraryBig from 'lucide-svelte/icons/library-big';
	import Film from 'lucide-svelte/icons/film';
	import Tv from 'lucide-svelte/icons/tv';
	import Videoplayer from '$lib/components/Videoplayer.svelte';
	import { modalvideo, playlist, seriestype, playlistindex } from '$lib/store';
	function toHoursAndMinutes(totalMinutes) {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
	}
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
	import videojs from 'video.js';

	let myPlaylist = [];
	let myPlaylistomu = [];
	let group = $state('details');
	let group2 = $state(1);
	let value = $state('0');
	let value2 = $state('0');
	let { data } = $props();
	let data1 = $state();
	let channelinfo = $state();
	let backgroundImage = $state('');
	let showvideo = $state(false);
	console.log('Details page:', data);

	$effect(() => {
		data1 = data.page;
	});

	let tabSet = 0;
	function sortseasons(a) {
		if (a.season < b.season) {
			return -1;
		}
		if (a.season > b.season) {
			return 1;
		}
		return 0;
	}
	function stopvideo() {
		showvideo = false;
		modalvideo.set({
			src: '',
			type: '',
			poster: '',
			title: ''
		});
		const player = videojs.getPlayers()['my-video'];
		//console.log('player:', player);
		player.dispose();
	}
	function playvideo() {
		if (!showvideo) {
			var d = data.videosource;
			//console.log(data);
			showvideo = true; // Always show video for episodes
			//d.skip= 30
			modalvideo.set(d);
			seriestype.set('single');
		} else {
			stopvideo();
		}
	}
	let getqualityicon = (quality) => {
		if (quality === '4K') {
			return 'mdi:uhd';
		} else if (quality === 'fhd') {
			return 'material-symbols:full-hd';
		} else if (quality === 'hd') {
			return 'mdi:video';
		} else {
			return 'mdi:video-outline';
		}
	};
	function playepisode(episode, index) {
		//console.log(showvideo);
		if (showvideo == false) {
			showvideo = true; // Always show video for episodes
			myPlaylist = [];
			seriestype.set('playlist');
			playlistindex.set(index);
			playlist.set(data.playlist);
			//console.log('playlist:', compRef);
		} else {
			stopvideo();
		}
	}
</script>

{#if data1}
	<div>
		{#if data1.channel.info}
			<aside class="gradient-text">
				<div class="gradient-text-light b21">
					<h3>INFO</h3>
					<p>
						{data1.channel.info}
					</p>
				</div>
			</aside>
		{/if}
		{#if showvideo}
			<div class="hero-container2 top60 relative w-full" bind:this={compRef}>
				<div class="video-player-container h-full">
					<Videoplayer />
					<button class="close-video-btn" onclick={stopvideo}>Close Video</button>
				</div>
			</div>
		{:else if data1.backdrop}
			<div class="hero-container relative w-full">
				<Image
					src="https://mediathekc.b-cdn.net/t/p/original{data1.backdrop}"
					alt={data1.title}
					class="hero-image absolute inset-0 h-full w-full"
				/>
				<div class="gradient-overlay absolute inset-x-0" style="bottom: -1px"></div>
				<div
					class="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] text-white sm:bottom-8 sm:left-8 sm:max-w-[calc(100%-4rem)] md:bottom-12 md:left-16 md:max-w-2xl lg:bottom-16 lg:left-32 lg:max-w-3xl"
				>
					<h1
						class="mb-2 text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
					>
						{data1.title}
					</h1>
					{#if data1.orgtitle}
						<p class="mb-4 text-sm text-gray-300 italic sm:text-base">
							Original Title: {data1.orgtitle}
						</p>
					{/if}
				</div>
			</div>
		{:else}
			<div
				class="hero-container"
				style="background-image: url(https://cdn1.mediathek.community/{data1.backdropup.filename})"
			>
				<div class="hero-overlay"></div>
				<div class="hero-content">
					<h1 class="title">{data1.title}</h1>
					{#if data1.orgtitle}
						<h2 class="subtitle">Original Title: {data1.orgtitle}</h2>
					{/if}
					<div class="meta-info"></div>
				</div>
			</div>
		{/if}

		<div class="content-wrapper top602">
			<div role="tablist" class="tabs tabs-lift">
				<input
					type="radio"
					name="my_tabs_3"
					role="tab"
					class="tab"
					aria-label="Details"
					checked="checked"
				/>
				<div class="tab-content bg-base-100 border-base-300 p-6">
					<div class="grid grid-cols-1 md:grid-cols-2">
						<div>
							<h3 class="section-title">Information</h3>
							<table class="info-table">
								<tbody>
									{#if data1.duration}
										<tr>
											<th>Duration</th>
											<td>{toHoursAndMinutes(data1.duration)}</td>
										</tr>
									{/if}
									{#if data1.type == 'movie'}
										<tr>
											<th>Audio Language</th>
											<td>
												<!-- svelte-ignore svelte_component_deprecated -->
												{#each data1.links[0].audiolang as lang, i}
													<svelte:component this={Flag[lang]} size="25" />
												{/each}
											</td>
										</tr>
										{#if data.sublangs.length > 0}
											<tr>
												<th>Subtitle Language</th>
												<td>
													<!-- svelte-ignore svelte_component_deprecated -->
													<div class="flex flex-row space-x-2">
														{#each data.sublangs as lang, i}
															<div class={lang.spokenlang ? 'tooltip' : ''} data-tip="Spoken lang">
																<div class="badge badge-neutral">
																	<svelte:component this={Flag[lang.srclang]} size="25" />
																	{#if lang.spokenlang}
																		<Icon icon="mdi:speakerphone" height="28px" width="36px" />
																	{/if}
																</div>
															</div>
														{/each}
													</div>
												</td>
											</tr>
										{/if}
										{#if data1.links[0].fsubtitle}
											<tr>
												<th>Forced Subtitle language </th>
												<td>
													<!-- svelte-ignore svelte_component_deprecated -->
													<div class="flex flex-row space-x-2">
														{#each data1.links[0].fsubtitle_lang as lang, i}
															<svelte:component this={Flag[lang]} size="25" />
														{/each}
													</div>
												</td>
											</tr>
										{/if}
									{/if}
									{#if data1.type != 'movie'}
										<tr>
											<th>Seasons</th>
											<td>{data1.season}</td>
										</tr>
										<tr>
											<th>Episodes (total)</th>
											<td>{data1.episode}</td>
										</tr>
									{/if}
									<tr>
										<th>Channel / Country</th>
										<td>
											<div class="flex flex-row space-x-2">
												<!-- svelte-ignore svelte_component_deprecated -->
												{data1.channel.name} / <!-- svelte-ignore svelte_component_deprecated -->
												<svelte:component
													this={Flag[data1.channel.country]}
													class="flag-icon ml-3"
													size="25"
												/>
											</div></td
										>
									</tr>
									<tr>
										<th>Quality</th>
										<td>
											<Icon icon={getqualityicon(data1.quality)} height="28px" width="36px" />
										</td>
									</tr>
									<tr>
										<th>Online until</th>
										<td>
											<Time timestamp={data1.onlineuntil} format="DD.MM.YYYY" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="description-section">
							<h3 class="section-title">Description</h3>
							<p>{data1.description}</p>
						</div>
					</div>
				</div>
				{#if data1.links.length > 0}
					<input type="radio" name="my_tabs_3" role="tab" class="tab" aria-label="Links" />
					<div class="tab-content bg-base-100 border-base-300 p-6">
						<div class="join join-vertical bg-base-100">
							<div class="collapse-arrow join-item border-base-300 collapse border">
								<input type="radio" name="my-accordion-episode" checked="true" />
								<div class="collapse-title font-semibold">
									<span>{data1.title}</span>?
								</div>
								<div class="collapse-content text-sm">
									<div class="episode-content">
										<p class="episode-overview">{data1.description}</p>

										<button type="button" class="btn btn-accent" onclick={() => playvideo(data1)}>
											<Icon icon="mdi:play-circle-outline" height="28px" width="28px" />
											Play
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<input
						type="radio"
						name="my_tabs_3"
						role="tab"
						class="tab"
						aria-label={data1.season > 1 ? 'Seasons' : 'Episodes'}
					/>
					<div class="tab-content bg-base-100 border-base-300 p-6">
						{#if data1.season > 1}
							<div role="tablist" class="tabs tabs-lift">
								{#each { length: data1.season }, season}
									<input
										type="radio"
										name="seasons_tab"
										role="tab"
										class="tab"
										aria-label="S{season + 1}"
										checked={season == 0}
									/>
									<div class="tab-content bg-base-100 border-base-300 p-6">
										<div class="join join-vertical bg-base-100">
											<!-- begin episode for seasons -->
											{#each data.groupseasons[season + 1] as link, index1}
												<div class="collapse-arrow join-item border-base-300 collapse border">
													<input type="radio" name="my-accordion-s{season}" checked={index1 == 0} />
													<div class="collapse-title font-semibold">
														<span class="episode-number">S{link.season}-E{link.episode}:</span>
														<span>{link.title} {index1}</span>
													</div>
													<div class="collapse-content text-sm">
														<div class="episode-content">
															<p class="episode-overview">
																{link.description ? link.description : 'no description'}
															</p>
															{#if data.geo == data1.channel.geo}
																<button
																	type="button"
																	class="btn btn-accent"
																	onclick={() => playepisode(link, index1)}
																>
																	Play Episode
																</button>
															{/if}
														</div>
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="join join-vertical bg-base-100">
								{#each data.groupseasons[1] as link2, index3}
									<div class="collapse-arrow join-item border-base-300 collapse border">
										<input type="radio" name="my-accordion-episode" checked={index3 == 0} />
										<div class="collapse-title font-semibold">
											<span class="episode-number">S{link2.season}-E{link2.episode}:</span>
											<span>{link2.title}</span>?
										</div>
										<div class="collapse-content text-sm">
											<div class="episode-content">
												<p class="episode-overview">{link2.description}</p>
												<button
													type="button"
													class="btn btn-accent"
													onclick={() =>
														data.geo == data.page.channel.country ? playepisode(link2, index3) : ''}
												>
													{#if data.geo == data.page.channel.country}
														<Icon icon="mdi:play-circle-outline" height="28px" width="28px" />
														<span>
															Play Episode aaa {console.log(data.page.channel.country)}
														</span>
													{:else}
														<span class="flex items-center gap-1">
															<svelte:component this={Flag[data.page.channel.country]} size="25" /> IP
															required
														</span>
													{/if}
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.hero-container {
		position: relative;
		width: 100%;
		height: 85vh;
		max-height: 95vh;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}
	.hero-container2 {
		position: relative;
		width: 100%;
		height: 52vh;
		top: auto;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.gradient-text {
		background: radial-gradient(circle, var(--tertiary-500), var(--primary-500));
		background-clip: text;
		/*color: transparent;*/
	}

	.gradient-text-light {
		background: radial-gradient(circle, var(--tertiary-100), red);
		background-clip: text;
		/*color: transparent;*/
	}

	.gradient-overlay {
		height: 75%;
		background: linear-gradient(
			to top,
			rgb(17, 17, 17) 0%,
			rgba(17, 17, 17, 0.987) 7.8%,
			rgba(17, 17, 17, 0.951) 15.2%,
			rgba(17, 17, 17, 0.896) 22.1%,
			rgba(17, 17, 17, 0.825) 28.7%,
			rgba(17, 17, 17, 0.741) 35.1%,
			rgba(17, 17, 17, 0.648) 41.2%,
			rgba(17, 17, 17, 0.55) 47.1%,
			rgba(17, 17, 17, 0.45) 52.9%,
			rgba(17, 17, 17, 0.352) 58.8%,
			rgba(17, 17, 17, 0.259) 64.9%,
			rgba(17, 17, 17, 0.175) 71.3%,
			rgba(17, 17, 17, 0.104) 77.9%,
			rgba(17, 17, 17, 0.049) 84.8%,
			rgba(17, 17, 17, 0.013) 92.2%,
			rgba(17, 17, 17, 0) 100%
		);
	}

	.b21 {
		padding: 1% 4% 0 4%;
	}
	.video-player-container {
		position: relative;
		/* top: 60px !important; */
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
		left: 10px;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 5px 10px;
		cursor: pointer;
		z-index: 10;
		display: none; /* Initially hidden */
	}

	.close-video-btn:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}
	.video-player-container:hover .close-video-btn {
		display: block; /* Show on hover */
	}

	.close-video-btn:hover {
		background-color: rgba(0, 0, 0, 0.7);
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
		//max-width: 1800px;
		margin: 0rem 1rem 1rem 0rem;
		padding: 0rem 1rem 2rem 1rem;
	}
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

	.episode-number {
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.episode-content {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.episode-overview {
		margin-bottom: 0.5rem;
	}

	.top60 {
		top: 320px;
	}
	.top602 {
		margin-top: 30px;
	}

	@media (max-width: 480px) {
		.hero-container {
			height: 40vh;
			min-height: 250px;
			max-height: 50vh;
		}
		.hero-container2 {
			height: 40vh;
			min-height: 250px;
			max-height: 50vh;
		}

		.hero-overlay {
			height: 85%;
		}
	}

	@media (min-width: 481px) and (max-width: 640px) {
		.hero-container {
			height: 50vh;
			min-height: 300px;
			max-height: 60vh;
		}
		.hero-container2 {
			height: 50vh;
			min-height: 300px;
			max-height: 60vh;
		}

		.gradient-overlay {
			height: 80%;
		}
	}

	@media (min-width: 641px) and (max-width: 768px) {
		.hero-container {
			height: 60vh;
			max-height: 75vh;
		}
		.hero-container2 {
			height: 60vh;
			max-height: 75vh;
		}
		.gradient-overlay {
			height: 75%;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.hero-container {
			height: 70vh;
			max-height: 85vh;
		}
		.hero-container2 {
			height: 70vh;
			max-height: 85vh;
		}
		.gradient-overlay {
			height: 75%;
		}
	}

	@media (min-width: 1025px) {
		.hero-container {
			height: 85vh;
			max-height: 95vh;
		}
		.hero-container2 {
			height: 85vh;
			max-height: 95vh;
		}

		.gradient-overlay {
			height: 75%;
		}
	}
</style>
