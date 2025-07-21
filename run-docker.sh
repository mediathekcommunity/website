#!/bin/bash

# Default to production
ENV_FILE=".env.prod"
ENV_NAME="production"
IMAGE_TAG="media-app:production"

# Check for environment argument
if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    ENV_FILE=".env.dev"
    ENV_NAME="development"
    IMAGE_TAG="media-app:development"
elif [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    ENV_FILE=".env.prod"
    ENV_NAME="production"
    IMAGE_TAG="media-app:production"
elif [ ! -z "$1" ]; then
    echo "Invalid environment: $1"
    echo "Usage: $0 [dev|prod]"
    echo "  dev/development: Run development image"
    echo "  prod/production: Run production image (default)"
    exit 1
fi

echo "Starting $ENV_NAME container..."

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE file not found."
    exit 1
fi

# Load environment variables from the specified file
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Run the Docker container with environment variables
docker run \
  -e DATABASE_URL="$DATABASE_URL" \
  -e DATABASE_AUTH_TOKEN="$DATABASE_AUTH_TOKEN" \
  -e PUBLIC_CLERK_PUBLISHABLE_KEY="$PUBLIC_CLERK_PUBLISHABLE_KEY" \
  -e CLERK_SECRET_KEY="$CLERK_SECRET_KEY" \
  -e AUTH_SECRET="$AUTH_SECRET" \
  -e AUTH0_CLIENT_ID="$AUTH0_CLIENT_ID" \
  -e AUTH0_CLIENT_SECRET="$AUTH0_CLIENT_SECRET" \
  -e AUTH0_ISSUER_BASE_URL="$AUTH0_ISSUER_BASE_URL" \
  -e NODE_ENV="$NODE_ENV" \
  -p 3000:3000 \
  "$IMAGE_TAG"

echo "Container started on http://localhost:3000"
