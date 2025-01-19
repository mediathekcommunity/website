/**
 * Copyright (c) 2022 The Nuevodevel Team. All rights reserved.
 * Morevideo plugin for video.js
 * Version 2.0.0
 */
/* eslint-disable */ import videojs from 'video.js';
const onPlayerReady = function (e, s) {
		var i = function (e, s, i) {
			var r = document.createElement(e);
			if (void 0 !== s) if ('' !== s) r.className = s;
			if (void 0 !== i) if ('' !== i) r.innerHTML = i;
			return r;
		};
		if (Array.isArray(s))
			if (!(s.length < 2)) {
				var r = videojs.dom,
					l = e.el(),
					t = 0,
					a = 0,
					o = 1,
					d = 1,
					v = 0,
					n = null,
					c = null,
					f = null,
					h = null,
					m = !1,
					p = null,
					u = null,
					j = null,
					y = null,
					C = null;
				window.addEventListener('resize', x);
				e.on('playerresize', function () {
					x();
				});
				e.one('playing', function () {
					if (null === u) {
						var b = i('div', 'vjs-more-button');
						b.innerHTML =
							'<span class="svg"><svg viewBox="0 0 448 448" xmlns="http://www.w3.org/2000/svg"><path d="M128 312v48c0 13-11 24-24 24H24c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm0-128v48c0 13-11 24-24 24H24c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zM128 56v48c0 13-11 24-24 24H24c-13 0-24-11-24-24V56c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zM288 56v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24V56c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm0-128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24V56c0-13 11-24 24-24h80c13 0 24 11 24 24z"></path></svg></span>' +
							e.localize('More videos');
						var w = l.querySelector('.vjs-control-bar');
						w.insertBefore(b, w.firstChild);
						u = i('div', 'vjs-more-video vjs-hidden');
						b.onclick = function (e) {
							e.preventDefault();
							e.stopImmediatePropagation();
							r.removeClass(u, 'vjs-hidden');
							m = !1;
							x();
							g();
							r.removeClass(l, 'vjs-more-touch');
							r.addClass(b, 'vjs-hidden');
						};
						b.addEventListener(
							'touchstart',
							function (e) {
								e.stopImmediatePropagation();
								r.removeClass(u, 'vjs-hidden');
								r.addClass(b, 'vjs-hidden');
								r.addClass(p, 'more-anim-touch');
								r.addClass(l, 'vjs-more-touch');
								m = !0;
								x();
								g();
							},
							{ passive: !0 }
						);
						var k = i('div', 'vjs-more-header');
						k.innerHTML = '<span>' + e.localize('More videos') + '...</span>';
						var q = i('div', 'vjs-more-close');
						k.appendChild(q);
						u.appendChild(k);
						C = i('div', 'vjs-more-inside');
						(y = i('div', 'vjs-more-line')).innerHTML =
							'</div><div class="vjs-more-arrow vjs-more-arrow-prev vjs-disabled"><div class="vjs-prev"></div></div><div class="vjs-more-arrow vjs-more-arrow-next vjs-disabled"><div class="vjs-next"></div></div>';
						c = y.querySelector('.vjs-more-arrow-next');
						n = y.querySelector('.vjs-more-arrow-prev');
						p = i('div', 'vjs-more-list');
						C.appendChild(y);
						y.appendChild(p);
						u.appendChild(C);
						w.insertBefore(u, w.firstChild);
						q.onclick = q.ontouchend = function (e) {
							e.preventDefault();
							e.stopImmediatePropagation();
							r.addClass(u, 'vjs-hidden');
							r.removeClass(b, 'vjs-hidden');
							r.removeClass(l, 'vjs-more-touch');
						};
						var S = 0.97 * e.controlBar.el_.offsetWidth,
							M = S - 80;
						p.style.left = '40px';
						var z = 6;
						if (S < 1020) z = 5;
						if (S < 830) z = 4;
						if (S < 600) z = 3;
						if (S < 400) z = 2;
						v = z;
						d = 1;
						var W = parseInt(M / z, 10),
							_ = parseInt(0.5625 * W, 10);
						p.style.maxWidth = W * z + 'px';
						y.style.height = _ + 'px';
						C.style.height = _ + 16 + 'px';
						j = i('div', 'more-block');
						p.appendChild(j);
						t = s.length;
						a = Math.ceil(t / z);
						for (var I = 0; I < t; I++) {
							var H = i('div');
							if (0 === I) H.className = 'more-item-parent vjs-more-first';
							else H.className = 'more-item-parent';
							H.style.width = W + 'px';
							var P = i('div');
							P.className = 'more-item';
							H.style.left = I * W + 'px';
							H.appendChild(P);
							j.appendChild(H);
							P.innerHTML =
								'<a target="_blank" href="' +
								s[I].url +
								'" title="' +
								s[I].title +
								'"><span class="more-item-bg" style="background-image:url(' +
								s[I].thumb +
								');"></span><label>' +
								s[I].title +
								'</label><i>' +
								s[I].duration +
								'</i></a>';
						}
						f = y.querySelector('.vjs-more-arrow-next');
						h = y.querySelector('.vjs-more-arrow-prev');
						g();
						f.onclick = function (e) {
							e.stopImmediatePropagation();
							L();
						};
						h.onclick = function (e) {
							e.stopImmediatePropagation();
							N();
						};
					}
					function L() {
						if (!(c.className.indexOf('vjs-disabled') > -1)) {
							var e = 0.97 * l.offsetWidth,
								s = 6;
							if (e < 1020) s = 5;
							if (e < 830) s = 4;
							if (e < 600) s = 3;
							if (e < 400) s = 2;
							v = s;
							var i = p.offsetWidth,
								f = p.querySelector('.vjs-more-first').offsetWidth * t;
							a = Math.ceil(t / v);
							var h = f - i;
							o = Math.ceil(d / v);
							if (o !== a) {
								d = v * (++o - 1) + 1;
								var m = (o - 1) * i;
								if (m > h) m = h;
								u.querySelector('.more-block').style.left = '-' + m + 'px';
								if (o === a) r.addClass(c, 'vjs-disabled');
								r.removeClass(n, 'vjs-disabled');
							} else {
								r.addClass(c, 'vjs-disabled');
								r.removeClass(n, 'vjs-disabled');
							}
						}
					}
					function N() {
						if (!(n.className.indexOf('vjs-disabled') > -1)) {
							var e = p.offsetWidth,
								s = 0.97 * l.offsetWidth,
								i = 6;
							if (s < 1020) i = 5;
							if (s < 830) i = 4;
							if (s < 600) i = 3;
							if (s < 400) i = 2;
							v = i;
							a = Math.ceil(t / v);
							o = Math.ceil(d / v);
							if (1 !== o) {
								d = v * ((o -= 1) - 1) + 1;
								var f = (o - 1) * e;
								u.querySelector('.more-block').style.left = '-' + f + 'px';
								if (1 === o) r.addClass(n, 'vjs-disabled');
								r.removeClass(c, 'vjs-disabled');
							}
						}
					}
				});
				return this;
			}
		function x() {
			if (null !== u) {
				var s = 0.97 * e.controlBar.el_.offsetWidth,
					i = s;
				if (m) p.style.left = 0;
				else {
					i = s - 80;
					p.style.left = '40px';
				}
				var l = 6;
				if (s < 1020) l = 5;
				if (s < 830) l = 4;
				if (s < 600) l = 3;
				if (s < 400) l = 2;
				v = l;
				var x = parseInt(i / l, 10);
				p.style.maxWidth = x * l + 'px';
				var b = parseInt(0.5625 * x, 10);
				if (o > a) {
					o = a;
					r.addClass(c, 'vjs-disabled');
				} else r.removeClass(c, 'vjs-disabled');
				var w = p.offsetWidth,
					k = x * t - w,
					q = (d - 1) * x;
				if (q > k) q = k;
				j.style.left = '-' + q + 'px';
				y.style.height = b + 'px';
				C.style.height = b + 16 + 'px';
				for (var S = 0, M = j.children, z = 0; z < M.length; z++) {
					M[z].style.width = x + 'px';
					M[z].style.left = S + 'px';
					S += x;
				}
				if (m) {
					r.addClass(h, 'vjs-hidden');
					r.addClass(f, 'vjs-hidden');
				} else {
					r.removeClass(h, 'vjs-hidden');
					r.removeClass(f, 'vjs-hidden');
				}
				var W = x * t;
				p.style.width = W + 'px';
				if (W <= i) {
					r.addClass(n, 'vjs-hidden');
					r.addClass(c, 'vjs-hidden');
				}
				g();
			}
		}
		function g() {
			var s = 30,
				i = u.offsetHeight + 5,
				r = l.offsetWidth;
			if (e.el_.querySelector('.vjs-skin-shaka ') && r > 1080) {
				s = 40;
				i += 10;
			}
			if (e.el_.querySelector('.vjs-skin-treso'))
				if (r > 1080) {
					s = 60;
					i += 30;
				} else {
					s = 50;
					i += 15;
				}
			if (e.el_.querySelector('.vjs-skin-roundal')) {
				s += 5;
				i += 5;
			}
			if (e.el_.querySelector('.vjs-skin-nuevo')) s = 35;
			if (e.el_.querySelector('.vjs-skin-party'))
				if (r > 1080) {
					s = 40;
					i += 10;
				} else {
					s = 30;
					i += 5;
				}
			if (e.el_.querySelector('.vjs-skin-mockup'))
				if (r > 1080) {
					s = 80;
					i += 50;
				} else {
					s = 60;
					i += 30;
				}
			if (e.el_.querySelector('.vjs-skin-jwlike'))
				if (r > 1080) {
					s = 45;
					i += 15;
				} else {
					s = 35;
					i += 5;
				}
			if (e.el_.querySelector('.vjs-skin-chrome')) {
				s = 40;
				i += 10;
			}
			u.style.top = 0;
			l.querySelector('.vjs-more-button').style.top = '-' + s + 'px';
			u.style.top = '-' + parseInt(i, 10) + 'px';
		}
	},
	morevideo = function (e) {
		this.ready(() => {
			onPlayerReady(this, e);
		});
	};
if ('undefined' !== typeof window) {
	(videojs.registerPlugin || videojs.plugin)('morevideo', morevideo);
}
export default morevideo;
