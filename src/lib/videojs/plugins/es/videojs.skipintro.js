/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * SkipIntro plugin for video.js
 * Version 1.0.0
 */
/* eslint-disable */ import videojs from 'video.js';
const defaults = { skipStart: 0, skipDuration: 5, skipTarget: 0, skipText: 'Skip Intro' };
window.skipintro = { version: '1.0' };
const onPlayerReady = (i, t) => {
		try {
			t = videojs.obj.merge(defaults, t);
		} catch (i) {
			t = videojs.mergeOptions(defaults, t);
		}
		let e,
			r = !1;
		if (t.skipStart > 0 && t.skipDuration > 0 && t.skipTarget > 0) {
			(e = document.createElement('div')).className = 'vast-skip-button vjs-hidden';
			e.innerHTML = '<p class="vast-skip-button-text">' + t.skipText + '</p>';
			e.style.cursor = 'pointer';
			e.tabIndex = 0;
			e.role = 'button';
			e.ariaDisabled = 'false';
			i.el().appendChild(e);
			if (t.skipStart + t.skipDuration > t.skipTarget) t.skipDuration = t.skipTarget - t.skipStart;
			i.on('timeupdate', function () {
				if (i.currentTime() > t.skipTarget) {
					r = !0;
					i.el().removeChild(e);
				}
				if (!0 !== r) {
					if (i.currentTime() > t.skipStart && i.currentTime() < t.skipStart + t.skipDuration) {
						videojs.dom.removeClass(e, 'vjs-hidden');
						e.onkeydown = function (i) {
							i.preventDefault();
							i.stopPropagation();
							e.click();
						};
						e.onclick = function () {
							r = !0;
							i.currentTime(t.skipTarget);
							i.el().removeChild(e);
						};
					}
					if (i.currentTime() > t.skipStart + t.skipDuration) {
						r = !0;
						i.el().removeChild(e);
					}
				}
			});
		}
		return this;
	},
	skipintro = function (i) {
		this.ready(function () {
			onPlayerReady(this, i);
		});
	};
if ('undefined' !== typeof window) videojs.registerPlugin('skipintro', skipintro);
skipintro.VERSION = '1.0';
export default skipintro;
