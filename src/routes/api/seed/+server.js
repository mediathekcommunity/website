import { json } from '@sveltejs/kit';
import db from '$lib/server/db';
import { channels, media, moviesFiles, episodes } from '$lib/server/schema';
import { v4 as uuidv4 } from 'uuid';

import { redirect } from '@sveltejs/kit';

export const POST = async (event) => {
  const session = await event.locals.auth()

  if (!session?.user?.id) {
    return new Response(null, { status: 401, statusText: "Unauthorized" })
  }
    try {
        // Clear existing data (optional, for fresh seeding)
        await db.delete(moviesFiles);
        await db.delete(episodes);
        await db.delete(media);
        await db.delete(channels);

        const mockChannels = [
            {
                id: uuidv4(),
                name: 'EuroFilm',
                title: 'EuroFilm Studios',
                poster: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                icon: 'mdi:movie-open', // Changed to mdi icon
                country: 'Germany',
            },
            {
                id: uuidv4(),
                name: 'NordicBroadcast',
                title: 'Nordic Broadcast',
                poster: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                icon: 'mdi:television-box', // Changed to mdi icon
                country: 'Sweden',
            },
            {
                id: uuidv4(),
                name: 'YouthMedia',
                title: 'Youth Media Corp',
                poster: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                icon: 'mdi:account-group', // Changed to mdi icon
                country: 'USA',
            },
        ];

        await db.insert(channels).values(mockChannels);

        const mockMedia = [
            {
                id: uuidv4(),
                type: 'movie',
                title: 'The Great Adventure',
                description: 'A thrilling adventure movie.',
                broadcast_company: 'EuroFilm Studios',
                thumbnail_url: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                genre: 'Adventure',
                release_date_year: '2023',
                cast_crew: 'John Doe, Jane Smith',
                channelId: mockChannels[0].id, // Link to EuroFilm
                quality: '1080p', // Added quality to media
                videoFiles: [
                    {
                        id: uuidv4(),
                        videoUrl: 'http://example.com/great_adventure_1080p.mp4',
                        format: 'mp4',
                        audioLanguageFormat: 'English',
                        subtitlesInfo: 'None',
                    },
                    {
                        id: uuidv4(),
                        videoUrl: 'http://example.com/great_adventure_720p.mp4',
                        format: 'mp4',
                        audioLanguageFormat: 'English',
                        subtitlesInfo: 'English',
                    },
                ],
            },
            {
                id: uuidv4(),
                type: 'series',
                title: 'Mystery of the Old House',
                description: 'A captivating mystery series.',
                broadcast_company: 'Nordic Broadcast',
                thumbnail_url: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                genre: 'Mystery',
                release_date_year: '2022',
                cast_crew: 'Alice Brown, Bob White',
                channelId: mockChannels[1].id, // Link to Nordic Broadcast
                quality: '1080p', // Added quality to media
                episodes: [
                    {
                        id: uuidv4(),
                        seasonNumber: 1,
                        episodeNumber: 1,
                        title: 'The Missing Key',
                        description: 'The first episode of the series.',
                        originalVideoUrl: 'http://example.com/mystery_s1e1_orig.mp4',
                        localVideoUrl: 'http://example.com/mystery_s1e1_local.mp4',
                        releaseDate: '2022-01-15',
                        audioLanguageFormat: 'German',
                        subtitlesInfo: 'English, German',
                    },
                    {
                        id: uuidv4(),
                        seasonNumber: 1,
                        episodeNumber: 2,
                        title: 'Shadows in the Attic',
                        description: 'A new clue emerges.',
                        originalVideoUrl: 'http://example.com/mystery_s1e2_orig.mp4',
                        localVideoUrl: 'http://example.com/mystery_s1e2_local.mp4',
                        releaseDate: '2022-01-22',
                        audioLanguageFormat: 'German',
                        subtitlesInfo: 'English',
                    },
                ],
            },
            {
                id: uuidv4(),
                type: 'movie',
                title: 'Youthful Dreams',
                description: 'An inspiring movie for young audiences.',
                broadcast_company: 'Youth Media Corp',
                thumbnail_url: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                genre: 'Youth',
                release_date_year: '2024',
                cast_crew: 'Young Talent',
                channelId: mockChannels[2].id, // Link to Youth Media Corp
                quality: '1080p', // Added quality to media
                videoFiles: [
                    {
                        id: uuidv4(),
                        videoUrl: 'http://example.com/youthful_dreams.mp4',
                        format: 'mp4',
                        audioLanguageFormat: 'English',
                        subtitlesInfo: 'None',
                    },
                ],
            },
            {
                id: 'fallback-movie',
                type: 'movie',
                title: 'not found',
                description: 'Fallback 4K movie entry.',
                broadcast_company: 'EuroFilm Studios',
                thumbnail_url: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                genre: 'Fallback',
                release_date_year: '2023',
                cast_crew: 'Fallback Actor',
                channelId: mockChannels[0].id, // Link to EuroFilm
                quality: '4K', // Added quality to media
                videoFiles: [
                    {
                        id: uuidv4(),
                        videoUrl: 'http://example.com/not_found_4k.mp4',
                        format: 'mp4',
                        audioLanguageFormat: 'English',
                        subtitlesInfo: 'None',
                    },
                ],
            },
            {
                id: 'fallback-series',
                type: 'series',
                title: 'not found',
                description: 'Fallback 4K series entry.',
                broadcast_company: 'Nordic Broadcast',
                thumbnail_url: 'https://img.mediathek.community/images/t/p/original/8zLyVhEsH6SM9diX7CUUWcaRlk0.jpg?quality=100',
                genre: 'Fallback',
                release_date_year: '2222',
                cast_crew: 'Fallback Actor',
                channelId: mockChannels[1].id, // Link to Nordic Broadcast
                quality: '4K', // Added quality to media
                episodes: [
                    {
                        id: uuidv4(),
                        seasonNumber: 1,
                        episodeNumber: 1,
                        title: 'Fallback Episode 1',
                        description: 'Fallback episode for 4K series.',
                        originalVideoUrl: 'http://example.com/not_found_series_s1e1.mp4',
                        localVideoUrl: 'http://example.com/not_found_series_s1e1.mp4',
                        releaseDate: '2022-01-15',
                        audioLanguageFormat: 'English',
                        subtitlesInfo: 'None',
                    },
                ],
            },
        ];

        for (const item of mockMedia) {
            const { videoFiles, episodes: seriesEpisodes, ...mediaData } = item;
            const newMedia = await db.insert(media).values(mediaData).returning();

            if (item.type === 'movie' && videoFiles) {
                const filesToInsert = videoFiles.map(file => ({
                    ...file,
                    movieId: newMedia[0].id,
                }));
                await db.insert(moviesFiles).values(filesToInsert);
            } else if (item.type === 'series' && seriesEpisodes) {
                const episodesToInsert = seriesEpisodes.map(episode => ({
                    ...episode,
                    seriesId: newMedia[0].id,
                }));
                await db.insert(episodes).values(episodesToInsert);
            }
        }

        return json({ message: 'Database seeded successfully!' });
    } catch (error) {
        console.error('Error seeding database:', error);
        return json({ error: 'Failed to seed database' }, { status: 500 });
    }
}