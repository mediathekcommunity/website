import videojs from 'video.js';

/* eslint-disable */
const onPlayerReady = (player,options) => {

	 var def_options = {
	  controlbarButton:true
    };	

	try{
      options = videojs.obj.merge(def_options, options || {});
	}catch(e) {
	  options = videojs.mergeOptions(def_options, options || {});
	}
	var hasAirPlayAPISupport = window.WebKitPlaybackTargetAvailabilityEvent;
	//var hasAirPlayAPISupport =true;

   if (!player.controlBar) {
      return;
   }

   function existingAirPlayButton() {
	   var playerEl = player.el();
       return playerEl.querySelector('.vjs-airplay-button');
   }




	 if (options.controlbarButton && !existingAirPlayButton()) {
		

		  var btn = videojs.dom.createEl('button', { className: 'vjs-airplay-button vjs-control vjs-button' }, {'role':'button', 'type':'button', 'aria-disabled':'false' });

		  var air_btn= player.controlBar.addChild('button', {'el':btn});  
		 
		  air_btn.el_.innerHTML= '<span aria-hidden="true" class="vjs-icon-placeholder vjs-svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M859 179c19 0 38 8 53 23s23 33 23 54v461a76 76 0 0 1-76 75H706l-2-65h168V242H148l4 485h166v65H165c-19 0-38-8-53-21s-23-34-23-54V256c0-21 7-39 23-54s34-23 53-23zM282 909l230-232 230 232z"/></svg></span><span class="vjs-control-text" aria-live="polite">'+player.localize('Start AirPlay')+'</span>';

		  player.controlBar.el_.insertBefore(air_btn.el_, player.controlBar.getChild('fullscreenToggle').el_);

		   if (!hasAirPlayAPISupport) {
			 air_btn.hide();
		  }
		   reactToAirPlayAvailableEvents();
		   air_btn.el_.onclick=function() {
			   player.trigger('airPlayRequested');
		   }
		   air_btn.el_.ontouchstart=function(e) {
			   e.stopImmediatePropagation();
			   player.trigger('airPlayRequested');
		   }
		}
		
		function onAirPlayRequested(player) {

		   var mediaEl = player.el().querySelector('video, audio');

		   if (mediaEl && mediaEl.webkitShowPlaybackTargetPicker) {
			  mediaEl.webkitShowPlaybackTargetPicker();
		   }
		}

		
		player.on('airPlayRequested', onAirPlayRequested.bind(null, player));
		

		function getMediaEl() {
		  var playerEl = player.el();
		  return playerEl.querySelector('video, audio');
	   }

	   function reactToAirPlayAvailableEvents() {
				var mediaEl = getMediaEl(),

				if (!mediaEl || !hasAirPlayAPISupport) {
				return;
				}

				mediaEl.addEventListener('webkitplaybacktargetavailabilitychanged', function(event) {
					if (event.availability === 'available') {
						air_btn.show();
					} else {
						air_btn.hide();
					}
				});
		}
	 
}

const airplay = function(options) {
  this.ready(() => {
    onPlayerReady(this,options);
  });
};

const registerPlugin = videojs.registerPlugin || videojs.plugin;
// Register the plugin with video.js.
registerPlugin('airplay', airplay);

// Include the version number.
airplay.VERSION = '1.1';

export default airplay;