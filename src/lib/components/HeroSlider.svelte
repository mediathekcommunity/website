<script>
	// @ts-nocheck
	import { visible } from '$lib/store';
	import emblaCarouselSvelte from 'embla-carousel-svelte'; 
	let { data, heroItems } = $props(); 
	let options = { align: 'start', slidesToScroll: 1, loop: true };
 	let emblaApi;
	function getimgurl(img) {
		if (img.backdrop) {
			return 'https://img.mediathek.community/t/p/original' + img.backdrop;
		} else {
			return 'https://cdn1.mediathek.community/' + img.backdropup.filename;
		}
	}
	function onInit(event) {
		emblaApi = event.detail;
	}
</script>


<div class="relative w-full h-screen max-h-[70vh]">
    <div class="embla absolute inset-0" use:emblaCarouselSvelte={{ options }} onemblaInit={onInit}>
      <div class="embla__container">
        {#each heroItems as slide, i}
          <div class="embla__slide">
            <div class="relative h-full w-full">
              <img
                src="https://img.mediathek.community/t/p/original{slide.backdrop}"
                alt={slide.title}
                class="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div class="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[rgb(17,17,17)] to-transparent" />
              <div class="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] text-white sm:bottom-8 sm:left-8 sm:max-w-[calc(100%-4rem)] md:bottom-12 md:left-16 md:max-w-2xl lg:bottom-16 lg:left-32 lg:max-w-3xl">
                <div class="mb-2 flex flex-wrap items-center gap-2 sm:mb-4">
                  <span class="inline-block bg-red-700 px-2 py-1 text-xs text-white sm:text-sm">
                    {slide.subtitle}
                  </span>
                  <span class="inline-flex items-center gap-1 bg-gray-800 px-2 py-1 text-xs text-white sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {slide.quality}
                  </span>
                  <span class="inline-flex items-center gap-1 bg-blue-600 px-2 py-1 text-xs text-white sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h-2v-2h2zm-3 0v2H8v-2h4zm-5 0v2H5v-2h2zm-3-3h2v2H4v-2zm3 0h4v2H7v-2zm5 0h2v2h-2v-2zm3-3h2v2h-2V7zm-3 0h2v2h-2V7zm-5 0h4v2H7V7zm-3 0h2v2H4V7z" clip-rule="evenodd" />
                    </svg>
                    {slide.type}
                  </span>
                </div>
                <h1 class="mb-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p class="mb-4 text-sm italic text-gray-300 sm:text-base">
                  Original Title: {slide.originalTitle}
                </p>
                <button class="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                  </svg>
                  Details
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <style>
    .embla {
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
  
    .embla__container {
      display: flex;
      height: 100%;
    }
  
    .embla__slide {
      flex: 0 0 100%;
      min-width: 0;
      position: relative;
      height: 100%;
    }
  </style>
  