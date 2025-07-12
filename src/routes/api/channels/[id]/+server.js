import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { channels } from '$lib/server/schema';
import { channelSchema } from '$lib/schemas/channel';
import { eq } from 'drizzle-orm';

export async function GET({ params, platform }) {
    try {
        const db = createDatabase(platform);
        const { id } = params;
        const channel = await db.select().from(channels).where(eq(channels.id, id)).get();

        if (channel) {
            return json(channel);
        } else {
            return json({ error: 'Channel not found' }, { status: 404 });
        }
    } catch (/** @type {any} */ error) {
        console.error(`Error fetching channel with ID ${params.id}:`, error);
        return json({ error: 'Failed to fetch channel' }, { status: 500 });
    }
}

export async function PUT({ params, request, platform }) {
    try {
        const db = createDatabase(platform);
        const { id } = params;
        const body = await request.json();
        const validatedData = channelSchema.parse(body);

        const updatedChannel = await db.update(channels)
            .set(validatedData)
            .where(eq(channels.id, id))
            .returning()
            .get();

        if (updatedChannel) {
            return json(updatedChannel);
        } else {
            return json({ error: 'Channel not found' }, { status: 404 });
        }
    } catch (/** @type {any} */ error) {
        console.error(`Error updating channel with ID ${params.id}:`, error);
        if (error.name === 'ZodError') {
            return json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        return json({ error: 'Failed to update channel' }, { status: 500 });
    }
}

export async function DELETE({ params, platform }) {
    try {
        const db = createDatabase(platform);
        const { id } = params;
        const deletedChannel = await db.delete(channels)
            .where(eq(channels.id, id))
            .returning()
            .get();

        if (deletedChannel) {
            return json({ message: 'Channel deleted successfully' });
        } else {
            return json({ error: 'Channel not found' }, { status: 404 });
        }
    } catch (/** @type {any} */ error) {
        console.error(`Error deleting channel with ID ${params.id}:`, error);
        return json({ error: 'Failed to delete channel' }, { status: 500 });
    }
}