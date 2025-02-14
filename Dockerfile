FROM denoland/deno:alpine

WORKDIR /app

# Copy application files
COPY . .

# Install the SvelteKit dependencies
RUN deno install

# Build the SvelteKit application
RUN deno task build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "build/index.js"]