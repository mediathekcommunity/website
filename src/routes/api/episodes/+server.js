import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { episodes } from '$lib/server/schema';
import { randomUUID } from 'crypto';

export async function POST({ request, locals, platform }) {
    const session = await locals.auth();
    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }

    try {
        const db = createDatabase(platform);
        const data = await request.json();
        
        const newEpisode = await db.insert(episodes)
            .values({
                id: randomUUID(),
                seriesId: data.seriesId,
                seasonNumber: data.seasonNumber,
                episodeNumber: data.episodeNumber,
                title: data.title,
                description: data.description,
                originalVideoUrl: data.originalVideoUrl,
                localVideoUrl: data.localVideoUrl,
                releaseDate: data.releaseDate,
                audioLanguageFormat: data.audioLanguageFormat,
                subtitlesInfo: data.subtitlesInfo,
            })
            .returning()
            .get();

        return json(newEpisode, { status: 201 });
    } catch (error) {
        console.error('Error creating episode:', error);
        return json({ error: 'Failed to create episode' }, { status: 500 });
    }
}
