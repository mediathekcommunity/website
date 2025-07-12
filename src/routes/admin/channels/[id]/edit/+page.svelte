<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { channelSchema } from '$lib/schemas/channel';

    let channelId: string;
    let channel = {
        id: '',
        name: '',
        title: '',
        poster: '',
        icon: '',
        country: '',
    };

    let loading = true;
    let formError: string | null = null;
    let validationErrors: Record<string, string> = {};

    onMount(async () => {
        channelId = $page.params.id;
        if (channelId) {
            try {
                const response = await fetch(`/api/channels/${channelId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                channel = { ...channel, ...data }; // Populate form with fetched data
            } catch (e: any) {
                formError = e.message;
            } finally {
                loading = false;
            }
        } else {
            formError = 'Channel ID not provided for editing.';
            loading = false;
        }
    });

    async function handleSubmit() {
        formError = null;
        validationErrors = {};

        try {
            // Validate with Zod
            channelSchema.parse(channel);

            const response = await fetch(`/api/channels/${channelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(channel),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400 && errorData.details) {
                    errorData.details.forEach((err: any) => {
                        if (err.path && err.path.length > 0) {
                            validationErrors = { ...validationErrors, [err.path[0]]: err.message };
                        }
                    });
                } else {
                    formError = errorData.error || 'Failed to update channel.';
                }
                return;
            }

            goto('/admin/channels');
        } catch (e: any) {
            if (e.name === 'ZodError') {
                e.errors.forEach((err: any) => {
                    if (err.path && err.path.length > 0) {
                        validationErrors = { ...validationErrors, [err.path[0]]: err.message };
                    }
                });
            } else {
                formError = e.message || 'An unexpected error occurred.';
            }
        }
    }
</script>

    {#if loading}
        <p>Loading channel data...</p>
    {:else if formError}
        <p class="text-red-500">{formError}</p>
    {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div class="form-control">
                <label for="id" class="label">
                    <span class="label-text">ID (Unique Identifier)</span>
                </label>
                <input type="text" id="id" bind:value={channel.id} class="input input-bordered w-full" disabled />
                <p class="text-sm text-gray-500 mt-1">ID cannot be changed.</p>
            </div>

            <div class="form-control">
                <label for="name" class="label">
                    <span class="label-text">Name</span>
                </label>
                <input type="text" id="name" bind:value={channel.name} class="input input-bordered w-full" />
                {#if validationErrors.name}
                    <p class="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                {/if}
            </div>

            <div class="form-control">
                <label for="title" class="label">
                    <span class="label-text">Title</span>
                </label>
                <input type="text" id="title" bind:value={channel.title} class="input input-bordered w-full" />
                {#if validationErrors.title}
                    <p class="text-red-500 text-xs mt-1">{validationErrors.title}</p>
                {/if}
            </div>

            <div class="form-control">
                <label for="poster" class="label">
                    <span class="label-text">Poster URL</span>
                </label>
                <input type="text" id="poster" bind:value={channel.poster} class="input input-bordered w-full" />
                {#if validationErrors.poster}
                    <p class="text-red-500 text-xs mt-1">{validationErrors.poster}</p>
                {/if}
            </div>

            <div class="form-control">
                <label for="icon" class="label">
                    <span class="label-text">Icon URL</span>
                </label>
                <input type="text" id="icon" bind:value={channel.icon} class="input input-bordered w-full" />
                {#if validationErrors.icon}
                    <p class="text-red-500 text-xs mt-1">{validationErrors.icon}</p>
                {/if}
            </div>

            <div class="form-control">
                <label for="country" class="label">
                    <span class="label-text">Country (2-letter code, e.g., DE)</span>
                </label>
                <input type="text" id="country" bind:value={channel.country} class="input input-bordered w-full" />
                {#if validationErrors.country}
                    <p class="text-red-500 text-xs mt-1">{validationErrors.country}</p>
                {/if}
            </div>

            <div class="flex space-x-4">
                <button type="submit" class="btn btn-primary">Update Channel</button>
                <button type="button" class="btn btn-secondary" on:click={() => goto('/admin/channels')}>Cancel</button>
            </div>
        </form>
    {/if}