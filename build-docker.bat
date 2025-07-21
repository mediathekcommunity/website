@echo off
setlocal

REM Default to production
set ENV_FILE=.env.prod
set ENV_NAME=production

REM Check for environment argument
if "%1"=="dev" (
    set ENV_FILE=.env.dev
    set ENV_NAME=development
) else if "%1"=="development" (
    set ENV_FILE=.env.dev
    set ENV_NAME=development
) else if "%1"=="prod" (
    set ENV_FILE=.env.prod
    set ENV_NAME=production
) else if "%1"=="production" (
    set ENV_FILE=.env.prod
    set ENV_NAME=production
) else if not "%1"=="" (
    echo Invalid environment: %1
    echo Usage: %0 [dev^|prod]
    echo   dev/development: Build for development
    echo   prod/production: Build for production ^(default^)
    pause
    exit /b 1
)

echo Building Docker image for %ENV_NAME% environment...

REM Check if environment file exists
if not exist "%ENV_FILE%" (
    echo Error: %ENV_FILE% file not found. Please create it with your environment variables.
    pause
    exit /b 1
)

REM Create a backup of current .env if it exists
if exist ".env" (
    copy .env .env.backup >nul
)

REM Copy the target environment file as .env for Docker build
copy "%ENV_FILE%" .env >nul

echo Using environment file: %ENV_FILE%

REM Build the Docker image
docker build -t media-app:%ENV_NAME% .

set BUILD_RESULT=%ERRORLEVEL%

REM Restore original .env file if backup exists
if exist ".env.backup" (
    move .env.backup .env >nul
) else (
    REM If no backup, remove the temporary .env file
    del .env >nul 2>&1
)

if %BUILD_RESULT% EQU 0 (
    echo.
    echo Docker image built successfully for %ENV_NAME%!
    echo.
    echo To run the container:
    echo docker run --env-file %ENV_FILE% -p 3000:3000 media-app:%ENV_NAME%
    echo.
    echo Or use the run script:
    echo run-docker.bat %1
) else (
    echo Docker build failed!
    pause
    exit /b 1
)

pause
