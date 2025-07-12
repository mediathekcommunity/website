CREATE TABLE `CHANNELS` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`title` text,
	`poster` text,
	`icon` text,
	`country` text
);
--> statement-breakpoint
CREATE TABLE `EPISODES` (
	`id` text PRIMARY KEY NOT NULL,
	`series_id` text NOT NULL,
	`season_number` integer,
	`episode_number` integer,
	`title` text,
	`description` text,
	`original_video_url` text,
	`local_video_url` text,
	`release_date` text,
	`audio_language_format` text,
	`subtitles_info` text,
	FOREIGN KEY (`series_id`) REFERENCES `MEDIA`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `MEDIA` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`thumbnail_url` text,
	`genre` text,
	`release_date_year` text,
	`cast_crew` text,
	`channel_id` text,
	FOREIGN KEY (`channel_id`) REFERENCES `CHANNELS`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MOVIES_FILES` (
	`id` text PRIMARY KEY NOT NULL,
	`movie_id` text NOT NULL,
	`video_url` text NOT NULL,
	`quality` text,
	`format` text,
	`audio_language_format` text,
	`subtitles_info` text,
	FOREIGN KEY (`movie_id`) REFERENCES `MEDIA`(`id`) ON UPDATE no action ON DELETE cascade
);
