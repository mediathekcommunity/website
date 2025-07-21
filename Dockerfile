FROM node:alpine AS builder
WORKDIR /app

# Install pnpm globally and tini for better process handling
RUN npm install -g pnpm && \
    apk add --no-cache tini

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code (exclude patterns handled by .dockerignore)
COPY . .

# Load environment variables and build with cache mount
RUN --mount=type=cache,target=/app/.svelte-kit \
    export $(grep -v '^#' .env | xargs) && pnpm build

# Prune to production dependencies with cache mount  
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm prune --prod

FROM node:alpine
WORKDIR /app

# Install pnpm globally and tini
RUN npm install -g pnpm && \
    apk add --no-cache tini

# Copy built application and dependencies from builder
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltekit -u 1001

# Change ownership to nodejs user
RUN chown -R sveltekit:nodejs /app

# Switch to non-root user
USER sveltekit

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application with tini for proper signal handling
CMD ["tini", "--", "node", "build"]
