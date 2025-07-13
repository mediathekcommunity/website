import { json } from '@sveltejs/kit';
import { createDatabase } from '$lib/server/db';
import { media, moviesFiles, episodes, channels } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

interface MovieFile {
    videoUrl: string;
    quality: string;
    format: string;
    audioLanguageFormat: string;
    subtitlesInfo: string;
}

interface Episode {
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    description: string;
    originalVideoUrl: string;
    localVideoUrl: string;
    releaseDate: string;
    audioLanguageFormat: string;
    subtitlesInfo: string;
}

export async function GET({ platform, url }: { platform: any; url: URL }) {
    try {
        const db = createDatabase(platform);
        const title = url.searchParams.get('title');

        if (title) {
            const matchingMedia = await db.query.media.findMany({
                where: eq(media.title, title),
            });
            return json(matchingMedia);
        }

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

export async function POST({ request, locals, platform }: { request: Request; locals: any; platform: any }) {
    const session = await locals.auth();

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }

    try {
        const db = createDatabase(platform);
        const data = await request.json();

        const { type, videoFiles, episodes: seriesEpisodes, id, title, description, channelId, ...rest } = data;

        // Validate required fields
        if (!type || !title || !description || !channelId) {
            return json({ error: 'Missing required fields: type, title, description, or channelId' }, { status: 400 });
        }

        const mediaId = id || crypto.randomUUID(); // Autogenerate UUID if id is not provided

        if (type === 'movie') {
            const newMedia = await db.insert(media).values({ id: mediaId, title, description, channelId, ...rest, type }).returning();

            if (videoFiles && newMedia.length > 0) {
                const filesToInsert = videoFiles.map((file: MovieFile) => ({
                    id: crypto.randomUUID(),
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
            const newMedia = await db.insert(media).values({ id: mediaId, title, description, channelId, ...rest, type }).returning();

            if (seriesEpisodes && seriesEpisodes.length > 0 && newMedia.length > 0) {
                const episodesToInsert = seriesEpisodes.map((episode: Episode) => ({
                    id: crypto.randomUUID(),
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
    } catch (error) {
        console.error('Error creating media:', error);
        return json({ error: 'Failed to create media' }, { status: 500 });
    }
}

export async function PUT({ request, locals, platform }: { request: Request; locals: any; platform: any }) {
    const session = await locals.auth();

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: "Unauthorized" });
    }
    try {
        const db = createDatabase(platform);
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
            if (videoFiles && videoFiles.length > 0) {
                // Delete existing movie files and re-insert
                await db.delete(moviesFiles).where(eq(moviesFiles.movieId, id));
                const filesToInsert = videoFiles.map((file: MovieFile) => ({
                    id: crypto.randomUUID(), // Generate unique ID for each file
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
                const episodesToInsert = seriesEpisodes.map((episode: Episode) => ({
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

        return json(updatedMedia[0]);
    } catch (error) {
        console.error('Error updating media:', error);
        return json({ error: 'Failed to update media' }, { status: 500 });
    }
}

export async function DELETE({ request, locals, platform }: { request: Request; locals: any; platform: any }) {
    const session = await locals.auth();

    if (!session?.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const db = createDatabase(platform);
        const { id } = await request.json();
        if (!id) {
            return json({ error: 'Media ID is required for deletion' }, { status: 400 });
        }

        await db.delete(media).where(eq(media.id, id));
        return json({ message: 'Media deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting media:', error);
        return json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
