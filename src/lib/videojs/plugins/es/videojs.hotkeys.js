/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * Hotkeys plugin for video.js
 * Version 2.0.0
 */
/* eslint-disable */
import videojs from 'video.js';

const Plugin = videojs.getPlugin('plugin');

class Hotkeys extends Plugin {
	constructor(e, t) {
		super(e, t);

		// Wait for player to be ready before initializing hotkeys
		e.ready(() => {
			this.initialize(e, t);
		});
	}

	initialize(e, t) {
		const n = e.el();
		const r = document;

		// Define key handler functions first
		const playPauseKey = (e) => {
			return e.which === 32 || e.which === 179; // Space or Media Play/Pause key
		};

		const muteKey = (e) => {
			return e.which === 77; // M key
		};

		const fullscreenKey = (e) => {
			return e.which === 70; // F key
		};

		const captionsKey = (e) => {
			return e.which === 67; // C key
		};

		var i = {
			docKeys: !0,
			volumeStep: 0.1,
			seekStep: 5,
			enableMute: !0,
			enableCC: !1,
			enableRate: !0,
			enableRewindFroward: !0,
			enableVolume: !0,
			enableFullscreen: !0,
			enableNumbers: !0,
			enableJogStyle: !1,
			alwaysCaptureHotkeys: !0,
			captureDocumentHotkeys: !1,
			documentHotkeysFocusElementFilter: function () {
				return !1;
			},
			enableModifiersForNumbers: !0,
			enableInactiveFocus: !0,
			skipInitialFocus: !1,
			playPauseKey: playPauseKey,
			muteKey: muteKey,
			fullscreenKey: fullscreenKey,
			captionsKey: captionsKey,
			customKeys: {}
		};

		videojs.options.blockKeys = !1;

		var o = !1,
			l = 1,
			s = 6,
			u = 7,
			a = 8;

		try {
			t = videojs.obj.merge(i, t);
		} catch (e) {
			t = videojs.mergeOptions(i, t);
		}

		if (!n.hasAttribute('tabIndex')) {
			n.setAttribute('tabIndex', '-1');
		}

		n.style.outline = 'none';

		if (t.alwaysCaptureHotkeys || !e.autoplay()) {
			if (!t.skipInitialFocus) {
				e.one('play', function () {
					n.focus();
				});
			}
		}

		// Handle hotkey events
		const handleHotkeys = (event) => {
			// Only handle hotkeys if player has controls
			if (!e.controls()) return;

			const keyCode = event.which || event.keyCode;

			// Prevent default for supported keys
			if ([32, 37, 38, 39, 40, 70, 77].includes(keyCode)) {
				event.preventDefault();
			}

			// Play/Pause
			if (t.playPauseKey(event)) {
				if (e.paused()) {
					e.play();
				} else {
					e.pause();
				}
			}

			// Mute
			if (t.muteKey(event) && t.enableMute) {
				e.muted(!e.muted());
			}

			// Fullscreen
			if (t.fullscreenKey(event) && t.enableFullscreen) {
				if (e.isFullscreen()) {
					e.exitFullscreen();
				} else {
					e.requestFullscreen();
				}
			}

			// Volume
			if (t.enableVolume) {
				if (keyCode === 38) {
					// Up arrow
					e.volume(Math.min(e.volume() + t.volumeStep, 1));
				}
				if (keyCode === 40) {
					// Down arrow
					e.volume(Math.max(e.volume() - t.volumeStep, 0));
				}
			}

			// Seek
			if (t.enableRewindFroward) {
				if (keyCode === 37) {
					// Left arrow
					e.currentTime(Math.max(e.currentTime() - t.seekStep, 0));
				}
				if (keyCode === 39) {
					// Right arrow
					e.currentTime(Math.min(e.currentTime() + t.seekStep, e.duration()));
				}
			}
		};

		// Add event listeners
		e.on('keydown', handleHotkeys);

		// Cleanup on dispose
		e.on('dispose', function () {
			e.off('keydown', handleHotkeys);
		});
	}
}

if ('undefined' != typeof window) {
	videojs.registerPlugin('hotkeys', Hotkeys);
}

export default Hotkeys;
