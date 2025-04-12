<script>
    const currentYear = $state(new Date().getFullYear());
</script>

<footer class="footer bg-base-300 text-base-content p-4">
    <div class="footer-content">
        <div class="footer-left">
            <p>Copyright © {currentYear} - All rights reserved</p>
            <p class="tmdb-credit">This site uses the TMDB API but is not endorsed or certified by TMDB.</p>
            <div class="tmdb-logo" aria-label="TMDB Logo">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 273.42 35.52"
                    width="273.42"
                    height="35.52"
                    aria-hidden="true"
                    class="display-inline"
                >
                    <defs>
                        <linearGradient
                            id="tmdb-logo-gradient"
                            y1="17.76"
                            x2="273.42"
                            y2="17.76"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#90cea1" />
                            <stop offset="0.56" stop-color="#3cbec9" />
                            <stop offset="1" stop-color="#00b3e5" />
                        </linearGradient>
                    </defs>
                    <path
                        class="logo-path"
                        d="M191.85,35.37h63.9A17.67,17.67,0,0,0,273.42,17.7h0A17.67,17.67,0,0,0,255.75,0h-63.9A17.67,17.67,0,0,0,174.18,17.7h0A17.67,17.67,0,0,0,191.85,35.37ZM10.1,35.42h7.8V6.92H28V0H0v6.9H10.1Zm28.1,0H46V8.25h.1L55.05,35.4h6L70.3,8.25h.1V35.4h7.8V0H66.45l-8.2,23.1h-.1L50,0H38.2ZM89.14.12h11.7a33.56,33.56,0,0,1,8.08,1,18.52,18.52,0,0,1,6.67,3.08,15.09,15.09,0,0,1,4.53,5.52,18.5,18.5,0,0,1,1.67,8.25,16.91,16.91,0,0,1-1.62,7.58,16.3,16.3,0,0,1-4.38,5.5,19.24,19.24,0,0,1-6.35,3.37,24.53,24.53,0,0,1-7.55,1.15H89.14Zm7.8,28.2h4a21.66,21.66,0,0,0,5-.55A10.58,10.58,0,0,0,110,26a8.73,8.73,0,0,0,2.68-3.35,11.9,11.9,0,0,0,1-5.08,9.87,9.87,0,0,0-1-4.52,9.17,9.17,0,0,0-2.63-3.18A11.61,11.61,0,0,0,106.22,8a17.06,17.06,0,0,0-4.68-.63h-4.6ZM133.09.12h13.2a32.87,32.87,0,0,1,4.63.33,12.66,12.66,0,0,1,4.17,1.3,7.94,7.94,0,0,1,3,2.72,8.34,8.34,0,0,1,1.15,4.65,7.48,7.48,0,0,1-1.67,5,9.13,9.13,0,0,1-4.43,2.82V17a10.28,10.28,0,0,1,3.18,1,8.51,8.51,0,0,1,2.45,1.85,7.79,7.79,0,0,1,1.57,2.62,9.16,9.16,0,0,1,.55,3.2,8.52,8.52,0,0,1-1.2,4.68,9.32,9.32,0,0,1-3.1,3A13.38,13.38,0,0,1,152.32,35a22.5,22.5,0,0,1-4.73.5h-14.5Zm7.8,14.15h5.65a7.65,7.65,0,0,0,1.78-.2,4.78,4.78,0,0,0,1.57-.65,3.43,3.43,0,0,0,1.13-1.2,3.63,3.63,0,0,0,.42-1.8A3.3,3.3,0,0,0,151,8.6a3.42,3.42,0,0,0-1.23-1.13A6.07,6.07,0,0,0,148,6.9a9.9,9.9,0,0,0-1.85-.18h-5.3Zm0,14.65h7a8.27,8.27,0,0,0,1.83-.2,4.67,4.67,0,0,0,1.67-.7,3.93,3.93,0,0,0,1.23-1.3,3.8,3.8,0,0,0,.47-1.95,3.16,3.16,0,0,0-.62-2,4,4,0,0,0-1.58-1.18,8.23,8.23,0,0,0-2-.55,15.12,15.12,0,0,0-2.05-.15h-5.9Z"
                    />
                </svg>
            </div>
        </div>
        <nav class="footer-right">
            <span>
                Built with <a href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer">Sveltekit</a> &
                <a href="https://daisyui.com" target="_blank" rel="noopener noreferrer">DaisyUI v5</a>
            </span>
            <span>
                <a
                    href="https://github.com/Bitti09/mediathekcommunity"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="github-link"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                        class="github-icon"
                    >
                        <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.805 1.305 3.49.998.108-.775.42-1.305.763-1.605-2.665-.305-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.125-.305-.535-1.53.115-3.18 0 0 1.005-.322 3.3 1.23a11.47 11.47 0 013-.405c1.02.005 2.045.14 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.655 1.65.245 2.875.12 3.18.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.62-5.475 5.92.43.37.815 1.1.815 2.22 0 1.605-.015 2.895-.015 3.285 0 .32.215.695.825.575C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
                        />
                    </svg>
                    Source
                </a>
            </span>
        </nav>
    </div>
</footer>

<style>
    .footer {
        width: 100%;
        font-size: 0.875rem;
        line-height: 1.25rem;
        justify-content: center;
        contain: content;
    }

    .footer-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        justify-items: center;
        justify-content: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .footer-left,
    .footer-right {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }

    .tmdb-credit {
        font-size: clamp(0.8rem, 1.5vw, 0.9rem);
        color: var(--font-color-light);
    }

    .tmdb-logo {
        margin-top: 0.5rem;
        transform: translateZ(0);
        will-change: transform;
    }

    .tmdb-logo svg {
        height: clamp(12px, 2vw, 13.52px);
        width: auto;
    }

    .logo-path {
        fill: url(#tmdb-logo-gradient);
    }

    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s ease;
    }

    .github-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .github-icon {
        display: block;
    }

    @media (min-width: 768px) {
        .footer-content {
            grid-template-columns: 1fr 1fr;
        }
    }
</style>
