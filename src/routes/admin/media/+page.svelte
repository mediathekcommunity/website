<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let mediaEntries: any[] = [];
    let loading = true;
    let error: string | null = null;

    async function fetchMedia() {
        try {
            const response = await fetch('/api/media');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            mediaEntries = await response.json();
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        fetchMedia();
    });

    async function deleteMedia(id: string) {
        if (!confirm('Are you sure you want to delete this media entry?')) {
            return;
        }
        try {
            const response = await fetch(`/api/media/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            mediaEntries = mediaEntries.filter(media => media.id !== id);
        } catch (e: any) {
            error = e.message;
        }
    }
</script>

    <button class="btn btn-primary mb-4" on:click={() => goto('/admin/add')}>Add New Media</button>

    {#if loading}
        <p>Loading media entries...</p>
    {:else if error}
        <p class="text-red-500">Error: {error}</p>
    {:else if mediaEntries.length === 0}
        <p>No media entries found. Add one!</p>
    {:else}
        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Genre</th>
                        <th>Broadcast Company</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each mediaEntries as media (media.id)}
                        <tr>
                            <td>{media.id}</td>
                            <td>{media.title}</td>
                            <td>{media.type}</td>
                            <td>{media.genre || 'N/A'}</td>
                            <td>{media.broadcast_company || 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-warning mr-2" on:click={() => goto(`/admin/edit/${media.id}`)}>Edit</button>
                                <button class="btn btn-sm btn-danger" on:click={() => deleteMedia(media.id)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}