# Mediathek Community Website

A modern, responsive website built with Astro for the Mediathek Community platform. This site provides an elegant browsing experience for media content with features specifically designed for movies, TV shows, and other media collections.

> **Development Note:** Currently, the primary development focus is on optimizing the dark theme experience.

## ✨ Features

- ✅ Modern, responsive design with mobile-first approach
- ✅ Dynamic content loading from JSON collections
- ✅ Hero slider carousel with animated transitions
- ✅ Country-specific content filtering
- ✅ Dark mode optimization with light mode support
- ✅ Interactive UI components with responsive behaviors
- ✅ Expiration date calculation for media content

## 📁 Project Structure

The project follows a clean Astro architecture with specialized components:

```text
├── public/
│   ├── favicon.svg
│   └── fonts/
├── src/
│   ├── assets/           # CSS and image assets
│   ├── components/       # Reusable UI components
│   │   ├── Card.astro    # Content card components
│   │   ├── HeroSlider.astro # Featured content slider
│   │   └── Time.astro    # Time formatting utilities
│   ├── content/
│   │   └── details/      # JSON content collection for media items
│   ├── layouts/
│   │   └── default.astro # Main site layout with navigation
│   ├── lib/             # Utility components
│   └── pages/           # Page routes and templates
│       ├── details/     # Dynamic detail pages for content details
│       ├── movies.astro
│       ├── series.astro
│       ├── youth.astro
│       └── uhd.astro
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

The `src/content/details/` directory contains JSON files for each media item in the collection. These are processed through Astro's content collections system for efficient management and retrieval.

The site uses a component-based architecture where UI elements like the `HeroSlider` and `Card` components are designed to be highly reusable and responsive across different contexts.

## 🚀 Development Commands

All commands are run from the root of the project, from a terminal:

| Command            | Action                                           |
| :----------------- | :----------------------------------------------- |
| `pnpm install`     | Installs dependencies                            |
| `pnpm dev`         | Starts local dev server at `localhost:4321`      |
| `pnpm build`       | Build your production site to `./dist/`          |
| `pnpm preview`     | Preview your build locally, before deploying     |
| `pnpm astro ...`   | Run CLI commands like `astro add`, `astro check` |

## 🎨 Theme Development

The website includes a theme switcher that allows users to toggle between dark and light modes. As noted above, the current development focus is on optimizing the dark theme experience. When contributing to the project, please ensure that your changes look good in dark mode first, then verify compatibility with light mode.

## 🔄 Content Management

Media content is managed through JSON files in the `src/content/details/` directory. Each file represents a media item with its metadata, including:

- Title and original title
- Quality information (4K, HD, etc.)
- Content type (movie, series, etc.)
- Channel information
- Online availability dates
- Background and poster images

## 🛠️ Tech Stack

This project leverages modern web technologies for optimal performance and developer experience:

- **[Astro](https://astro.build/)**: Core framework providing excellent performance through partial hydration
- **[DaisyUI](https://daisyui.com/)**: Component library built on top of Tailwind CSS
- **[Embla Carousel](https://www.embla-carousel.com/)**: Lightweight carousel for the hero slider
- **[Astro Icon](https://github.com/natemoo-re/astro-icon)**: Icon management for consistent UI elements
- **Content Collections**: Astro's built-in content management system for structured data

The architecture follows a static-first approach with minimal client-side JavaScript, focusing on performance and SEO while still providing a rich, interactive user experience.

## 🤝 Contributing

Contributions to the Mediathek Community Website are welcome! When contributing:

1. Ensure your changes maintain responsive behavior across all device sizes
2. Test your changes in dark mode first, then in light mode
3. Maintain the established code organization pattern
4. Keep performance in mind, especially for components that load on the homepage

## 📝 License

This project is licensed under the [MIT License](LICENSE).
