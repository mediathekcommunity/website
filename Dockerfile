FROM node:alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Load environment variables and build
RUN export $(grep -v '^#' .env | xargs) && pnpm build

# Prune to production dependencies
RUN pnpm prune --prod

FROM node:alpine
WORKDIR /app

# Install pnpm globally in production image
RUN npm install -g pnpm

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

# Start the application
CMD ["node", "build"]
