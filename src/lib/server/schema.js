import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const channels = sqliteTable('CHANNELS', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    title: text('title'),
    poster: text('poster'),
    icon: text('icon'),
    country: text('country'),
});

export const media = sqliteTable('MEDIA', {
    id: text('id').primaryKey(),
    type: text('type').notNull(), // "movie" or "series"
    title: text('title').notNull(),
    description: text('description'),
    thumbnail_url: text('thumbnail_url'),
    genre: text('genre'),
    release_date_year: text('release_date_year'),
    cast_crew: text('cast_crew'),
    channelId: text('channel_id').references(() => channels.id),
    tmdbid: text('tmdbid'),
});

export const moviesFiles = sqliteTable('MOVIES_FILES', {
    id: text('id').primaryKey(),
    movieId: text('movie_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
    videoUrl: text('video_url').notNull(),
    localVideoUrl: text('local_video_url'),
    quality: text('quality'),
    format: text('format'),
    audioLanguageFormat: text('audio_language_format'),
    subtitlesInfo: text('subtitles_info'),
});

export const episodes = sqliteTable('EPISODES', {
    id: text('id').primaryKey(),
    seriesId: text('series_id').notNull().references(() => media.id, { onDelete: 'cascade' }),
    seasonNumber: integer('season_number'),
    episodeNumber: integer('episode_number'),
    title: text('title'),
    description: text('description'),
    originalVideoUrl: text('original_video_url'),
    localVideoUrl: text('local_video_url'),
    releaseDate: text('release_date'),
    audioLanguageFormat: text('audio_language_format'),
    subtitlesInfo: text('subtitles_info'),
    tmdbid: text('tmdbid'),
});

export const channelsRelations = relations(channels, ({ many }) => ({
    media: many(media),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
    moviesFiles: many(moviesFiles),
    episodes: many(episodes),
    channel: one(channels, {
        fields: [media.channelId],
        references: [channels.id],
    }),
}));

export const moviesFilesRelations = relations(moviesFiles, ({ one }) => ({
    movie: one(media, {
        fields: [moviesFiles.movieId],
        references: [media.id],
    }),
}));

export const episodesRelations = relations(episodes, ({ one }) => ({
    series: one(media, {
        fields: [episodes.seriesId],
        references: [media.id],
    }),
}));