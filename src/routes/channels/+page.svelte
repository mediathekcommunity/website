    <script lang="ts">
        import emblaCarouselSvelte from 'embla-carousel-svelte';
        import ChannelCard from '$lib/components/ChannelCard.svelte';
        import ErrorSection from '$lib/components/ErrorSection.svelte';
        import type { PageData, Channel } from '$lib/types/channels'; // Import from the correct location

        export let data: PageData;
        let options = { align: 'start', slidesToScroll: 2, loop: true };

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
           <div class="channels-container">
 {#each countries as country}
                <div class="country-header">
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <span class="fi fi-{country.toLowerCase()}"></span>
                </div>
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
            {/each}
</div>
        {:else}
            <ErrorSection filter={data.filter} text1="Channel" />
        {/if}
    </div>

    <style>
        .channels-container {
            margin-top: -2rem;
        position: relative;
        z-index: 10;
        background: linear-gradient(to bottom, transparent, rgb(17, 17, 17) 15%);
        padding-top: 3rem;
        // padding-left: 3rem;
        }

        .embla__slide {
            flex: 0 0 200px !important;
            min-width: 0;
            padding: 0 0.5rem; /* Add some space between slides */
        }

        .embla__container {
            display: flex;
            flex-direction: row;
            margin: 0 -0.5rem; /* Compensate for slide padding */
        }

        .country-header {
            display: flex;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 10px;
        }
    </style>
