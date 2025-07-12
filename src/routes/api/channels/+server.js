import { json } from '@sveltejs/kit';
import db from '$lib/server/db';
import { channels } from '$lib/server/schema';
import { channelSchema } from '$lib/schemas/channel';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const allChannels = await db.select().from(channels).all();
        return json(allChannels);
    } catch (/** @type {any} */ error) {
        console.error('Error fetching channels:', error);
        return json({ error: 'Failed to fetch channels' }, { status: 500 });
    }
}

import { redirect } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const { userId } = locals.auth();

    if (!userId) {
        return redirect(307, '/admin/login');
    }
    try {
        const body = await request.json();
        const validatedData = channelSchema.parse(body);

        const newChannel = await db.insert(channels).values(validatedData).returning().get();
        return json(newChannel, { status: 201 });
    } catch (/** @type {any} */ error) {
        console.error('Error creating channel:', error);
        if (error.name === 'ZodError') {
            return json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        return json({ error: 'Failed to create channel' }, { status: 500 });
    }
}