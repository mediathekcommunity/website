/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * LiveClock plugin for video.js
 * Version 1.0.0
 */
/* eslint-disable */ import videojs from "video.js";

const defaults = {
		position: "controlbar",
		direction: "left",
		offsetV: 15,
		offsetH: 15,
		background: "rgba(0,0,0,.5)",
		fontSize: 16,
		hours: 12,
		locale: "en-US",
		timeZone: "",
		seconds: !1,
		seekable: !0,
	},
	onPlayerReady = (A, e) => {
		var o,
			i = null,
			t = !1,
			n = !1,
			l = "";
		A.timeZone = (A) => {
			e.timeZone = A;
			if (i) s();
		};
		A.clockLocale = (A) => {
			e.locale = A;
		};
		A.clockHours = (A) => {
			if (24 === A || 12 === A) {
				e.hours = A;
				if (i) s();
			}
		};
		A.clockSeconds = (A) => {
			e.seconds = A;
			if (i) s();
		};
		function s() {
			var A = new Date(),
				o = !0,
				t = "";
			if (24 === e.hours) o = !1;
			if ("" !== e.timeZone)
				if (e.seconds)
					t = A.toLocaleString(e.locale, {
						timeZone: e.timeZone,
						hour: "numeric",
						minute: "numeric",
						second: "numeric",
						hour12: o,
					});
				else
					t = A.toLocaleString(e.locale, {
						timeZone: e.timeZone,
						hour: "numeric",
						minute: "numeric",
						hour12: o,
					});
			else if (e.seconds)
				t = A.toLocaleString(e.locale, {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					hour12: o,
				});
			else
				t = A.toLocaleString(e.locale, {
					hour: "numeric",
					minute: "numeric",
					hour12: o,
				});
			i.innerHTML = t;
		}
		function c() {
			if (i) {
				s();
				clearTimeout(o);
				o = setTimeout(c, 1e3);
			}
		}
		A.on("playing", () => {
			if (i) i.classList.remove("vjs-hidden");
		});
		A.on("loadeddata", () => {
			if (l !== A.currentSrc()) {
				l = A.currentSrc();
				a();
			}
		});
		A.one("play", () => {
			a();
		});
		function r() {
			if (videojs.dom.hasClass(A.el(), "vjs-liveui")) t = !0;
			if (videojs.dom.hasClass(A.el(), "vjs-live")) n = !0;
			if (n) if (!0 !== t || !0 === e.seekable) return !0;
			return !1;
		}
		function a() {
			if (videojs.dom.hasClass(A.el(), "vjs-liveui")) t = !0;
			if (videojs.dom.hasClass(A.el(), "vjs-live")) n = !0;
			if (!r()) if (i) i.classList.add("vjs-hidden");
			if (o) clearTimeout(o);
			if (r()) {
				if (!i) {
					var l =
							"@font-face{font-family:clock;src:url('data:font/woff;charset=utf-8;base64,d09GRgABAAAAAAQ4AA0AAAAABcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEHAAAABsAAAAclWCRe0dERUYAAAP8AAAAHgAAAB4AKQALT1MvMgAAAaQAAABGAAAAVmNwZjVjbWFwAAACAAAAAEMAAAFSADXv02dhc3AAAAP0AAAACAAAAAj//wADZ2x5ZgAAAlAAAACrAAAAwEBVZNRoZWFkAAABMAAAADIAAAA2Jtu0xGhoZWEAAAFkAAAAHQAAACQOugcGaG10eAAAAewAAAATAAAAFBKqAFVsb2NhAAACRAAAAAwAAAAMAAAAYG1heHAAAAGEAAAAHgAAACAASgA0bmFtZQAAAvwAAADcAAABa5oq/91wb3N0AAAD2AAAABwAAAAyaNltc3jaY2BkYGAA4mUtberx/DZfGbg5GEDg/j1TMyhtwxD6n4F9NVsokMvBwAQSBQAmRApNAAB42mNgZGBgC/3PwLCDgwEE2FczMDKgAlYASr8C1AAAAHjaY2BkYGBgZTBkYGYAASYgZmQAiTmA+QwAB84AfwAAeNpjYORgYJzAwMrAwGrMOpOBgVEOQjNfZ0hjEmJgYGJgZWaAAUYBBgQISHNNYXBgUHjJwJb2L41hB1soI1gNiAAAbVAJZwAAeNrjYIAAplUQmoOBIRQACI8BEgB42mNgYGBmgGAZBkYGEPAB8hjBfBYGAyDNAYRMYBmFlwz//yOz/j8WZ4HqAgNGNgY4lxGkh4kBFTBCrBrOAAD9CwjzAAAAAAAAAAAAAAAAYHjaY2BmCP3PwL6aLZSBn0GewYCBgUGAiUFFgYWBSUCIgUVBBUgzsQFpNSDfDCgupiooIs4qZmZupqauKmiipsTGvnrivz//Vv5rAuI/EycysjCGM9YBMYtU+ZV/z/+d+Pf8Snn5FUZJRgtGySt/lfQZQ+VdBATEFP7dNHIzYnwDVBvGyDIRZMYqhBlMm9A0Alne/xhMJVYJiMsrOAlMZjyjbGTEwAAARuM+ogB42m2OPWrDQBCFP9mSQ35I4cL14jIgIa3BhatUPoAL90YswkRoYW0fI20gVY6RA+QAvlKe5AUX9sLsfDO8mTfAC18k9C8hU3XhEQ/MI48xtJFTab4jZzzzG3mi6ixlkj6q8zRM9TzilWnkMe+8RU6l+YycMeMn8kT9P2r5ef0fULe+VtrgaDipvyOodM2p3QnW0nUchxykcLrVUlAqrxTXTZd6SU6lsFJYFlrgu+Pah8YZW5RmZQY/5WVe5ba0Utwes5VN4MB+MDda2BuydeGw952pivLO1D/cmDF6eNpjYGLAD1iBmJGBiYGZkYk1OSc/ORsAB3gCIgAAAAH//wACAAEAAAAMAAAAFgAAAAIAAQADAAQAAQAEAAAAAgAAAAB42mNgYGBkAIKrS9Q5QPT9e6ZmUNoGAD79BgAA') format('woff');font-weight:400;font-style:normal;font-display:swap}.vjs-clock:before{font-family:clock;content:'\\e900';padding-right:8px}",
						a = document.createElement("style");
					a.textContent = l;
					document.head.appendChild(a);
					(i = document.createElement("div")).className =
						"vjs-live-control vjs-clock vjs-hidden";
					i.style.textAlign = "left";
					i.style.padding = "0 8px";
					if ("controlbar" === e.position) {
						var f = A.controlBar.el().querySelector(".vjs-live-control");
						if (t)
							f = A.controlBar.el().querySelector(".vjs-seek-to-live-control");
						i.style.background = "transparent";
						f.parentNode.insertBefore(i, f.nextSibling);
					} else if ("overlay" === e.position) {
						i.style.position = "absolute";
						i.style.top = e.offsetV + "px";
						i.style.fontSize = e.fontSize + "px";
						i.style.background = e.background;
						i.style.color = "#fff";
						i.style.lineHeight = "24px";
						i.style.padding = "2px 6px";
						i.style.borderRadius = "4px";
						i.style.height = "auto";
						if ("right" === e.direction) i.style.right = e.offsetH + "px";
						else if ("left" === e.direction) i.style.left = e.offsetH + "px";
						A.el().appendChild(i);
					}
				}
				s();
				o = setTimeout(c, 1e3);
			}
		}
	},
	liveclock = function (A) {
		this.ready(function () {
			try {
				onPlayerReady(this, videojs.obj.merge(defaults, A));
			} catch (e) {
				onPlayerReady(this, videojs.mergeOptions(defaults, A));
			}
		});
	};
if ("undefined" !== typeof window)
	videojs.registerPlugin("liveclock", liveclock);
liveclock.VERSION = "1.0";
export default liveclock;
