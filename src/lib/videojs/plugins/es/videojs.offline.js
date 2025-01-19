/**
 * Copyright (c) 2022 The Nuevodevel Team. All rights reserved.
 * Offline plugin for video.js
 * Version 2.0.0
 */
/* eslint-disable */ import videojs from 'video.js';
var defaults = {
	offlineImage: '',
	offlineTimeout: 30,
	liveTyle: '',
	offlineCountdown: !1,
	clock: 0,
	label: 'restart',
	loadTimeout: 0,
	resetMethod: 1
};
try {
	videojs.options.vhs.maxPlaylistRetries = 1;
} catch (e) {
	var oe = !0;
}
try {
	videojs.options.errorDisplay = !1;
} catch (e) {
	oe = !0;
}
var onPlayerReady = function (e, i) {
		function o(e) {
			return e.charAt(0).toUpperCase() + e.slice(1);
		}
		i.label = o(i.label);
		e.liveSource = function (e) {
			i.liveSource = e;
		};
		e.on('ready', function () {
			var o,
				t,
				n = videojs.dom,
				l = e.el(),
				r = null,
				f = null,
				s = function (e, i) {
					try {
						return e.querySelector(i);
					} catch (e) {
						return !1;
					}
				};
			i.liveSource = e.currentSource();
			if ('' != i.offlineImage) {
				var a = s(l, '.vjs-error-display');
				if (a) n.addClass(a, 'vjs-abs-hidden');
				(r = document.createElement('div')).className = 'vjs-poster';
				r.setAttribute(
					'style',
					'background-position: 50% 50%;background-repeat:no-repeat; background-size: contain;top:100%;z-index:15999;opacity:1!important;pointer-events:"none";background-color:#000;'
				);
				l.appendChild(r);
				r.style.backgroundImage = 'url(' + i.offlineImage + ')';
				r.style.height = 0;
				if (i.loadTimeout > 0)
					e.one('play', function () {
						t = setTimeout(function () {
							if (!e.isOffline) {
								e.isOffline = !0;
								v();
							} else clearTimeout(t);
						}, i.loadTimeout);
					});
				e.on('error', function () {
					if (!0 === e.paused())
						if (!e.isOffline) {
							var i = e.error();
							if (1 == i.code || 2 == i.code || 4 == i.code || 3 == i.code || -2 == i.code) {
								e.isOffline = !0;
								v();
							}
						}
				});
				setInterval(function () {
					if (!e.isOffline) {
						var i = l.className;
						if (i.indexOf('vjs-has-started') > -1)
							if (i.indexOf('vjs-ended') > -1) {
								e.isOffline = !0;
								v();
							}
					}
				}, 500);
				e.on('playing', function () {
					r.style.height = 0;
					r.style.display = 'none';
					e.isOffline = !1;
					if (!0 !== videojs.browser.IS_IOS) e.muted(!1);
					clearTimeout(o);
					clearTimeout(t);
					try {
						l.removeChild(f);
					} catch (e) {}
					f = null;
				});
			}
			function c() {
				r.setAttribute(
					'style',
					r.getAttribute('style') + ';top:0;height:100%;display:block!important'
				);
				if (i.offlineCountdown)
					if (null == f) {
						(f = document.createElement('div')).setAttribute(
							'style',
							'position:absolute;right:30px;bottom:25px;font-size:20px;color:#fff;font-family:sans-serif,Arial;text-shadow:1px 1px 1px #000;z-Index:16000'
						);
						l.appendChild(f);
					}
			}
			function u() {
				e.$('.vjs-tech').setAttribute('preload', 'auto');
				if (!i.liveSource) i.liveSource = e.currentSource();
				if (1 == i.resetMethod) {
					e.one('canplay', function () {
						e.play();
					});
					e.src(i.liveSource);
					e.load();
					setTimeout(function () {
						e.play();
					}, 100);
				}
				if (2 === i.resetMethod) {
					e.src(i.liveSource);
					var o = e.play();
					if (void 0 !== o)
						o.then(function () {
							return !0;
						}).catch(function (i) {
							e.muted(!0);
							e.play();
						});
				}
				if (3 === i.resetMethod) {
					e.src(i.liveSource);
					e.load();
					setTimeout(function () {
						e.play();
					}, 100);
				}
			}
			function d() {
				c();
			}
			function p() {
				u();
			}
			function v() {
				e.isOffline = !0;
				var t = s(l, '.vjs-loading-spinner');
				n.addClass(t, 'vjs-abs-hidden');
				i.clock = 0;
				d();
				function r() {
					clearTimeout(o);
					o = setTimeout(function () {
						i.clock++;
						if (i.offlineCountdown && f)
							f.innerHTML = i.label + ' ' + y(i.offlineTimeout - i.clock);
						if (i.clock >= i.offlineTimeout) {
							i.clock = 0;
							e.trigger('offlineLoop');
							p();
						}
						r();
					}, 1e3);
				}
				if (i.offlineCountdown) if (null != f) f.innerHTML = i.label + ' ' + y(i.offlineTimeout);
				i.clock = 0;
				r();
			}
			function y(e) {
				var i = parseInt(e, 10),
					o = Math.floor(i / 60) % 60,
					t = i % 60,
					n = '';
				if (o > 0)
					if (o > 9) n = o + ':';
					else n = '0' + o + ':';
				else n = '0:';
				if (t > 0)
					if (t > 9) n += t;
					else n += '0' + t;
				else n = '0:00';
				return n;
			}
		});
		return this;
	},
	offline = function (e) {
		this.ready(function () {
			try {
				onPlayerReady(this, videojs.obj.merge(defaults, e));
			} catch (i) {
				onPlayerReady(this, videojs.mergeOptions(defaults, e));
			}
		});
	},
	registerPlugin = videojs.registerPlugin || videojs.plugin;
if ('undefined' != typeof window) registerPlugin('offline', offline);
offline.VERSION = '3.0';
export default offline;
