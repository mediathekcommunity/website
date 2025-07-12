<script>
  export let mediaItem;
</script>

<div class="relative h-full w-full">
  <img src={mediaItem.thumbnail_url || 'https://via.placeholder.com/150'} alt={mediaItem.title} class="hero-image absolute inset-0 h-full w-full" />
  <div class="gradient-overlay absolute inset-x-0 bottom-0"></div>
  <div class="text-overlay absolute bottom-4 left-4 text-white sm:bottom-8 sm:left-8 md:bottom-12 md:left-16 lg:bottom-16 lg:left-32">
    <div class="mb-1 flex flex-wrap items-center gap-1 sm:mb-4">
      {#if mediaItem.logo_url}
        <span class="badge-ghost inline-flex items-center px-1 py-1 text-white sm:text-sm">
          <img src={mediaItem.logo_url} alt="Logo" class="h-8 w-auto" />
        </span>
      {/if}
      {#if mediaItem.uhd}
        <span class="badge-ghost inline-flex items-center gap-1 px-1 py-1 text-white sm:text-sm">
          <span class="badge badge-outline text-white">UHD</span>
        </span>
      {/if}
      {#if mediaItem.type === 'movie'}
        <span class="badge-ghost inline-flex items-center gap-1 px-1 py-1 text-white sm:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M4 8h16M4 12h16M4 16h16" />
          </svg>
        </span>
      {/if}
    </div>
    <h1 class="mb-2 text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
      {mediaItem.title}
    </h1>
    {#if mediaItem.original_title && mediaItem.original_title !== ''}
      <p class="mb-4 text-sm text-gray-300 italic sm:text-base">
        Original Title: {mediaItem.original_title}
      </p>
    {/if}
    <a href="/details/{mediaItem.id}">
      <button class="btn btn-primary"> Details</button>
    </a>
  </div>
</div>

<style>
  .hero-image {
    object-fit: cover;
  }

  .gradient-overlay {
    height: 75%;
    background: linear-gradient(
      to top,
      rgb(17, 17, 17) 0%,
      rgba(17, 17, 17, 0.987) 7.8%,
      rgba(17, 17, 17, 0.951) 15.2%,
      rgba(17, 17, 17, 0.896) 22.1%,
      rgba(17, 17, 17, 0.825) 28.7%,
      rgba(17, 17, 17, 0.741) 35.1%,
      rgba(17, 17, 17, 0.648) 41.2%,
      rgba(17, 17, 17, 0.55) 47.1%,
      rgba(17, 17, 17, 0.45) 52.9%,
      rgba(17, 17, 17, 0.352) 58.8%,
      rgba(17, 17, 17, 0.259) 64.9%,
      rgba(17, 17, 17, 0.175) 71.3%,
      rgba(17, 17, 17, 0.104) 77.9%,
      rgba(17, 17, 17, 0.049) 84.8%,
      rgba(17, 17, 17, 0.013) 92.2%,
      rgba(17, 17, 17, 0) 100%
    );
  }

  .text-overlay {
    text-align: left;
    width: calc(100% - 2rem);
    max-width: 100%;
  }

  @media (max-width: 480px) {
    .gradient-overlay {
      height: 85%;
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    .gradient-overlay {
      height: 80%;
    }
  }
</style>