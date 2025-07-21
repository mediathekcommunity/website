@echo off
setlocal enabledelayedexpansion

REM Default to production
set ENV_FILE=.env.prod
set ENV_NAME=production
set IMAGE_TAG=media-app:production

REM Check for environment argument
if "%1"=="dev" (
    set ENV_FILE=.env.dev
    set ENV_NAME=development
    set IMAGE_TAG=media-app:development
) else if "%1"=="development" (
    set ENV_FILE=.env.dev
    set ENV_NAME=development
    set IMAGE_TAG=media-app:development
) else if "%1"=="prod" (
    set ENV_FILE=.env.prod
    set ENV_NAME=production
    set IMAGE_TAG=media-app:production
) else if "%1"=="production" (
    set ENV_FILE=.env.prod
    set ENV_NAME=production
    set IMAGE_TAG=media-app:production
) else if not "%1"=="" (
    echo Invalid environment: %1
    echo Usage: %0 [dev^|prod]
    echo   dev/development: Run development image
    echo   prod/production: Run production image ^(default^)
    pause
    exit /b 1
)

echo Starting %ENV_NAME% container...

REM Check if environment file exists
if not exist "%ENV_FILE%" (
    echo Error: %ENV_FILE% file not found.
    pause
    exit /b 1
)

echo Loading environment variables from %ENV_FILE%...

REM Read environment file and set variables
for /f "usebackq tokens=1,2 delims==" %%i in ("%ENV_FILE%") do (
    set "line=%%i"
    if not "!line:~0,1!"=="#" (
        set "%%i=%%j"
        set "%%i=!%%i:"=!"
    )
)

echo Running Docker container...

docker run ^
  -e DATABASE_URL="%DATABASE_URL%" ^
  -e DATABASE_AUTH_TOKEN="%DATABASE_AUTH_TOKEN%" ^
  -e PUBLIC_CLERK_PUBLISHABLE_KEY="%PUBLIC_CLERK_PUBLISHABLE_KEY%" ^
  -e CLERK_SECRET_KEY="%CLERK_SECRET_KEY%" ^
  -e AUTH_SECRET="%AUTH_SECRET%" ^
  -e AUTH0_CLIENT_ID="%AUTH0_CLIENT_ID%" ^
  -e AUTH0_CLIENT_SECRET="%AUTH0_CLIENT_SECRET%" ^
  -e AUTH0_ISSUER_BASE_URL="%AUTH0_ISSUER_BASE_URL%" ^
  -e NODE_ENV="%NODE_ENV%" ^
  -p 3000:3000 ^
  "%IMAGE_TAG%"

echo.
echo Container started on http://localhost:3000

pause
