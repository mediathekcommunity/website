/**
 * Copyright (c) 2022 The Nuevodevel Team. All rights reserved.
 * Morevideo plugin for video.js
 * Version 2.5.0
 */
/* eslint-disable */ import videojs from "video.js";

const onPlayerReady = function (p, f, e) {
		const h = { onpause: !1, oneshow: !1, target: "_blank" };
		e && e.onpause && (h.onpause = !0);
		function u(e, s, t) {
			e = document.createElement(e);
			"undefined" !== typeof s && "" !== s && (e.className = s);
			"undefined" !== typeof t && "" !== t && (e.innerHTML = t);
			return e;
		}
		if (Array.isArray(f) && !(f.length < 2)) {
			var m = videojs.dom,
				j = p.el(),
				y = 0,
				x = 0,
				C = 1,
				g = 1,
				b = 0,
				k = null,
				w = null,
				q = null,
				S = null,
				M = !1,
				_ = null,
				z = null,
				W = null,
				I = null,
				H = null;
			p.on("playerresize", () => {
				P();
			});
			p.one("playing", () => {
				if (null === z) {
					var s = u("div", "vjs-more-button"),
						e =
							((s.innerHTML =
								'<span class="svg"><svg viewBox="0 0 448 448" xmlns="http://www.w3.org/2000/svg"><path d="M128 312v48c0 13-11 24-24 24H24c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm0-128v48c0 13-11 24-24 24H24c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zM128 56v48c0 13-11 24-24 24H24c-13 0-24-11-24-24V56c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zM288 56v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24V56c0-13 11-24 24-24h80c13 0 24 11 24 24zm160 128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24v-48c0-13 11-24 24-24h80c13 0 24 11 24 24zm0-128v48c0 13-11 24-24 24h-80c-13 0-24-11-24-24V56c0-13 11-24 24-24h80c13 0 24 11 24 24z"></path></svg></span>' +
								p.localize("More videos")),
							j.querySelector(".vjs-control-bar"));
					h.onpause || e.insertBefore(s, e.firstChild);
					z = u("div", "vjs-more-video vjs-more-hidden");
					p.on("play", () => {});
					s.onclick = (e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						n(!1);
					};
					p.on("pause", () => {
						h.onpause && !h.oneshow && n();
					});
					p.on("play", () => {
						h.onpause && d();
					});
					s.addEventListener(
						"touchstart",
						(e) => {
							e.stopImmediatePropagation();
							n(!0);
						},
						{ passive: !0 },
					);
					var t = u("div", "vjs-more-header"),
						o =
							((t.innerHTML =
								"<span>" + p.localize("More videos") + "...</span>"),
							u("div", "vjs-more-close"));
					t.appendChild(o);
					z.appendChild(t);
					H = u("div", "vjs-more-inside");
					(I = u("div", "vjs-more-line")).innerHTML =
						'</div><div class="vjs-more-arrow vjs-more-arrow-prev vjs-disabled"><div class="vjs-prev"></div></div><div class="vjs-more-arrow vjs-more-arrow-next vjs-disabled"><div class="vjs-next"></div></div>';
					w = I.querySelector(".vjs-more-arrow-next");
					k = I.querySelector(".vjs-more-arrow-prev");
					_ = u("div", "vjs-more-list");
					H.appendChild(I);
					I.appendChild(_);
					z.appendChild(H);
					e.insertBefore(z, e.firstChild);
					o.onclick = o.ontouchend = (e) => {
						e.preventDefault();
						e.stopImmediatePropagation();
						h.oneshow = !0;
						d();
					};
					(t = 0.97 * p.controlBar.el_.offsetWidth),
						(e = t - 80),
						(o = ((_.style.left = "40px"), 6));
					t < 1020 && (o = 5);
					t < 830 && (o = 4);
					t < 600 && (o = 3);
					b = o = t < 400 ? 2 : o;
					g = 1;
					var i = parseInt(e / o, 10),
						t = parseInt(0.5625 * i, 10);
					_.style.maxWidth = i * o + "px";
					I.style.height = t + "px";
					H.style.height = t + 16 + "px";
					W = u("div", "more-block");
					_.appendChild(W);
					y = f.length;
					x = Math.ceil(y / o);
					for (var l = 0; l < y; l++) {
						var r = u("div");
						r.className =
							0 === l ? "more-item-parent vjs-more-first" : "more-item-parent";
						r.style.width = i + "px";
						var a = u("div");
						a.className = "more-item";
						r.style.left = l * i + "px";
						r.appendChild(a);
						W.appendChild(r);
						a.innerHTML =
							'<a target="' +
							h.target +
							'" href="' +
							f[l].url +
							'" title="' +
							f[l].title +
							'"><span class="more-item-bg" style="background-image:url(' +
							f[l].thumb +
							');"></span><label>' +
							f[l].title +
							"</label><i>" +
							f[l].duration +
							"</i></a>";
					}
					q = I.querySelector(".vjs-more-arrow-next");
					S = I.querySelector(".vjs-more-arrow-prev");
					L(!0);
					q.onclick = (e) => {
						e.stopImmediatePropagation();
						v();
					};
					S.onclick = (e) => {
						e.stopImmediatePropagation();
						c();
					};
				}
				function n(e) {
					m.removeClass(z, "vjs-more-hidden");
					e && m.addClass(_, "more-anim-touch");
					M = e;
					P();
					L();
					m.removeClass(j, "vjs-more-touch");
					m.addClass(s, "vjs-hidden");
				}
				function d() {
					m.addClass(z, "vjs-more-hidden");
					m.removeClass(s, "vjs-hidden");
					m.removeClass(j, "vjs-more-touch");
					z.style.top = "-5px";
				}
				function v() {
					if (!(w.className.indexOf("vjs-disabled") > -1)) {
						var e = 0.97 * j.offsetWidth,
							s = 6;
						e < 1020 && (s = 5);
						e < 830 && (s = 4);
						e < 600 && (s = 3);
						b = s = e < 400 ? 2 : s;
						(e = _.offsetWidth),
							(s = _.querySelector(".vjs-more-first").offsetWidth * y),
							(s = ((x = Math.ceil(y / b)), s - e));
						if ((C = Math.ceil(g / b)) === x) m.addClass(w, "vjs-disabled");
						else {
							g = b * (++C - 1) + 1;
							e = (C - 1) * e;
							e > s && (e = s);
							z.querySelector(".more-block").style.left = "-" + e + "px";
							C === x && m.addClass(w, "vjs-disabled");
						}
						m.removeClass(k, "vjs-disabled");
					}
				}
				function c() {
					if (!(k.className.indexOf("vjs-disabled") > -1)) {
						var e = _.offsetWidth,
							s = 0.97 * j.offsetWidth,
							t = 6;
						s < 1020 && (t = 5);
						s < 830 && (t = 4);
						s < 600 && (t = 3);
						b = t = s < 400 ? 2 : t;
						x = Math.ceil(y / b);
						C = Math.ceil(g / b);
						if (1 !== C) {
							g = b * ((C -= 1) - 1) + 1;
							s = (C - 1) * e;
							z.querySelector(".more-block").style.left = "-" + s + "px";
							1 === C && m.addClass(k, "vjs-disabled");
							m.removeClass(w, "vjs-disabled");
						}
					}
				}
			});
			return this;
		}
		function P() {
			if (null !== z) {
				var e = 0.97 * p.controlBar.el_.offsetWidth,
					s = e;
				if (M) _.style.left = 0;
				else {
					s = e - 80;
					_.style.left = "40px";
				}
				var t = 6;
				e < 1020 && (t = 5);
				e < 830 && (t = 4);
				e < 600 && (t = 3);
				b = t = e < 400 ? 2 : t;
				var o = parseInt(s / t, 10),
					e = ((_.style.maxWidth = o * t + "px"), parseInt(0.5625 * o, 10));
				if (C > x) {
					C = x;
					m.addClass(w, "vjs-disabled");
				} else m.removeClass(w, "vjs-disabled");
				var t = _.offsetWidth,
					t = o * y - t,
					i = (g - 1) * o;
				W.style.left = "-" + (i = i > t ? t : i) + "px";
				I.style.height = e + "px";
				H.style.height = e + 16 + "px";
				for (var l = 0, r = W.children, a = 0; a < r.length; a++) {
					r[a].style.width = o + "px";
					r[a].style.left = l + "px";
					l += o;
				}
				if (M) {
					m.addClass(S, "vjs-hidden");
					m.addClass(q, "vjs-hidden");
				} else {
					m.removeClass(S, "vjs-hidden");
					m.removeClass(q, "vjs-hidden");
				}
				t = o * y;
				_.style.width = t + "px";
				if (t <= s) {
					m.addClass(k, "vjs-hidden");
					m.addClass(w, "vjs-hidden");
				}
				L();
			}
		}
		function L(e) {
			h.onpause && (e = !1);
			var s = 30,
				t = 60,
				o = z.offsetHeight + 5,
				i = j.offsetWidth;
			i > 1080 && (t = 80);
			if (p.el_.querySelector(".vjs-skin-shaka ") && i > 1080) {
				s = 40;
				o += 10;
				t = 60;
			}
			if (p.el_.querySelector(".vjs-skin-treso")) {
				t = 65;
				i > 1080 && (t = 80);
				if (i > 1080) {
					s = 60;
					o += 30;
				} else {
					s = 50;
					o += 15;
				}
			}
			if (p.el_.querySelector(".vjs-skin-roundal")) {
				s += 5;
				o += 5;
				t = 55;
			}
			if (p.el_.querySelector(".vjs-skin-nuevo")) {
				s = 35;
				t = 55;
			}
			p.el_.querySelector(".vjs-skin-flow") && (t = 50);
			if (p.el_.querySelector(".vjs-skin-party")) {
				t = 50;
				if (i > 1080) {
					s = 40;
					o += 10;
				} else {
					s = 30;
					o += 5;
				}
			}
			if (p.el_.querySelector(".vjs-skin-mockup")) {
				t = 75;
				if (i > 1080) {
					s = 80;
					o += 50;
				} else {
					s = 60;
					o += 30;
				}
			}
			if (p.el_.querySelector(".vjs-skin-pinko")) {
				s += 5;
				o += 5;
				t = 50;
			}
			if (p.el_.querySelector(".vjs-skin-jwlike"))
				if (i > 1080) {
					s = 45;
					o += 15;
				} else {
					s = 35;
					o += 5;
				}
			if (p.el_.querySelector(".vjs-skin-chrome")) {
				t = 50;
				s = 40;
				o += 10;
			}
			z.style.top = 0;
			var l = j.querySelector(".vjs-more-button");
			l && (l.style.top = "-" + s + "px");
			if (h.onpause) {
				i > 1080 && (t = 80);
				z.style.top = "auto";
				z.style.bottom = t + "px";
			} else !0 !== e && (z.style.top = "-" + parseInt(o, 10) + "px");
		}
	},
	morevideo = function (e, s) {
		this.ready(() => {
			onPlayerReady(this, e, s);
		});
	};
if ("undefined" !== typeof window) {
	const Ea = videojs.registerPlugin || videojs.plugin;
	Ea("morevideo", morevideo);
}
export default morevideo;
