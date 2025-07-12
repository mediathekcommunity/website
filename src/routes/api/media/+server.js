import { json } from '@sveltejs/kit';
import db from '$lib/server/db';
import { media, moviesFiles, episodes, channels } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function GET() {
    try {
        const allMedia = await db.query.media.findMany({
            with: {
                moviesFiles: true,
                episodes: true,
                channel: true, // Include channel details
            },
        });

        const actualMedia = allMedia.filter(item => item.id !== 'fallback-movie' && item.id !== 'fallback-series');

        if (actualMedia.length === 0) {
            // If no actual media found, return only fallback entries
            const fallbackMovie = allMedia.find(item => item.id === 'fallback-movie');
            const fallbackSeries = allMedia.find(item => item.id === 'fallback-series');
            
            const fallbackMedia = [];
            if (fallbackMovie) fallbackMedia.push(fallbackMovie);
            if (fallbackSeries) fallbackMedia.push(fallbackSeries);

            return json(fallbackMedia);
        } else {
            // Otherwise, return all media (including fallbacks if they exist)
            return json(actualMedia);
        }
    } catch (error) {
        console.error('Error fetching media:', error);
        return json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

import { redirect } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  const session = await locals.auth()

 
  if (!session?.user) {
    return new Response(null, { status: 401, statusText: "Unauthorized" })
  }
    try {
        const data = await request.json();
        const { type, videoFiles, episodes: seriesEpisodes, ...rest } = data;

        if (type === 'movie') {
            const newMedia = await db.insert(media).values({ ...rest, type }).returning();
            if (videoFiles && newMedia.length > 0) {
                const filesToInsert = videoFiles.map(/** @param {any} file */ file => ({
                    id: randomUUID(), // Generate unique ID for each file
                    videoUrl: file.videoUrl,
                    quality: file.quality,
                    format: file.format,
                    audioLanguageFormat: file.audioLanguageFormat,
                    subtitlesInfo: file.subtitlesInfo,
                    movieId: newMedia[0].id,
                }));
                await db.insert(moviesFiles).values(filesToInsert);
            }
            return json(newMedia[0], { status: 201 });
        } else if (type === 'series') {
            const newMedia = await db.insert(media).values({ ...rest, type }).returning();
            if (seriesEpisodes && newMedia.length > 0) {
                const episodesToInsert = seriesEpisodes.map(/** @param {any} episode */ episode => ({
                    id: randomUUID(), // Generate unique ID for each episode
                    seasonNumber: episode.seasonNumber,
                    episodeNumber: episode.episodeNumber,
                    title: episode.title,
                    description: episode.description,
                    originalVideoUrl: episode.originalVideoUrl,
                    localVideoUrl: episode.localVideoUrl,
                    releaseDate: episode.releaseDate,
                    audioLanguageFormat: episode.audioLanguageFormat,
                    subtitlesInfo: episode.subtitlesInfo,
                    seriesId: newMedia[0].id,
                }));
                await db.insert(episodes).values(episodesToInsert);
            }
            return json(newMedia[0], { status: 201 });
        } else {
            return json({ error: 'Invalid media type' }, { status: 400 });
        }
    } catch (/** @type {any} */ error) {
        console.error('Error creating media:', error);
        return json({ error: 'Failed to create media' }, { status: 500 });
    }
}

export async function PUT({ request, locals }) {
  const session = await locals.auth()

 
    if (!session?.user) {
    return new Response(null, { status: 401, statusText: "Unauthorized" })
    }
    try {
        const data = await request.json();
        const { id, type, channelId, videoFiles, episodes: seriesEpisodes, ...rest } = data; // Extract videoFiles and episodes directly

        if (!id) {
            return json({ error: 'Media ID is required for update' }, { status: 400 });
        }

        // Validate channelId if provided
        if (channelId) {
            const existingChannel = await db.select().from(channels).where(eq(channels.id, channelId)).get();
            if (!existingChannel) {
                return json({ error: 'Invalid channelId provided' }, { status: 400 });
            }
        }

        // Update media record (exclude videoFiles and episodes from rest)
        const updatedMedia = await db.update(media).set({ ...rest, channelId, type }).where(eq(media.id, id)).returning();

        if (type === 'movie') {
            console.log('Updating movie with ID:', id, 'and videoFiles:', videoFiles);
            if (videoFiles && videoFiles.length > 0) {
                // Delete existing movie files and re-insert
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
                // Delete existing episodes and re-insert
                await db.delete(episodes).where(eq(episodes.seriesId, id));
                const episodesToInsert = seriesEpisodes.map(/** @param {any} episode */ episode => ({
                    id: randomUUID(), // Generate unique ID for each episode
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

        return json(updatedMedia[0]);
    } catch (/** @type {any} */ error) {
        console.error('Error updating media:', error);
        return json({ error: 'Failed to update media' }, { status: 500 });
    }
}

export async function DELETE({ request, locals }) {
    const session = await locals.auth();

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }
    try {
        const { id } = await request.json();
        if (!id) {
            return json({ error: 'Media ID is required for deletion' }, { status: 400 });
        }

        await db.delete(media).where(eq(media.id, id));
        return json({ message: 'Media deleted successfully' });
    } catch (/** @type {any} */ error) {
        console.error('Error deleting media:', error);
        return json({ error: 'Failed to delete media' }, { status: 500 });
    }
}