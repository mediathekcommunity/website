/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * Triler plugin for video.js
 * Version 1.5.0
 */
/* eslint-disable */ import videojs from "video.js";

const onPlayerReady = (e, t) => {
		var i,
			r = {
				title: "",
				url: "",
				target: "",
				src: "",
				type: null,
				start: 0,
				loop: !0,
				maxDuration: 60,
				buttonText: "Watch Now...",
			};
		try {
			t = videojs.obj.merge(r, t || {});
		} catch (e) {
			t = videojs.mergeOptions(r, t || {});
		}
		var a = "undefined",
			n = 0,
			l = 0,
			o = !1,
			s = !1;
		if ("" !== t.src) {
			(a = document.createElement("video")).preload = "auto";
			a.src = t.src;
			if (t.type) a.type = t.type;
			if (t.loop) a.setAttribute("loop", "true");
			a.setAttribute("webkit-playsinline", "");
			a.setAttribute("playsinline", "true");
			a.setAttribute("role", "application");
			a.muted = !0;
			a.load();
			a.onloadeddata = () => {
				n = a.duration;
			};
			a.onerror = () => {
				o = !0;
			};
		} else o = !0;
		function u() {
			if (e.duration() === 1 / 0) return !0;
			else if ("8" === videojs.browser.IOS_VERSION && 0 === e.duration())
				return !0;
			return !1;
		}
		e.liveTime = 0;
		var d,
			c = !1;
		function v() {
			e.liveTime = e.liveTime + 0.5;
			d = setTimeout(v, 500);
		}
		e.on("pause", () => {
			clearTimeout(d);
			c = !1;
		});
		e.on("playing", () => {
			var t = e.el().className.indexOf("vjs-has-started"),
				i = e.el().className.indexOf("vjs-live");
			if (!0 !== c && t > -1 && i > -1) {
				c = !0;
				d = setTimeout(v, 500);
			}
		});
		e.on("ended", () => {
			if (i) e.el_.removeChild(i);
		});
		e.one("play", () => {
			if (o) return !1;
			l = parseInt(t.start, 10);
			e.on("timeupdate", () => {
				var r = 0;
				if (n > 60) n = 60;
				if (u()) {
					if (0 === l) return;
					r = e.liveTime;
				} else {
					if (0 === l)
						if (trailer.duration < e.duration)
							l = parseInt(e.duration() - n - 5, 10);
						else l = 5;
					r = e.currentTime();
				}
				if (r > l && !0 !== s) {
					s = !0;
					(i = document.createElement("div")).className =
						"vjs-trailer vjs-trail-trans vjs-trailer-show";
					var o = document.createElement("div");
					o.className = "trailer-video-el";
					i.appendChild(o);
					o.appendChild(a);
					if ("" !== t.title) {
						var d = document.createElement("div");
						d.className = "vjs-vid-title";
						d.innerHTML = t.title;
						o.appendChild(d);
					}
					if ("" !== t.url) {
						var c = document.createElement("a");
						c.className = "vjs-watch-now";
						c.innerHTML = t.buttonText;
						c.href = t.url;
						c.target = t.target;
						o.appendChild(c);
					}
					var v = document.createElement("div");
					v.setAttribute("role", "button");
					v.className = "vjs-trailer-close";
					v.innerHTML =
						'<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';
					o.appendChild(v);
					e.el_.appendChild(i);
					var f = 0;
					a.src = t.src;
					a.mute = !0;
					a.play();
					var p = setInterval(() => {
						if (f > 0.99) clearInterval(p);
						i.style.opacity = f;
						f += 0.1;
					}, 10);
					v.onclick = (t) => {
						t.preventDefault();
						t.stopImmediatePropagation();
						if (i) e.el_.removeChild(i);
					};
					if (t.maxDuration > 0)
						if (i)
							a.ontimeupdate = () => {
								if (a.currentTime > t.maxDuration) {
									a.pause();
									if (i) e.el_.removeChild(i);
									i = null;
								}
							};
					a.onended = () => {
						if (!0 !== t.loop) {
							var r = i;
							r.style.opacity = 1;
							var a = 1,
								n = setInterval(() => {
									if (a < 0.1) {
										clearInterval(n);
										if (r) e.el_.removeChild(r);
									}
									if (r) r.style.opacity = a;
									a -= 0.1;
								}, 30);
						}
					};
				}
			});
		});
		return this;
	},
	trailer = function (e) {
		this.ready(() => {
			onPlayerReady(this, e);
		});
	};
var registerPlugin = videojs.registerPlugin || videojs.plugin;
registerPlugin("trailer", trailer);
export default trailer;
