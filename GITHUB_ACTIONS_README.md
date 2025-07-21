# GitHub Actions Docker Build Setup

This repository includes automated Docker image building using GitHub Actions. The workflows build and push Docker images to GitHub Container Registry (ghcr.io).

## Workflows

### 1. `docker-build.yml` - Build and Test
- **Triggers**: Push/PR to main/master branch
- **Purpose**: Build Docker image for testing and development
- **Registry**: Pushes to `ghcr.io/mediathekcommunity/website`

### 2. `deploy.yml` - Production Deployment  
- **Triggers**: Push to main/master branch or version tags
- **Purpose**: Build and deploy production Docker images
- **Environment**: Uses production environment protection
- **Registry**: Pushes to `ghcr.io/mediathekcommunity/website`

## Required GitHub Secrets

You need to set up the following secrets in your GitHub repository:

### For Development/Testing (`docker-build.yml`)
Go to **Settings** → **Secrets and variables** → **Actions** → **Repository secrets**

```
DATABASE_URL                    # Development database URL
DATABASE_AUTH_TOKEN             # Development database auth token
PUBLIC_CLERK_PUBLISHABLE_KEY    # Clerk publishable key
CLERK_SECRET_KEY               # Clerk secret key  
AUTH_SECRET                    # Auth.js secret
AUTH0_CLIENT_ID                # Auth0 client ID
AUTH0_CLIENT_SECRET            # Auth0 client secret
AUTH0_ISSUER_BASE_URL          # Auth0 issuer URL
```

### For Production (`deploy.yml`)
Go to **Settings** → **Environments** → **Create environment: "production"**

```
PROD_DATABASE_URL                    # Production database URL
PROD_DATABASE_AUTH_TOKEN             # Production database auth token
PROD_PUBLIC_CLERK_PUBLISHABLE_KEY    # Production Clerk publishable key
PROD_CLERK_SECRET_KEY               # Production Clerk secret key
PROD_AUTH_SECRET                    # Production Auth.js secret
PROD_AUTH0_CLIENT_ID                # Production Auth0 client ID
PROD_AUTH0_CLIENT_SECRET            # Production Auth0 client secret
PROD_AUTH0_ISSUER_BASE_URL          # Production Auth0 issuer URL
```

## Setting Up Secrets

### 1. Repository Secrets (Development)
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from the development list above

### 2. Production Environment
1. Go to your repository on GitHub
2. Click **Settings** → **Environments**
3. Click **New environment** and name it "production"
4. Add protection rules (optional but recommended):
   - Required reviewers
   - Wait timer
   - Restrict to main branch
5. Add each secret from the production list above

## Docker Images

The built images will be available at:
```
ghcr.io/mediathekcommunity/website:latest      # Latest main branch
ghcr.io/mediathekcommunity/website:main        # Main branch
ghcr.io/mediathekcommunity/website:sha-abc123  # Specific commit
ghcr.io/mediathekcommunity/website:production  # Production release
```

## Running the Built Image

To run a built image locally:

```bash
# Pull the latest image
docker pull ghcr.io/mediathekcommunity/website:latest

# Run with your local environment
docker run --env-file .env.prod -p 3000:3000 ghcr.io/mediathekcommunity/website:latest
```

## Security Features

- ✅ **Secrets are never exposed** in build logs
- ✅ **Environment files are cleaned up** after build
- ✅ **Production environment protection** can be enabled
- ✅ **Multi-architecture builds** (amd64, arm64)
- ✅ **Build caching** for faster builds
- ✅ **Automatic tagging** based on branch/commit
