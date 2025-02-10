    <script lang="ts">
        import emblaCarouselSvelte from 'embla-carousel-svelte';
        import ChannelCard from '$lib/components/ChannelCard.svelte';
        import ErrorSection from '$lib/components/ErrorSection.svelte';
        import type { PageData, Channel } from '$lib/types/channels'; // Import from the correct location

        export let data: PageData;
        let options = { align: 'start', slidesToScroll: 1, loop: true };

        // Function to group media items by channel country
        const groupByChannelCountry = (channels: Channel[]) => {
            return channels.reduce((acc, channel) => {
                const country = channel?.country || 'Unknown';
                acc[country] = acc[country] || [];
                acc[country].push(channel);
                return acc;
            }, {} as Record<string, Channel[]>);
        };

        $: groupedData = groupByChannelCountry(data.channels);
        $: countries = Object.keys(groupedData).sort();
    </script>

    <div>
        {#if data && data.channels && data.channels.length > 0}
           <div class="content-section px-4 sm:px-6 lg:px-8">
 		{#each countries as country}
                <div class="maincontent">
		<h1 class="section-title">
			<span class="bg-linear-to-br from-red-500 to-yellow-300 box-decoration-clone bg-clip-text text-transparent">
			<!-- svelte-ignore svelte_component_deprecated -->
     	               <span class="fi fi-{country.toLowerCase()}"></span>
			</span>
                    </h1>
		<div class="embla" use:emblaCarouselSvelte={options}>
                    <div class="embla__container">
                        {#each groupedData[country] as channel}
                            <div class="embla__slide">
                                <ChannelCard
                                    id={channel.id}
                                    title={channel.title}
                                    poster={channel.poster}
                                    channelName={channel.name}
                                    channelIcon={channel.icon}
                                />
                            </div>
                        {/each}
                      </div>
                    </div>
                </div>
            {/each}
	</div>
        {:else}
            <ErrorSection filter={data.filter} text1="Channel" />
        {/if}
    </div>

    <style>
    .content-section {
        margin-top: -2rem;
        position: relative;
        z-index: 10;
        background: linear-gradient(to bottom, transparent, rgb(17, 17, 17) 15%);
        padding-top: 3rem;
        // padding-left: 3rem;

    }

    .maincontent {
        margin-bottom: 0rem;
    }

    .section-title {
        font-size: clamp(1.25rem, 2vw, 1.5rem);
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
    }

    .embla {
        overflow: hidden;
        margin: 0;
    }

    .embla__container {
        display: flex;
        gap: 1rem;
    }

    .embla__slide {
        flex: 0 0 auto;
        min-width: 0;
        padding: 0;
    }
    @media (max-width: 640px) {
        .content-section {
            margin-top: 1.5rem;
            padding-top: 2rem;
        }

        .section-title {
			padding: 1.25rem 1.25rem 0.625rem 1.25rem;
        }
    }

    @media (min-width: 641px) and (max-width: 1024px) {
        .content-section {
            margin-top: -2rem;
            padding-top: 2.5rem;
            padding-left: 0rem !important;
        }
		.section-title {
			padding: 0 1rem 0.5rem 1rem;
		}
    }

    @media (min-width: 1025px) {
        .content-section {
            margin-top: -2rem;
            padding-top: 3rem;
        }
		.section-title {
			padding: 1.25rem 1.25rem 0.625rem 1.25rem;
		}
    }
        .country-header {
            display: flex;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 10px;
        }
    </style>
