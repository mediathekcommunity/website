# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.12.0
FROM node:current-alpine AS base


# SvelteKit app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apk update

# Install node modules
COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false


# Copy application code
COPY . .
RUN pnpm run build
# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "./build/index.js" ]
