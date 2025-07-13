import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { episodes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function PUT({ params, request, locals, platform }: { params: any; request: Request; locals: any; platform: any }) {
    const session = await locals.auth();
    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }

    try {
        const db = createDatabase(platform);
        const { id } = params;
        const data = await request.json();
        
        const updatedEpisode = await db.update(episodes)
            .set({
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
            .where(eq(episodes.id, id))
            .returning()
            .get();

        if (updatedEpisode) {
            return json(updatedEpisode);
        } else {
            return json({ error: 'Episode not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating episode:', error);
        return json({ error: 'Failed to update episode' }, { status: 500 });
    }
}

export async function DELETE({ params, locals, platform }: { params: any; locals: any; platform: any }) {
    const session = await locals.auth();
    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }

    try {
        const db = createDatabase(platform);
        const { id } = params;
        const deletedEpisode = await db.delete(episodes)
            .where(eq(episodes.id, id))
            .returning()
            .get();

        if (deletedEpisode) {
            return json({ message: 'Episode deleted successfully' });
        } else {
            return json({ error: 'Episode not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting episode:', error);
        return json({ error: 'Failed to delete episode' }, { status: 500 });
    }
}
