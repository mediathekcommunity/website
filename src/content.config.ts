import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// European country codes for flags (based on flag-icons library)
const europeanCountryCodes = z.enum([
  // Western Europe
  "gb", "de", "fr", "es", "it", "pt", "nl",
  // Northern Europe  
  "se", "dk", "no", "fi", "is", "fo",
  // Eastern Europe
  "pl", "ru", "cz", "hu", "ro", "bg", "hr", "sk", "si", "ee", "lv", "lt", "ua", "by",
  // Southern Europe
  "gr", "mt", "al", "mk", "rs", "ba", "me",
  // Additional European codes
  "ie", "lu", "at", "ch", "be", "li", "sm", "va", "ad", "mc"
]);

// European language codes (ISO 639-1) - can include suffixes like -dub, -sub, etc.
const europeanLanguageCodes = z.string().refine((val) => {
  // Split on hyphen and check if the first part is a valid European language code
  const langPart = val.split('-')[0];
  const validCodes = [
    // Western Europe
    "en", "de", "fr", "es", "it", "pt", "nl",
    // Northern Europe
    "sv", "da", "no", "fi", "is", "fo", 
    // Eastern Europe
    "pl", "ru", "cs", "hu", "ro", "bg", "hr", "sk", "sl", "et", "lv", "lt", "uk", "be",
    // Southern Europe
    "el", "mt", "sq", "mk", "sr", "bs", "me",
    // Regional European languages
    "ga", "cy", "eu", "ca", "gl", "br", "co", "oc", "lb"
  ];
  return validCodes.includes(langPart);
}, "Language code must start with a valid European language code");

const details = defineCollection({
  // Load JSON files in the `src/content/details/` directory.
  loader: glob({ base: "./src/content/details", pattern: "**/*.json" }),
  // Type-check the JSON data using a unified schema for both movies and series
  schema: z.object({
    id: z.string(),
    title: z.string(),
    orgtitle: z.string().optional(),
    geo: europeanCountryCodes.optional(),
    fskcheck: z.boolean().optional(),
    serverhour: z.number().optional(),
    dyna: z.boolean().optional(),
    created: z.string().optional(), // ISO 8601 timestamp for when the content was first created
    lastupdated: z.string().optional(), // ISO 8601 timestamp for when the content was last updated
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
        country: europeanCountryCodes,
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
      spoken_languages: z.array(europeanLanguageCodes).optional(), // Add spoken_languages as an optional field to the info object in the content schema
    }),
    // Movie-specific fields (only present for movies)
    videosource: z
      .object({
        src: z.string(),
        type: z.string(),
        poster: z.string(),
        title: z.string(),
        audiolang: z.array(europeanLanguageCodes),
        sources: z.array(
          z.object({
            src: z.string(),
            type: z.string()
          })
        ).optional(),
      })
      .optional(),
    sublangs: z
      .array(
        z.object({
          srclang: europeanLanguageCodes,
          spokenlang: z.boolean(),
        })
      )
      .optional(),
    links: z
      .array(
        z.object({
          fsubtitle_lang: z.array(europeanLanguageCodes).optional(),
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
                audiolang: europeanLanguageCodes,
                sources: z.array(
                  z.object({
                    src: z.string(),
                    type: z.string()
                  })
                ).optional(),
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
                audiolang: z.array(europeanLanguageCodes),
                sources: z.array(
                  z.object({
                    src: z.string(),
                    type: z.string()
                  })
                ).optional(),
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
