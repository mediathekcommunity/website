ALTER TABLE `MEDIA` RENAME COLUMN "thumbnail_url" TO "poster_url";--> statement-breakpoint
ALTER TABLE `MEDIA` ADD `backdrop_url` text;