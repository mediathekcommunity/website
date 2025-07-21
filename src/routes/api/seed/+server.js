import { json } from '@sveltejs/kit';
import db from '$lib/server/db.js';
import { channels, media, moviesFiles, episodes } from '$lib/server/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
	try {
		console.log('🌱 Starting database seed...');

		// Clear existing data
		await db.delete(episodes);
		await db.delete(moviesFiles);
		await db.delete(media);
		await db.delete(channels);

		console.log('🗑️ Cleared existing data');

		// Sample channels
		const channelData = [
			{
				id: uuidv4(),
				name: 'ard',
				title: 'Das Erste',
				poster: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400',
				icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Das_Erste_logo.svg/200px-Das_Erste_logo.svg.png',
				country: 'DE'
			},
			{
				id: uuidv4(),
				name: 'zdf',
				title: 'ZDF',
				poster: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400',
				icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/ZDF_logo.svg/200px-ZDF_logo.svg.png',
				country: 'DE'
			},
			{
				id: uuidv4(),
				name: 'bbc',
				title: 'BBC One',
				poster: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400',
				icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/BBC_One_logo.svg/200px-BBC_One_logo.svg.png',
				country: 'GB'
			},
			{
				id: uuidv4(),
				name: 'france2',
				title: 'France 2',
				poster: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400',
				icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/France_2_logo.svg/200px-France_2_logo.svg.png',
				country: 'FR'
			},
			{
				id: uuidv4(),
				name: 'rai',
				title: 'RAI 1',
				poster: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400',
				icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Rai_1_logo.svg/200px-Rai_1_logo.svg.png',
				country: 'IT'
			}
		];

		await db.insert(channels).values(channelData);
		console.log(`✅ Inserted ${channelData.length} channels`);

		// Sample movies
		const movieData = [
			{
				id: uuidv4(),
				type: 'movie',
				title: 'The Great Adventure',
				description: 'An epic adventure across unknown lands.',
				poster_url: 'https://images.unsplash.com/photo-1489599510025-c1d32bf5f11f?w=400',
				backdrop_url: 'https://images.unsplash.com/photo-1489599510025-c1d32bf5f11f?w=800',
				genre: 'Adventure,Drama',
				release_date_year: '2023',
				channelId: channelData[0].id,
				tmdbid: '12345',
				cast: JSON.stringify(['Actor One', 'Actor Two', 'Actor Three']),
				crew: JSON.stringify(['Director One', 'Producer Two']),
				onlineUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
			},
			{
				id: uuidv4(),
				type: 'movie',
				title: 'Mystery of the Lost City',
				description: 'A thrilling mystery set in an ancient civilization.',
				poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
				backdrop_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800',
				genre: 'Mystery,Thriller',
				release_date_year: '2023',
				channelId: channelData[1].id,
				tmdbid: '12346',
				cast: JSON.stringify(['Mystery Actor', 'Thriller Star']),
				crew: JSON.stringify(['Mystery Director']),
				onlineUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 15 days from now
			},
			{
				id: uuidv4(),
				type: 'movie',
				title: 'Comedy Night',
				description: 'A hilarious comedy that will make you laugh.',
				poster_url: 'https://images.unsplash.com/photo-1489599510025-c1d32bf5f11f?w=400',
				backdrop_url: 'https://images.unsplash.com/photo-1489599510025-c1d32bf5f11f?w=800',
				genre: 'Comedy',
				release_date_year: '2024',
				channelId: channelData[2].id,
				tmdbid: '12347',
				cast: JSON.stringify(['Comedy Star', 'Funny Actor']),
				crew: JSON.stringify(['Comedy Director']),
				onlineUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
			}
		];

		// Sample series
		const seriesData = [
			{
				id: uuidv4(),
				type: 'series',
				title: 'Space Odyssey',
				description: 'A journey through the cosmos.',
				poster_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
				backdrop_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
				genre: 'Sci-Fi,Drama',
				release_date_year: '2023',
				channelId: channelData[3].id,
				tmdbid: '12348',
				cast: JSON.stringify(['Sci-Fi Star', 'Space Actor']),
				crew: JSON.stringify(['Sci-Fi Director']),
				onlineUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 60 days from now
			},
			{
				id: uuidv4(),
				type: 'series',
				title: 'Detective Stories',
				description: 'Solving crimes in the big city.',
				poster_url: 'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=400',
				backdrop_url: 'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800',
				genre: 'Crime,Drama',
				release_date_year: '2024',
				channelId: channelData[4].id,
				tmdbid: '12349',
				cast: JSON.stringify(['Detective Star', 'Crime Actor']),
				crew: JSON.stringify(['Crime Director']),
				onlineUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 45 days from now
			}
		];

		const allMediaData = [...movieData, ...seriesData];
		await db.insert(media).values(allMediaData);
		console.log(`✅ Inserted ${allMediaData.length} media items`);

		// Sample movie files
		const movieFileData = [];
		for (const movie of movieData) {
			movieFileData.push(
				{
					id: uuidv4(),
					movieId: movie.id,
					videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
					localVideoUrl: null,
					quality: 'HD',
					format: 'mp4',
					audioLanguageFormat: 'German',
					subtitlesInfo: JSON.stringify([
						{ kind: 'subtitles', src: '/subtitles/sample-de.vtt', label: 'German', srclang: 'de' },
						{ kind: 'subtitles', src: '/subtitles/sample-en.vtt', label: 'English', srclang: 'en' }
					])
				},
				{
					id: uuidv4(),
					movieId: movie.id,
					videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
					localVideoUrl: null,
					quality: '4K',
					format: 'mp4',
					audioLanguageFormat: 'German',
					subtitlesInfo: JSON.stringify([
						{ kind: 'subtitles', src: '/subtitles/sample-de.vtt', label: 'German', srclang: 'de' }
					])
				}
			);
		}

		await db.insert(moviesFiles).values(movieFileData);
		console.log(`✅ Inserted ${movieFileData.length} movie files`);

		// Sample episodes
		const episodeData = [];
		for (const series of seriesData) {
			// Create 2 seasons with 3 episodes each
			for (let season = 1; season <= 2; season++) {
				for (let episode = 1; episode <= 3; episode++) {
					episodeData.push({
						id: uuidv4(),
						seriesId: series.id,
						seasonNumber: season,
						episodeNumber: episode,
						title: `Season ${season} Episode ${episode}`,
						description: `Episode ${episode} of season ${season} of ${series.title}`,
						originalVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
						localVideoUrl: null,
						releaseDate: new Date(2023, season - 1, episode * 7).toISOString().split('T')[0],
						audioLanguageFormat: 'German',
						subtitlesInfo: JSON.stringify([
							{ kind: 'subtitles', src: '/subtitles/sample-de.vtt', label: 'German', srclang: 'de' },
							{ kind: 'subtitles', src: '/subtitles/sample-en.vtt', label: 'English', srclang: 'en' }
						]),
						tmdbid: `${series.tmdbid}${season}${episode}`
					});
				}
			}
		}

		await db.insert(episodes).values(episodeData);
		console.log(`✅ Inserted ${episodeData.length} episodes`);

		console.log('🎉 Database seeded successfully!');

		return json({
			success: true,
			message: 'Database seeded successfully',
			stats: {
				channels: channelData.length,
				movies: movieData.length,
				series: seriesData.length,
				movieFiles: movieFileData.length,
				episodes: episodeData.length,
				total: channelData.length + allMediaData.length + movieFileData.length + episodeData.length
			}
		});
	} catch (error) {
		console.error('❌ Seeding error:', error);
		return json(
			{
				success: false,
				error: error.message,
				message: 'Failed to seed database'
			},
			{ status: 500 }
		);
	}
}