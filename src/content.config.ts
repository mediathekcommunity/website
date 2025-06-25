import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const details = defineCollection({
  // Load JSON files in the `src/content/details/` directory.
  loader: glob({ base: "./src/content/details", pattern: "**/*.json" }),
  // Type-check the JSON data using a unified schema for both movies and series
  schema: z.object({
    id: z.string(),
    title: z.string(),
    orgtitle: z.string().optional(),
    geo: z.string(),
    fskcheck: z.boolean().optional(),
    serverhour: z.number().optional(),
    dyna: z.boolean().optional(),
    info: z.object({
      type: z.enum(["movie", "series", "y-movie", "y-series"]),
      duration: z.number(), // Duration per episode for series, total for movies
      seasons: z.number().default(0), // 0 for movies, number of seasons for series
      episodes: z.number().default(0), // 0 for movies, total episodes for series
      onlineuntil: z.string(),
      quality: z.string(),
      description: z.string(),
      channel: z.object({
        name: z.string(),
        country: z.string(),
        icon: z.string().optional(),
        info: z.boolean().optional(),
      }),
      cast: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        )
        .optional(),
      crew: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        )
        .optional(),
      backdrop: z.string().optional(),
      poster: z.string().optional(),
      backdropup: z
        .object({
          filename_disk: z.string(),
        })
        .optional(),
      posterup: z
        .object({
          filename_disk: z.string(),
        })
        .optional(),
    }),
    // Movie-specific fields (only present for movies)
    videosource: z
      .object({
        src: z.string(),
        type: z.string(),
        poster: z.string(),
        title: z.string(),
        audiolang: z.array(z.string()),
      })
      .optional(),
    sublangs: z
      .array(
        z.object({
          srclang: z.string(),
          spokenlang: z.boolean(),
        })
      )
      .optional(),
    links: z
      .array(
        z.object({
          fsubtitle_lang: z.array(z.string()).optional(),
        })
      )
      .optional(),
    // Series-specific fields (only present for series)
    playlist: z
      .object({
        ov: z
          .record(
            z.array(
              z.object({
                season: z.number(),
                episode: z.number(),
                title: z.string(),
                description: z.string().optional(),
                audiolang: z.string(),
              })
            )
          )
          .optional(),
        regular: z
          .record(
            z.array(
              z.object({
                season: z.number(),
                episode: z.number(),
                title: z.string(),
                description: z.string().optional(),
                audiolang: z.array(z.string()),
              })
            )
          )
          .optional(),
      })
      .optional(),
    // Common optional fields
    backdropup: z
      .object({
        filename_disk: z.string(),
      })
      .optional(),
    posterup: z
      .object({
        filename_disk: z.string(),
      })
      .optional(),
  }),
});

export const collections = { details };
