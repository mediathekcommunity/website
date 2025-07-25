import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { channels } from '$lib/server/schema';
import { channelSchema } from '$lib/schemas/channel';
import { eq } from 'drizzle-orm';

export async function GET({ platform }: { platform: any }) {
    try {
        const db = createDatabase(platform);
        const allChannels = await db.select().from(channels).all();
        return json(allChannels);
    } catch (error: any) {
        console.error('Error fetching channels:', error);
        return json({ error: 'Failed to fetch channels' }, { status: 500 });
    }
}

export async function POST({ request, locals, platform }: { request: Request; locals: any; platform: any }) {
    const session = await locals.auth();

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }
    try {
        const db = createDatabase(platform);
        const body = await request.json();
        const validatedData = channelSchema.parse(body);

        const newChannel = await db.insert(channels).values(validatedData).returning().get();
        return json(newChannel, { status: 201 });
    } catch (error: any) {
        console.error('Error creating channel:', error);
        if (error.name === 'ZodError') {
            return json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        return json({ error: 'Failed to create channel' }, { status: 500 });
    }
}
