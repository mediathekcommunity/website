<script lang="ts">
    import { goto } from '$app/navigation';
    import { channelSchema } from '$lib/schemas/channel';

    let channel = {
        id: '',
        name: '',
        title: '',
        poster: '',
        icon: '',
        country: '',
    };

    let formError: string | null = null;
    let validationErrors: Record<string, string> = {};

    async function handleSubmit() {
        formError = null;
        validationErrors = {};

        try {
            // Validate with Zod
            channelSchema.parse(channel);

            const response = await fetch('/api/channels', {
                method: 'POST',
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
                    formError = errorData.error || 'Failed to add channel.';
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

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        {#if formError}
            <p class="text-red-500">{formError}</p>
        {/if}

        <div class="form-control">
            <label for="id" class="label">
                <span class="label-text">ID (Unique Identifier)</span>
            </label>
            <input type="text" id="id" bind:value={channel.id} readonly class="input input-bordered w-full" />
            {#if validationErrors.id}
                <p class="text-red-500 text-xs mt-1">{validationErrors.id}</p>
            {/if}
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
            <button type="submit" class="btn btn-primary">Add Channel</button>
            <button type="button" class="btn btn-secondary" on:click={() => goto('/admin/channels')}>Cancel</button>
        </div>
    </form>