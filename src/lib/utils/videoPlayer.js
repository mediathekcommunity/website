import videojs from "video.js";

// Player state variables (client-side)
let show1 = 1; // Toggle for showing player, default is 1 (shown)
let active = 1; // Global active state for video player

// Video Player Functions - Enhanced with recreation logic
export function showVideoPlayer() {
  console.log("Showing video player and setting active=1");
  const videoCard = document.querySelector("#video-player-card");
  const heroImageContent = document.querySelector("#hero-image-content");

  // Set global active state
  active = 1;

  if (videoCard && heroImageContent) {
    // First make the card visible
    videoCard.classList.remove("hidden");
    videoCard.classList.add("visible");
    console.log("Video card made visible");

    // Enhanced timeout to ensure DOM updates and proper player recreation
    setTimeout(() => {
      // Get the VideoPlayerAstro API and set active to 1
      const videoPlayerElement = document.querySelector("#main-videoplayer");
      console.log("Looking for video element #main-videoplayer...");

      if (videoPlayerElement) {
        console.log("Found video element by ID:", videoPlayerElement);
        console.log(
          "VideoPlayerAstro API available:",
          !!(window as any).VideoPlayerAstro
        );

        // Check if the player was previously destroyed and needs recreation
        const videoEl = videoPlayerElement;
        const wasDestroyed = videoEl.style.display === "none" || 
                            videoEl.dataset.active === "0";
        
        if (wasDestroyed) {
          console.log("Player was previously destroyed, forcing recreation");
          if (window.VideoPlayerAstro) {
            // Force complete recreation using the enhanced reset
            window.VideoPlayerAstro.resetPlayer();
          }
        } else {
          // Use the standard setActive method
          if (window.VideoPlayerAstro) {
            console.log("Calling VideoPlayerAstro.setActive(1)");
            window.VideoPlayerAstro.setActive(1);
          }
        }
      } else {
        console.warn("Video player element #main-videoplayer not found");
        // If no video element exists, force recreation
        console.log("No video element found, forcing complete recreation");
        if (window.VideoPlayerAstro) {
          window.VideoPlayerAstro.resetPlayer();
        }
      }
    }, 100); // Longer delay for better DOM stability
  }
}

export function hideVideoPlayer() {
  console.log("Hiding video player with show1:", show1);

  // Set global active state based on show1
  active = show1;

  // Get the Svelte component instance
  const videoCard = document.querySelector("#video-player-card");
  const heroImageContent = document.querySelector("#hero-image-content");
  const videoPlayerElement = document.querySelector("#main-videoplayer");

  // Set the active prop based on show1 toggle
  if (videoPlayerElement) {
    console.log(
      "Setting VideoPlayerAstro active state based on show1:",
      show1
    );
    // Use the global VideoPlayerAstro API instead of Svelte component access
    if (window.VideoPlayerAstro) {
      window.VideoPlayerAstro.setActive(show1);
    } else {
      console.warn("VideoPlayerAstro API not available yet");
    }
  }

  // Only hide the container if show1 is 0
  if (videoCard && heroImageContent) {
    if (show1 === 0) {
      videoCard.classList.add("hidden");
      videoCard.classList.remove("visible");
    } else {
      // If show1 is 1, keep the player visible but perhaps change something else
      // For example, set a data attribute to indicate its state
      videoCard.dataset.show1 = show1.toString();
    }
  }
}

// Function to play a specific episode
export function playEpisode(type = "regular", seasonIndex = 0, episodeIndex = 0) {
  console.log(`Playing episode of type: ${type}, season: ${seasonIndex}, episode: ${episodeIndex}`);

  // Ensure show1 is set to 1 (show player)
  show1 = 1;

  // First make sure the player is visible and active
  showVideoPlayer();

  // Then change episode if needed - with a slight delay to ensure the player is initialized
  setTimeout(() => {
    const videoPlayerElement = document.querySelector("#main-videoplayer");
    if (videoPlayerElement) {
      // Use the global VideoPlayerAstro API
      if (window.VideoPlayerAstro) {
        console.log("Changing episode via VideoPlayerAstro API");

        // Make sure the player is active first (this will reinitialize if destroyed)
        window.VideoPlayerAstro.setActive(1);

        // Small delay to ensure reinitialization is complete
        setTimeout(() => {
          // Change episode - VideoPlayerAstro.changeEpisode(type, seasonIndex)
          // and then set the episode index within that season
          window.VideoPlayerAstro.changeEpisode(type, seasonIndex);
          
          // Update the episode index for the selected season
          setTimeout(() => {
            if (window.VideoPlayerAstro) {
              // Set the current episode index within the selected season
              console.log("Setting episode index within season:", episodeIndex);
              // We need to expose this in VideoPlayerAstro component
              window.VideoPlayerAstro.setEpisodeIndex(seasonIndex, episodeIndex);
            }
          }, 50);
        }, 50);
      } else {
        console.warn("VideoPlayerAstro API not found");
      }
    } else {
      console.warn("Video player element not found");
    }
  }, 100); // Slightly longer delay to ensure proper initialization
}

