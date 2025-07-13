import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { moviesFiles } from '$lib/server/schema';
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
        
        const updatedFile = await db.update(moviesFiles)
            .set({
                videoUrl: data.videoUrl,
                quality: data.quality,
                format: data.format,
                audioLanguageFormat: data.audioLanguageFormat,
                subtitlesInfo: data.subtitlesInfo,
            })
            .where(eq(moviesFiles.id, id))
            .returning()
            .get();

        if (updatedFile) {
            return json(updatedFile);
        } else {
            return json({ error: 'Movie file not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating movie file:', error);
        return json({ error: 'Failed to update movie file' }, { status: 500 });
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
        const deletedFile = await db.delete(moviesFiles)
            .where(eq(moviesFiles.id, id))
            .returning()
            .get();

        if (deletedFile) {
            return json({ message: 'Movie file deleted successfully' });
        } else {
            return json({ error: 'Movie file not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting movie file:', error);
        return json({ error: 'Failed to delete movie file' }, { status: 500 });
    }
}
