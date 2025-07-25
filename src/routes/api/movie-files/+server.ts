import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { moviesFiles } from '$lib/server/schema';

export async function POST({ request, locals, platform }: { request: Request; locals: any; platform: any }) {
    const session = await locals.auth();
    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }

    try {
        const db = createDatabase(platform);
        const data = await request.json();
        
        const newFile = await db.insert(moviesFiles)
            .values({
                id: crypto.randomUUID(),
                movieId: data.movieId,
                videoUrl: data.videoUrl,
                quality: data.quality,
                format: data.format,
                audioLanguageFormat: data.audioLanguageFormat,
                subtitlesInfo: data.subtitlesInfo,
            })
            .returning()
            .get();

        return json(newFile, { status: 201 });
    } catch (error) {
        console.error('Error creating movie file:', error);
        return json({ error: 'Failed to create movie file' }, { status: 500 });
    }
}
