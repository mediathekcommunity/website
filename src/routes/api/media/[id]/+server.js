import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { media, channels, moviesFiles, episodes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET({ params, platform }) {
    try {
        const db = createDatabase(platform);
        const { id } = params;
        const mediaItem = await db.query.media.findFirst({
            where: eq(media.id, id),
            with: {
                moviesFiles: true,
                episodes: true,
                channel: true, // Include channel details
            },
        });

        if (!mediaItem) {
            return json({ error: 'Media not found' }, { status: 404 });
        }

        return json(mediaItem);
    } catch (/** @type {any} */ error) {
        console.error('Error fetching media item:', error);
        return json({ error: 'Failed to fetch media item' }, { status: 500 });
    }
}

export async function PUT({ params, request, platform }) {
    try {
        const db = createDatabase(platform);
        const { id } = params;
        const data = await request.json();
        const { type, channelId, videoFiles, episodes: seriesEpisodes, ...rest } = data;

        // Validate channelId if provided
        if (channelId) {
            const existingChannel = await db.select().from(channels).where(eq(channels.id, channelId)).get();
            if (!existingChannel) {
                return json({ error: 'Invalid channelId provided' }, { status: 400 });
            }
        }

        // Update media record (exclude videoFiles and episodes from rest)
        const updatedMedia = await db.update(media).set({ ...rest, channelId, type }).where(eq(media.id, id)).returning().get();

        if (type === 'movie') {
            if (videoFiles && videoFiles.length > 0) {
                await db.delete(moviesFiles).where(eq(moviesFiles.movieId, id));
                const filesToInsert = videoFiles.map(/** @param {any} file */ file => ({
                    id: randomUUID(), // Generate unique ID for each file
                    videoUrl: file.videoUrl,
                    quality: file.quality,
                    format: file.format,
                    audioLanguageFormat: file.audioLanguageFormat,
                    subtitlesInfo: file.subtitlesInfo,
                    movieId: id,
                }));
                await db.insert(moviesFiles).values(filesToInsert);
            }
        } else if (type === 'series') {
            if (seriesEpisodes && seriesEpisodes.length > 0) {
                await db.delete(episodes).where(eq(episodes.seriesId, id));
                const episodesToInsert = seriesEpisodes.map(/** @param {any} episode */ episode => ({
                    id: crypto.randomUUID(), // Generate unique ID for each episode
                    seasonNumber: episode.seasonNumber,
                    episodeNumber: episode.episodeNumber,
                    title: episode.title,
                    description: episode.description,
                    originalVideoUrl: episode.originalVideoUrl,
                    localVideoUrl: episode.localVideoUrl,
                    releaseDate: episode.releaseDate,
                    audioLanguageFormat: episode.audioLanguageFormat,
                    subtitlesInfo: episode.subtitlesInfo,
                    seriesId: id,
                }));
                await db.insert(episodes).values(episodesToInsert);
            }
        }

        if (updatedMedia) {
            return json(updatedMedia);
        } else {
            return json({ error: 'Media not found' }, { status: 404 });
        }
    } catch (/** @type {any} */ error) {
        console.error(`Error updating media item with ID ${params.id}:`, error);
        if (error.name === 'ZodError') {
            return json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        return json({ error: 'Failed to update media item' }, { status: 500 });
    }
}

export async function DELETE({ params, platform }) {
    try {
        const db = createDatabase(platform);
        const { id } = params;
        const deletedMedia = await db.delete(media).where(eq(media.id, id)).returning().get();

        if (deletedMedia) {
            return json({ message: 'Media item deleted successfully' });
        } else {
            return json({ error: 'Media item not found' }, { status: 404 });
        }
    } catch (/** @type {any} */ error) {
        console.error(`Error deleting media item with ID ${params.id}:`, error);
        return json({ error: 'Failed to delete media item' }, { status: 500 });
    }
}