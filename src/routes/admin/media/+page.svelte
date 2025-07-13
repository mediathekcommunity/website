<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let mediaEntries: any[] = [];
    let selectedEntries: Set<string> = new Set();
    let loading = true;
    let error: string | null = null;
    let hasSelectedEntries = false; // Reactive variable for button state

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
        try {
            const response = await fetch(`/api/media/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            mediaEntries = mediaEntries.filter(media => media.id !== id);
            selectedEntries.delete(id);
            updateButtonState();
        } catch (e: any) {
            error = e.message;
        }
    }

    async function deleteSelectedMedia() {
        if (!confirm('Are you sure you want to delete the selected media entries?')) {
            return;
        }
        for (const id of selectedEntries) {
            await deleteMedia(id);
        }
        selectedEntries.clear();
        updateButtonState();
    }

    function toggleSelection(id: string) {
        if (selectedEntries.has(id)) {
            selectedEntries.delete(id);
        } else {
            selectedEntries.add(id);
        }
        updateButtonState();
    }

    function updateButtonState() {
        hasSelectedEntries = selectedEntries.size > 0;
    }
</script>

<button class="btn btn-primary mb-4" on:click={() => goto('/admin/add')}>Add New Media</button>
<button class="btn btn-danger mb-4" on:click={deleteSelectedMedia} disabled={!hasSelectedEntries}>Delete Selected</button>

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
                    <th>Select</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Genre</th>
                    <th>Broadcast Company</th>
                    <th>Online Until</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each mediaEntries as media (media.id)}
                    <tr>
                        <td>
                            <input type="checkbox" checked={selectedEntries.has(media.id)} on:change={() => toggleSelection(media.id)} />
                        </td>
                        <td>{media.id}</td>
                        <td>{media.title}</td>
                        <td>{media.type}</td>
                        <td>{media.genre || 'N/A'}</td>
                        <td>{media.broadcast_company || 'N/A'}</td>
                        <td>{media.online_until || 'N/A'}</td>
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