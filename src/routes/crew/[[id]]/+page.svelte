<script lang="ts">
    import Card from '$lib/components/Card.svelte';
    import ErrorSection from '$lib/components/ErrorSection.svelte';
    import PersonHero from '$lib/components/PersonHero.svelte';
    import emblaCarouselSvelte from 'embla-carousel-svelte';
    import type { EmblaOptionsType } from 'embla-carousel';
    import type { MediathekItem, PersonData, CrewMember, PageData, ApiResponse } from '$lib/types/mediathek';
    
    let { data } = $props<{ data: ApiResponse }>();
    
    const defaultPageData: PageData = {
        mediaSorted: [],
        person: {
            raw: null,
            grouped: {},
            name: '',
            birthday: '',
            place_of_birth: '',
            bio: '',
            heroImage: ''
        },
        paramid: ''
    };

    let data1 = $state<PageData>(data?.data ?? defaultPageData);
    let filteredMedia = $state<MediathekItem[]>([]);

    function filterMediaItems(items: MediathekItem[], paramId: string): MediathekItem[] {
        return items.filter((item: MediathekItem) => {
            if (!item || !paramId) return false;
            return item.crew?.some((member: CrewMember) => member.id === Number(paramId));
        });
    }

    $effect(() => {
        if (!data?.data?.mediaSorted) return;
        
        data1 = data.data;
        filteredMedia = data.data.mediaSorted.filter((item) => {
            return item?.crew?.some(
                (crewMember: { id: number }) => crewMember.id === Number(data1?.paramid)
            );
        });
    });

    const options: EmblaOptionsType = { 
        align: 'start', 
        slidesToScroll: 1, 
        loop: true,
        dragFree: true,
        containScroll: 'trimSnaps'
    };
</script>

{#if !data?.error}
    <PersonHero person={data1?.person ?? defaultPageData.person} showBio={true} />
    <div class="media-list">
        {#if filteredMedia.length > 0}
            <div class="embla" use:emblaCarouselSvelte={{ options, plugins: [] }}>
                <div class="embla__container flex">
                    {#each filteredMedia as item}
                        <div class="embla__slide">
                            <Card carddata={item} countryflag />
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <p>No media entries found for this crew member.</p>
        {/if}
    </div>
{:else}
    <ErrorSection error={data?.error} />
{/if}

<style>
    .media-list {
        padding: 2rem 1rem;
    }
</style>