// Function to explicitly restart the video player - Enhanced with full recreation
export function restartVideoPlayer() {
  console.log("Restarting video player with full recreation");

  // Ensure show1 is set to 1
  show1 = 1;

  // First make sure the video player card is visible
  showVideoPlayer();

  // Then perform full recreation using the global VideoPlayerAstro API
  setTimeout(() => {
    if (window.VideoPlayerAstro) {
      console.log("Calling VideoPlayerAstro.resetPlayer for full recreation");
      
      // First set active to 1 to ensure proper state
      window.VideoPlayerAstro.setActive(1);
      
      // Then force a complete reset with recreation
      setTimeout(() => {
        window.VideoPlayerAstro.resetPlayer();
      }, 100);
    } else {
      console.warn("VideoPlayerAstro API not available for restart");
    }
  }, 150);
}

// Function to force complete player recreation (based on your snippet)
export function recreateVideoPlayer() {
  console.log("Force recreating video player");
  
  // Set show1 to ensure player should be shown
  show1 = 1;
  
  // Make video card visible
  const videoCard = document.querySelector("#video-player-card");
  if (videoCard) {
    videoCard.classList.remove("hidden");
    videoCard.classList.add("visible");
  }
  
  // Use the enhanced reset function that completely recreates the player
  setTimeout(() => {
    if (window.VideoPlayerAstro) {
      console.log("Calling VideoPlayerAstro.resetPlayer for complete recreation");
      window.VideoPlayerAstro.resetPlayer();
    }
  }, 100);
}

// Attach event listeners when DOM is ready
export function initializeVideoPlayer() {
  // Close video player button
  const closeButton = document.querySelector("#close-video-btn");
  closeButton?.addEventListener("click", () => {
    // Toggle show1 value between 0 and 1
    show1 = show1 === 1 ? 0 : 1;
    console.log(`Toggled show1 to: ${show1}`);

    // Still call hideVideoPlayer to handle the player hiding
    hideVideoPlayer();
  });

  // Play buttons - find all buttons with 'Play' text
  const playButtons = document.querySelectorAll("button");
  playButtons.forEach((button) => {
    if (button.textContent?.includes("Play")) {
      button.classList.add("play-btn");
      // Add data attributes if not already present
      if (!button.dataset.playlistType) {
        button.dataset.playlistType = "regular";
      }
      if (!button.dataset.seasonIndex) {
        button.dataset.seasonIndex = "0";
      }
      if (!button.dataset.episodeIndex) {
        button.dataset.episodeIndex = "0";
      }
      console.log(
        "Play button found:",
        button.textContent,
        "Type:", button.dataset.playlistType,
        "Season:", button.dataset.seasonIndex,
        "Episode:", button.dataset.episodeIndex
      );
      // Add click event listener
      button.addEventListener("click", () => {
        // First ensure show1 is set to 1 (show player)
        show1 = 1;
        console.log("Play button clicked, setting show1 to:", show1);

        const type = button.dataset.playlistType || "regular";
        const seasonIndex = parseInt(button.dataset.seasonIndex || "0", 10);
        const episodeIndex = parseInt(button.dataset.episodeIndex || "0", 10);
        playEpisode(type, seasonIndex, episodeIndex);
      });
    }
  });

  // Hide video player on any button click (except close button and play buttons)
  document.addEventListener("click", function (event) {
    const videoCard = document.querySelector("#video-player-card");
    const closeButton = document.querySelector("#close-video-btn");
    const target = event.target;

    // Don't hide if clicking the close button or if video card is already hidden
    if (
      !videoCard ||
      videoCard.classList.contains("hidden") ||
      target === closeButton ||
      closeButton?.contains(target)
    ) {
      return;
    }

    // Don't hide if clicking within the video player overlay
    if (videoCard.contains(target)) {
      return;
    }

    // Don't hide if clicking a play button
    const isPlayButton =
      target.closest(".btn") &&
      (target.textContent?.includes("Play") ||
        target.closest(".btn")?.textContent?.includes("Play"));

    if (isPlayButton) {
      return;
    }

    // Hide video player on any other click
    if (!videoCard.classList.contains("hidden")) {
      hideVideoPlayer();
    }
  });

  // Add click handler to video overlay to prevent clicks from propagating
  const videoCard = document.querySelector("#video-player-card");
  if (videoCard) {
    videoCard.addEventListener("click", function (event) {
      // Only allow clicks on the close button
      const closeButton = document.querySelector("#close-video-btn");
      const target = event.target;

      if (target === closeButton || closeButton?.contains(target)) {
        return; // Allow close button clicks
      }

      // Stop all other clicks from propagating
      event.stopPropagation();
    });
  }
}

// Legacy functions (kept for compatibility)
export function playvideo() {
  // Ensure show1 is set to 1 and restart player if needed
  show1 = 1;
  showVideoPlayer();
}

export function toggleDynaWarn() {
  // Ensure show1 is set to 1 and restart player if needed
  show1 = 1;
  showVideoPlayer();
}

export function playepisode(
  dataid,
  episode,
  index,
  type
) {
  // Ensure show1 is set to 1 and restart player if needed
  show1 = 1;
  // For legacy compatibility, assume season index is 0 if not provided
  // In the future, this should be updated to pass the actual season
  playEpisode(type || "regular", 0, index || 0);
}
