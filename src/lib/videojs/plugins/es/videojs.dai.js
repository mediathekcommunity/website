/**
 * @license
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * Google Dai Plugin for Video.js v8
 */
/* eslint-disable */
import videojs from 'video.js';


const defaults = {
	fallback: '',
	assetKey:'',
	source_id:'',
	video_id:'',
	liveApiKey:'',
	apiKey:'',
	debug:false
}

const registerPlugin = videojs.registerPlugin || videojs.plugin;


const onPlayerReady = (player, options) => {

		//var player = this;
		var tech = player.$('.vjs-tech');



		var streamManager;
		var isLiveStream=false;

		var current_ad = [];
		var autoplay=false;
		if(videojs.options.autoplay) autoplay=true;
		if(tech.getAttribute('autoplay')) autoplay=true;

		initPlayer();

		if (options.assetKey!=='') {
			requestLiveStream();
		} else if(options.source_id!=='' && options.video_id!=='') {
			requestVODStream();
		}

		function requestLiveStream() {
			  isLiveStream = true;
			  var streamRequest = new google.ima.dai.api.LiveStreamRequest();
			  streamRequest.assetKey = options.assetKey;
			  if(options.liveApiKey!=="") {
				streamRequest.apiKey = options.liveApiKey || '';
			  } else {
				streamRequest.apiKey = options.apiKey || '';
			  }
			  streamManager.requestStream(streamRequest);
		}

		function requestVODStream() {
			  isLiveStream = false;
			  var streamRequest = new google.ima.dai.api.VODStreamRequest();
			  streamRequest.contentSourceId = options.source_id;
			  streamRequest.videoId = options.video_id;
			  streamRequest.apiKey = options.apiKey || '';
			  streamManager.requestStream(streamRequest);
		}

		player.dai.requestVODStream = function(stream) {
			 isLiveStream = false;
			  //player.pause();
			  streamManager.reset();
			  player.reset();
			 
			  
			  videojs.dom.removeClass(player.el_,'vjs-dai');
			  videojs.dom.removeClass(player.el_,'vjs-ad-playing');
			  videojs.dom.removeClass(player.el_,'vjs-has-started');
			  videojs.dom.removeClass(player.el_,'vjs-playing');
			  videojs.dom.removeClass(player.bigPlayButton.el_,'vjs-no-pointer');
			  initPlayer()
			  var streamRequest = new google.ima.dai.api.VODStreamRequest();
			  
			  streamRequest.contentSourceId = stream.source_id;
			  streamRequest.videoId = stream.video_id;
			  streamRequest.apiKey =stream.apiKey || '';
			  streamManager.requestStream(streamRequest);
		}
		player.dai.requestLivetream = function(stream) {
			  isLiveStream = true;
			  streamManager.reset();
			  player.reset();
			  videojs.dom.removeClass(player.el_,'vjs-dai');
			  videojs.dom.removeClass(player.el_,'vjs-ad-playing');
			  videojs.dom.removeClass(player.el_,'vjs-has-started');
			  videojs.dom.removeClass(player.el_,'vjs-playing');
			  videojs.dom.removeClass(player.bigPlayButton.el_,'vjs-no-pointer');
			  //initPlayer();
			  var streamRequest = new google.ima.dai.api.LiveStreamRequest();
			  streamRequest.assetKey = stream.assetKey;
			  streamRequest.apiKey = stream.apiKey || '';
			  
			  streamManager.requestStream(streamRequest);
			  
		}

		function initPlayer() {

		  //adUiElement = document.getElementById('adUi');
		  streamManager = streamManager = new google.ima.dai.api.StreamManager(tech);
			 streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.LOADED,
				  onStreamLoaded,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.ERROR,
				  onStreamError,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.AD_PROGRESS,
				  onAdProgress,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.AD_BREAK_STARTED,
				  onAdBreakStarted,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.AD_BREAK_ENDED,
				  onAdBreakEnded,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.STARTED,
				  onAdStarted,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.FIRST_QUARTILE,
				  onAdFirstQuartile,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.MIDPOINT,
				  onAdMidpoint,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.THIRD_QUARTILE,
				  onAdThirdQuartile,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.COMPLETE,
				  onAdComplete,
				  false);
			  streamManager.addEventListener(
				  google.ima.dai.api.StreamEvent.Type.CLICK,
				  onAdClick,
				  false);
		}
		function onAdFirstQuartile(e) {
			 player.trigger('dai', {'ad':current_ad, 'type':"firstQuartile" });
		}
		function onAdMidpoint(e) {
			player.trigger('dai', {'ad':current_ad, 'type':"midpoint" });
		}
		function onAdThirdQuartile(e) {
			player.trigger('dai', {'ad':current_ad, 'type':"thirdQuartile" });
		}
		function onAdComplete(e) {
			player.trigger('dai', {'ad':current_ad, 'type':"complete" });
		}
		function onAdClick(e) {
			player.trigger('dai', {'ad':current_ad, 'type':"adClick" });
		}
		function onStreamLoaded(e) {

				player.textTracks().addEventListener('addtrack', function (e) {
				
					var track = e.track;
			
					if (track.kind === 'metadata') {
					// a cuechange event fires when the player crosses over an ID3 tag
						track.addEventListener("cuechange", function(event) {
							if(options.debug) {
								console.log(track.activeCues[0]);
							}
							var elemTrack = track.activeCues[0];
							if (elemTrack && elemTrack.value.data) {
								var metadata = {};
								metadata[elemTrack.value.key] = elemTrack.value.data;
								metadata["duration"] = Infinity;
								streamManager.onTimedMetadata(metadata);
							}

						},false);
					};
				
				},false);
				

		   player.src(e.getStreamData().url);
		   if(autoplay) {
			   player.play();
		   }

		   

		}

		function onStreamError(e) {
		
			if(options.fallback!=='') {
				player.src(options.fallback);
			}
		}
		function onAdProgress(e) {
	
			if(isLiveStream!==true) {

			 var adProgressData = e.getStreamData().adProgressData;
			  var currentAdNum = adProgressData.adPosition;
			  var totalAds = adProgressData.totalAds;
			  var currentTime = adProgressData.currentTime;
			  var duration = adProgressData.duration;
			  var remainingTime = Math.floor(duration - currentTime);
			  var adLabel = player.controlBar.el_.querySelector('.vjs-vast-label');
			  if(totalAds===1) {
				adLabel.innerHTML = 'This Ad will end in ' + remainingTime + 's';
			  } else {
			  adLabel.innerHTML =
				  'Ad (' + currentAdNum + ' of ' + totalAds + ') ' + remainingTime + 's';
			  }

			}

		}
		function onAdBreakStarted(e) {
	
			toggleControls(true);
		}
		function onAdBreakEnded(e) {
		
			current_ad = "undefined";
			toggleControls(false);
		}
		function onAdStarted(e) {
			 var ad = e.getAd();
			 current_ad = [];
			 current_ad['id'] = ad.getAdId();
			 current_ad['title'] = ad.getTitle();
			 current_ad['duration'] = ad.getDuration();
			 current_ad['url'] = ad.g.g.u;
			 player.trigger('dai', {'ad':current_ad, 'type':"started" });
		}

		function toggleControls(status) {
		  var adLabel = player.controlBar.el_.querySelector('.vjs-vast-label');
		  if(status) {
			    videojs.dom.addClass(player.el_,'vjs-dai');
				if(isLiveStream) adLabel.innerHTML = 'Ad Playing';

		   } else {
			    videojs.dom.removeClass(player.el_,'vjs-dai');

				player.adPlaying=false;	
			
		   }

		}


};

		

const dai = function(options) {
  this.ready(() => {

	  try {
		onPlayerReady(this, videojs.obj.merge(defaults, options));
	  } catch(e) {
	    onPlayerReady(this, videojs.obj.merge(defaults, options));
	  }
  });
};

if (typeof window !== "undefined") {
	registerPlugin('dai', dai);
}

export default dai;