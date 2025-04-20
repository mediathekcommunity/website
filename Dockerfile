# Use Node Alpine as the base image
FROM node:alpine AS base
WORKDIR /app

# Install pnpm using Alpine's package manager
RUN apk add --no-cache pnpm
COPY package.json pnpm-lock.yaml ./

# --- Production Dependencies Stage ---
# Installs only production dependencies based on the lockfile.
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

# --- Build Dependencies Stage ---
# Installs all dependencies (including devDependencies) needed for the build.
FROM base AS build-deps
RUN pnpm install --frozen-lockfile

# --- Build Stage ---
# Builds the application using the installed build dependencies.
FROM build-deps AS build
COPY . .
RUN pnpm run build

# --- Runtime Stage ---
# Creates the final, minimal runtime image.
FROM base AS runtime

# Copy built application
COPY --from=build /app/dist ./dist # Copy the build output
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Use the preferred JSON array form for CMD
CMD [ "node", "./dist/server/entry.mjs" ]