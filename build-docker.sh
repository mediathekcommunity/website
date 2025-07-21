#!/bin/bash

# Default to production
ENV_FILE=".env.prod"
ENV_NAME="production"

# Check for environment argument
if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    ENV_FILE=".env.dev"
    ENV_NAME="development"
elif [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    ENV_FILE=".env.prod"
    ENV_NAME="production"
elif [ ! -z "$1" ]; then
    echo "Invalid environment: $1"
    echo "Usage: $0 [dev|prod]"
    echo "  dev/development: Build for development"
    echo "  prod/production: Build for production (default)"
    exit 1
fi

echo "Building Docker image for $ENV_NAME environment..."

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE file not found. Please create it with your environment variables."
    exit 1
fi

# Create a backup of current .env if it exists
if [ -f ".env" ]; then
    cp .env .env.backup
fi

# Copy the target environment file as .env for Docker build
cp "$ENV_FILE" .env

echo "Using environment file: $ENV_FILE"

# Build the Docker image
docker build -t media-app:$ENV_NAME .

BUILD_RESULT=$?

# Restore original .env file if backup exists
if [ -f ".env.backup" ]; then
    mv .env.backup .env
else
    # If no backup, remove the temporary .env file
    rm -f .env
fi

if [ $BUILD_RESULT -eq 0 ]; then
    echo "Docker image built successfully for $ENV_NAME!"
    echo ""
    echo "To run the container:"
    echo "docker run --env-file $ENV_FILE -p 3000:3000 media-app:$ENV_NAME"
    echo ""
    echo "Or use the run script:"
    echo "./run-docker.sh $1"
else
    echo "Docker build failed!"
    exit 1
fi
