<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let channels: any[] = [];
    let loading = true;
    let error: string | null = null;

    async function fetchChannels() {
        try {
            const response = await fetch('/api/channels');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            channels = await response.json();
        } catch (e: any) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        fetchChannels();
    });

    async function deleteChannel(id: string) {
        if (!confirm('Are you sure you want to delete this channel?')) {
            return;
        }
        try {
            const response = await fetch(`/api/channels/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            channels = channels.filter(channel => channel.id !== id);
        } catch (e: any) {
            error = e.message;
        }
    }
</script>

    <button class="btn btn-primary mb-4" on:click={() => goto('/admin/channels/add')}>Add New Channel</button>

    {#if loading}
        <p>Loading channels...</p>
    {:else if error}
        <p class="text-red-500">Error: {error}</p>
    {:else if channels.length === 0}
        <p>No channels found. Add one!</p>
    {:else}
        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Country</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each channels as channel (channel.id)}
                        <tr>
                            <td>{channel.id}</td>
                            <td>{channel.name}</td>
                            <td>{channel.title || 'N/A'}</td>
                            <td>{channel.country || 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-warning mr-2" on:click={() => goto(`/admin/channels/${channel.id}/edit`)}>Edit</button>
                                <button class="btn btn-sm btn-danger" on:click={() => deleteChannel(channel.id)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}