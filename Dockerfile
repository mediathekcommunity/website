# Use Node Alpine as the base image
FROM node:alpine AS base
WORKDIR /app

# Install pnpm using Alpine's package manager
# Note: Ensure the pnpm version available via apk is suitable for your project.
# Alternatively, you could install pnpm via npm: RUN npm install -g pnpm
RUN apk add --no-cache pnpm

# Copy only the package manifest and lockfile first to leverage Docker cache.
# This ensures dependency installation steps are skipped if only source code changes.
COPY package.json pnpm-lock.yaml ./

# --- Production Dependencies Stage ---
# Installs only production dependencies based on the lockfile.
FROM base AS prod-deps
# Use --prod flag to install only production dependencies
# Use --frozen-lockfile for reproducible installs matching the lockfile exactly
RUN pnpm install --prod --frozen-lockfile

# --- Build Dependencies Stage ---
# Installs all dependencies (including devDependencies) needed for the build.
FROM base AS build-deps
# Use --frozen-lockfile for reproducible installs matching the lockfile exactly
RUN pnpm install --frozen-lockfile

# --- Build Stage ---
# Builds the application using the installed build dependencies.
FROM build-deps AS build
# Copy the rest of the application source code
COPY . .
# Run the build script defined in package.json using pnpm
RUN pnpm run build

# --- Runtime Stage ---
# Creates the final, minimal runtime image.
FROM base AS runtime

# Copy built application
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Use the preferred JSON array form for CMD
CMD [ "node", "./build/index.js" ]