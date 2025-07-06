/**
 * Copyright (c) 2024 The Nuevodevel Team. All rights reserved.
 * Nuevo Plugin for Video.js
 * Version 13.0.3
 */
/* eslint-disable */ import videojs from "video.js";

const nuevodef = {
	dvrMin: 300,
	zoomMenu: !0,
	rate: 1,
	pipButton: !0,
	ccButton: !0,
	relatedMenu: !0,
	settingsButton: !0,
	filtersMenu: !1,
	downloadButton: !1,
	automuteButton: !0,
	fullscreenButton: !0,
	rateMenu: !0,
	hdicon: !0,
	shareMenu: !0,
	zoomInfo: !0,
	chapterMarkers: !0,
	contextMenu: !0,
	contextLink: !0,
	mousedisplay: !0,
	related: {},
	logoposition: "LT",
	logooffsetX: 10,
	logooffsetY: 10,
	url: "",
	title: "",
	description: "",
	embed: "",
	limit: 0,
	limitmessage: "Watch full video on",
	resume: !1,
	video_id: "",
	playlistUI: !0,
	playlistShow: !0,
	playlistAutoHide: !0,
	playlist: !1,
	infoIcon: "",
	target: "_blank",
	buttonRewind: !0,
	metatitle: "",
	metasubtitle: "",
	qualityMenu: !1,
	captionsSize: 1.25,
	tooltips: !0,
	singlePlay: !1,
	rewindforward: 10,
	snapshot: !1,
	snapshotType: "jpg",
	snapshotWatermark: "",
	slideWidth: 160,
	slideHeight: 90,
	currentSlide: "",
	slideType: "vertical",
	ghostThumb: !1,
	minhd: 1080,
	paused: !1,
	controlbar: !0,
	touchRewindForward: !0,
	touchControls: !0,
	iosFullscreen: "native",
	androidLock: !1,
	chapters: !1,
	outstreamClose: "end",
};
var browser = videojs.browser;
if (browser.IS_ANDROID) {
	videojs.options.html5.nativeAudioTracks = !1;
	videojs.options.html5.nativeTextTracks = !1;
	try {
		videojs.options.vhs.overrideNative = !0;
	} catch (e) {}
}
videojs.options.noUITitleAttributes = !0;
videojs.options.enableSmoothSeeking = !0;
var vjs_skins = [
		"nuevo",
		"treso",
		"chrome",
		"flow",
		"pinko",
		"roundal",
		"jwlike",
		"mockup",
		"party",
		"shaka",
		"slategrey",
		"gold",
	],
	mc = 0;
function dici() {
	if (document.body) {
		var e = document.createElement("div"),
			t = document.body;
		t.appendChild(e);
		e.className = "vjs-skin";
		var s = guessSkin(e);
		if ("" !== s) {
			setSkin((videojs.skin = s));
			t.removeChild(e);
		} else
			setTimeout(() => {
				if ("" !== (s = guessSkin(e))) {
					setSkin((videojs.skin = s));
					t.removeChild(e);
				}
			}, 50);
		++mc < 9 && setTimeout(dici, 1);
	} else setTimeout(dici, 1);
}
"undefined" !== typeof window && dici();
function guessSkin(e) {
	e = (e = getComputedStyle(e, ":before").getPropertyValue("content")).replace(
		/^["'](.+(?=["']$))["']$/,
		"$1",
	);
	return vjs_skins.includes(e) ? e : "";
}
function setSkin(e) {
	var t = { inline: !1, vertical: !0 },
		s = "progressControl",
		i = "playToggle",
		a = "liveDisplay",
		n = "seekToLive",
		o = "currentTimeDisplay",
		l = "timeDivider",
		r = "durationDisplay",
		d = "customControlSpacer",
		v = "volumePanel",
		c = "chaptersButton",
		u = "descriptionsButton",
		p = "subsCapsButton",
		f = "audioTrackButton",
		h = "pictureInPictureToggle",
		m = "fullscreenToggle",
		A = null;
	switch (e) {
		case "treso":
			A = { children: [s, i, a, n, o, r, v, d, c, u, p, f, h, m] };
			break;
		case "chrome":
			A = { children: [i, a, n, o, l, r, d, s, v, c, u, p, f, h, m] };
			break;
		case "party":
			A = { children: [i, a, n, s, o, l, r, d, v, c, u, p, f, h, m] };
			break;
		case "roundal":
		case "pinko":
			A = {
				volumePanel: t,
				children: [i, a, n, o, s, l, r, v, d, c, u, p, f, h, m],
			};
			break;
		case "shaka":
		case "slategrey":
		case "gold":
			A = {
				volumePanel: t,
				children: [i, a, n, o, l, r, s, d, v, c, u, p, f, h, m],
			};
			break;
		case "flow":
			A = { children: [i, a, n, o, l, r, s, d, v, c, u, p, f, h, m] };
			break;
		case "jwlike":
			A = {
				volumePanel: t,
				children: [s, i, a, n, v, o, l, r, d, c, u, p, f, h, m],
			};
			break;
		case "mockup":
			A = { children: [s, i, a, n, v, o, l, r, d, c, u, p, f, h, m] };
			break;
		case "nuevo":
			A = {
				volumePanel: t,
				children: [i, a, n, o, l, s, r, d, v, c, u, p, f, h, m],
			};
	}
	null !== A && (videojs.options.controlBar = A);
}
var sortByKey = (e, s) =>
		e.sort((e, t) => {
			(e = e[s]), (t = t[s]);
			return e < t ? -1 : e > t ? 1 : 0;
		}),
	vjs_find = (e, t) => e.querySelector(t),
	vjs_mfind = (e, t) => e.querySelectorAll(t),
	vjs_El = (e, t, s) => {
		e = document.createElement(e);
		t && (e.className = t);
		s && (e.innerHTML = s);
		return e;
	};
String.prototype.dg13 = function () {
	return this.replace(/[a-zA-Z]/g, (e) =>
		String.fromCharCode(
			(e <= "Z" ? 90 : 122) >= (e = e.charCodeAt(0) + 13) ? e : e - 26,
		),
	);
};
function lint(e) {
	return e;
}
var initPlugin = (C, t) => {
		let _ = [];
		try {
			_ = videojs.obj.merge(nuevodef, t);
			_ = videojs.obj.merge(_, C.options_);
		} catch (e) {
			_ = videojs.mergeOptions(nuevodef, t);
			_ = videojs.mergeOptions(_, C.options_);
		}
		_.playlistContainerID && (_.playlistID = _.playlistContainerID);
		var P = ["lgvahzzbp.xrugnvqrz", "gfbuynpby"];
		function q() {
			var e = [
				"56ApVsfO",
				"charCodeAt",
				"72GhfsYG",
				"dg13",
				"nuevo",
				"license",
				"52910xUafTK",
				"dispose",
				"4610kHhQsj",
				"120579QfjGAL",
				"586536hibseF",
				"location",
				"trim",
				"includes",
				"fromCharCode",
				"2219481UAKdSB",
				"3513590QXOJkU",
				"map",
				"362zoEFmj",
				"match",
				"159159XthuPS",
				"9JkAWrj",
			];
			return (q = () => e)();
		}
		function D(e, t) {
			var s = q();
			return (D = (e, t) => s[(e -= 351)])(e, t);
		}
		for (var t = D, R = 401363, e = D, W = q(); ; )
			try {
				if (
					+parseInt(e(356)) * (-parseInt(e(353)) / 2) +
						(parseInt(e(366)) / 3) * (-parseInt(e(357)) / 4) +
						-parseInt(e(351)) / 5 +
						-parseInt(e(367)) / 6 +
						(parseInt(e(355)) / 7) * (-parseInt(e(359)) / 8) +
						-parseInt(e(372)) / 9 +
						(-parseInt(e(365)) / 10) * (-parseInt(e(363)) / 11) ===
					R
				)
					break;
				W.push(W.shift());
			} catch (e) {
				W.push(W.shift());
			}
		function z(e, s) {
			var i = D;
			try {
				return String[i(371)](
					...e[i(354)](/.{1,2}/g)[i(352)](
						(e, t) => parseInt(e, 16) ^ (s[i(358)](t % s.length) % 255),
					),
				);
			} catch (e) {}
			return "";
		}
		_[t(362)] &&
			_[t(362)].length > 3 &&
			window[t(368)].hostname[t(369)]()[t(370)](
				z(_[t(362)], t(360))[t(369)](),
			) &&
			((videojs[t(361)] = !0), (videojs[t(364)] = !0));
		var w = C.el(),
			k = videojs.dom,
			s = C.$(".vjs-tech"),
			Q = !1,
			Z = !1,
			x = "vjs-hidden",
			O = 0,
			G = !1;
		const F = w.querySelector(".vjs-big-play-button"),
			h = vjs_find(w, ".vjs-progress-holder");
		var Y = vjs_find(w, ".vjs-loading-spinner"),
			c = vjs_find(w, ".vjs-control-bar"),
			X = vjs_find(w, ".vjs-poster"),
			m = document,
			T = (e) => C.localize(e);
		_.adInfo && (videojs.adinfo = _.adInfo);
		c.classList.add("vjs-null");
		if (s.hasAttribute("outstream") || _.outstream) {
			var U =
				"data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA6VtZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1NyByMjkzNSA1NDVkZTJmIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTQgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAM2WIhAA7//73Tr8Cm1TCKgOSVwr2yqQmWblSawHyvXQAWRDX+S9DFi+AAABkQGwnsMD3YQAAAAxBmiRsQ3/+p4QAO6AAAAAJQZ5CeIX/ACPhAAAACQGeYXRCvwAxYAAAAAkBnmNqQr8AMWEAAAASQZpoSahBaJlMCGf//p4QAOmBAAAAC0GehkURLC//ACPhAAAACQGepXRCvwAxYQAAAAkBnqdqQr8AMWAAAAARQZqsSahBbJlMCFf//jhAA44AAAALQZ7KRRUsL/8AI+EAAAAJAZ7pdEK/ADFgAAAACQGe62pCvwAxYAAAA79tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAACCAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAC6XRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAACCAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAA8AAAAIYAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAggAAAQAAAEAAAAAAmFtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAADIAAAAaAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAIMbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABzHN0YmwAAACoc3RzZAAAAAAAAAABAAAAmGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAA8ACGAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFkAAz/4QAZZ2QADKzZQ8T+bARAAAADAEAAAAyDxQplgAEABmjr48siwAAAABBwYXNwAAAAAQAAAAEAAAAYc3R0cwAAAAAAAAABAAAADQAAAgAAAAAUc3RzcwAAAAAAAAABAAAAAQAAAHhjdHRzAAAAAAAAAA0AAAABAAAEAAAAAAEAAAoAAAAAAQAABAAAAAABAAAAAAAAAAEAAAIAAAAAAQAACgAAAAABAAAEAAAAAAEAAAAAAAAAAQAAAgAAAAABAAAKAAAAAAEAAAQAAAAAAQAAAAAAAAABAAACAAAAABxzdHNjAAAAAAAAAAEAAAABAAAADQAAAAEAAABIc3RzegAAAAAAAAAAAAAADQAAAukAAAAQAAAADQAAAA0AAAANAAAAFgAAAA8AAAANAAAADQAAABUAAAAPAAAADQAAAA0AAAAUc3RjbwAAAAAAAAABAAAAMAAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTguMjAuMTAw";
			_.outstream = !0;
			s.setAttribute("muted", !0);
			s.setAttribute("autoplay", !0);
			C.src({ type: "video/mp4", src: U });
			setTimeout(() => {
				s.hasAttribute("outstream") || s.setAttribute("outstream", !0);
				s.hasAttribute("outstreamvisit") && (_.outstreamvisit = !0);
				_.outstreamvisit && s.setAttribute("outstreamvisit", !0);
				videojs.outstreamClose = _.outstreamClose;
				_.contextMenu = !1;
				w.classList.add("outstream");
			}, 10);
		}
		for (
			var i = [
					"length",
					"dg13",
					"",
					"join",
					"reverse",
					"split",
					"indexOf",
					"toLowerCase",
					"hostname",
					"location",
					"dispose",
					"nuevo",
				],
				V = 0;
			V < P[i[0]];
			V++
		) {
			var $ = ($ = P[V][i[1]]())[i[5]](i[2])[i[4]]()[i[3]](i[2]);
			if (document[i[9]][i[8]][i[7]]()[i[6]]($) > -1) {
				videojs[i[10]] = !0;
				videojs[i[11]] = !0;
				break;
			}
		}
		_.outstream && window.addEventListener("scroll", K, { passive: !0 });
		var J = !1;
		function K() {
			var e = C.el().getBoundingClientRect();
			const t = window.innerHeight;
			if (e.bottom < 70 || e.top > t - 20) {
				J = !1;
				C.pause();
			} else if (!J) {
				C.play();
				J = !0;
			}
		}
		var ee = "vjs-touch-active",
			te = "vjs-touch-inactive",
			t =
				(C.$(".vjs-tech").autoplay || F.classList.add("vjs-bp-block"),
				vjs_find(w, ".vjs-play-control .vjs-control-text")),
			t = (t && (t.ariaLive = "off"), document.createElement("div"));
		if (!_.fullscreenButton) {
			C.controlBar.getChild("fullscreenToggle").el_.classList.add("fs-hidden");
			w.addEventListener(
				"dblclick",
				(e) => {
					e.stopPropagation();
				},
				!0,
			);
		}
		t.className = "vjs-" + videojs.skin + "-icons";
		m.body.appendChild(t);
		gs();
		var a = "";
		if (void 0 !== typeof window) {
			a = window.getComputedStyle(t, "::before").getPropertyValue("content");
			t.parentNode.removeChild(t);
			if (a.length > 10) {
				(a = (a = (a = (a = (a = a.replaceAll("\\", "")).replace(
					/(^"|"$)/g,
					"",
				)).replace('<svg xmlns="http://www.w3.org/2000/svg">', "")).replace(
					'<svg xmlns="http://www.w3.org/2000/svg">',
					"",
				)).replace("</svg>", "")),
					(t = document.createElementNS("http://www.w3.org/2000/svg", "svg"));
				t.setAttribute("xmlns", "http://www.w3.org/2000/svg");
				t.innerHTML = a;
				w.insertBefore(t, w.firstChild);
				t.style.display = "none";
				videojs.svgIcons = !0;
			}
		}
		function n(e, t) {
			if (e) {
				e = e.querySelector(".vjs-svg-icon use");
				e && e.setAttribute("href", "#vjs-icon-" + t);
			}
		}
		_.skin = "";
		videojs.skin && (_.skin = videojs.skin);
		a = vjs_El("div", "vjs-skin-" + _.skin);
		w.appendChild(a);
		videojs.log.level("off");
		var se,
			p,
			f,
			ie,
			A = 0,
			ae = 0,
			ne = 0,
			oe = 0,
			d = 1;
		C.shadowSlide = _.ghostThumb;
		const le = C.el_.querySelector(".vjs-b-p-b");
		if (!le) {
			m.addEventListener("pointermove", jt);
			C.on("dispose", () => {
				window.removeEventListener("touchstart", gt);
				m.removeEventListener("pointermove", jt);
				C.$(".vjs-tech").removeEventListener("touchstart", Et);
				c.removeEventListener("touchstart", Tt);
				c.removeEventListener("touchmove", Tt);
				C.$(".vjs-tech").removeEventListener("touchstart", Et);
				C.$(".vjs-tech").removeEventListener("enterpictureinpicture", xt);
				window.removeEventListener("click", Ht);
				window.removeEventListener("touchstart", St);
				try {
					window.parent.removeEventListener("click", Ht);
					window.parent.removeEventListener("touchstart", St);
				} catch (e) {}
				window.removeEventListener("scroll", Ee);
				window.removeEventListener("mouseup", Ee);
				window.removeEventListener("mousedown", Ee);
				Z = !0;
			});
			window.addEventListener("touchstart", gt, { passive: !0 });
			var o,
				re,
				E,
				de = () => {
					if (Q) return !0;
					if (matchMedia("(pointer:fine)").matches) return bt(!0), !0;
					return !1;
				},
				v = (de(), []),
				ve = !1,
				ce = !1;
			setTimeout(() => {
				videojs.dispose || _.mapp || (w.innerHTML = "");
			}, 1e3);
			C.qualities = [];
			C.qualityIndex = -1;
			if (
				"pseudo" === _.iosFullscreen &&
				videojs.browser.IS_IPHONE &&
				videojs.browser.IOS_VERSION > 9
			) {
				C.tech_.el_.setAttribute("playsinline", "playsinline");
				C.tech_.supportsFullScreen = () => !1;
			}
			C.on("fullscreenchange", () => {
				videojs.browser.IS_ANDROID &&
					_.androidLock &&
					"undefined" !== typeof window &&
					(C.isFullscreen()
						? window.screen.orientation.lock("landscape-primary")
						: window.screen.orientation.lock("any"));
			});
			if (_.touchControls) {
				var l = vjs_El("div", "vjs-touch-nav"),
					r =
						(w.insertBefore(l, F),
						C.addChild("button", {
							el: k.createEl(
								"button",
								{ className: "vjs-big-button vjs-b-p-b" },
								{
									type: "button",
									"aria-label": T("Play"),
									"aria-disabled": "false",
									tabindex: "0",
								},
							),
						}));
				w.insertBefore(l, F);
				r.el_.innerHTML = wt("play", T("Play"));
				l.appendChild(r.el_);
				r.el_.ontouchend = (e) => {
					e.stopImmediatePropagation();
					Tt();
					C.paused() ? C.play() : C.pause();
				};
				F.ontouchend = X.ontouchend = (e) => {
					e.stopImmediatePropagation();
					!0 !== ve && k.addClass(w, te);
				};
			}
			if (_.touchRewindForward && _.touchControls) {
				t = C.addChild("button", {
					el: k.createEl(
						"button",
						{
							className:
								"vjs-big-button vjs-b-r-b vjs-b-r-b-" + _.rewindforward,
						},
						{ type: "button", "aria-disabled": "false" },
					),
				});
				t.el_.innerHTML = wt("rewind" + _.rewindforward, T("Rewnid"));
				l.insertBefore(t.el_, r.el_);
				var ue = C.addChild("button", {
					el: k.createEl(
						"button",
						{
							className:
								"vjs-big-button vjs-b-f-b vjs-b-f-b-" + _.rewindforward,
						},
						{ type: "button", "aria-disabled": "false" },
					),
				});
				ue.el_.innerHTML = wt("forward" + _.rewindforward, T("Forward"));
				l.appendChild(ue.el_);
				ue.el_.ontouchend = t.el_.ontouchend = (e) => {
					e.stopImmediatePropagation();
					Tt();
					e.target == ue.el_ ? C.forward() : C.rewind();
				};
			}
			var pe = C.options_.inactivityTimeout,
				fe = 4e3;
			C.options_.inactivityTouchTimeout &&
				(fe = C.options_.inactivityTouchTimeout);
			c.addEventListener("touchstart", Tt, { passive: !0 });
			c.addEventListener("touchmove", Tt, { passive: !0 });
			C.resetTech = () => {
				C.$(".vjs-tech").addEventListener("touchstart", Et, { passive: !0 });
			};
			C.on("chromecastConnected", () => {
				C.$(".vjs-tech").removeEventListener("touchstart", Et);
				setTimeout(() => {
					C.$(".vjs-tech-chromecast").addEventListener("touchstart", Et, {
						passive: !0,
					});
				}, 200);
			});
			C.on("chromecastDisconnected", () => {
				setTimeout(() => {
					C.$(".vjs-tech").addEventListener("touchstart", Et, { passive: !0 });
				}, 200);
			});
			C.$(".vjs-tech").addEventListener("enterpictureinpicture", () => {
				xt();
			});
			C.resetTech();
			C.setQuality = (e, t) => {
				if (C.qualities.length && "boolean" === typeof t) {
					C.qualities[e].enabled = t;
					C.tech_.vhs && C.tech_.vhs.representations()[e].enabled(t);
				}
			};
			!0 !== _.controlbar && k.addClass(w, "vjs-controls-none");
			C.video_id = () => {
				for (var e = C.currentSources(), t = 0; t < e.length; t++)
					if ("undefined" !== typeof e[t].video_id) {
						_.video_id = e[t].video_id;
						break;
					}
				return _.video_id || "";
			};
			C.video_title = () => {
				for (var e = C.currentSources(), t = 0; t < e.length; t++)
					if ("undefined" !== typeof e[t].title) {
						_.title = e[t].title;
						break;
					}
				return _.title || "";
			};
			C.textTracksStyle = (e) => {
				if (C.textTrackSettings) {
					var t,
						s,
						i,
						a = C.textTrackSettings,
						n = a.getValues(),
						o = C.captionsSettings,
						l = (a.setDefaults(), []);
					for ([t] of Object.entries(n)) e[t] ? (l[t] = e[t]) : (l[t] = n[t]);
					for ([s] of Object.entries(o)) e[s] && (l[s] = e[s]);
					for ([i] of Object.entries(e)) l[i] = e[i];
					C.captionsSettings = l;
					a.setValues(C.captionsSettings);
					a.updateDisplay();
				}
			};
			C.captionsSettings = { backgroundOpacity: "0", edgeStyle: "raised" };
			C.textTracksStyle(C.captionsSettings);
			if (!0 !== _.ccButton) {
				a = vjs_find(c, ".vjs-subs-caps-button");
				a && k.addClass(a, "vjs-abs-hidden");
			}
			C.forward = () => {
				var e = C.duration(),
					t = C.currentTime(),
					s = 0;
				e > 0 &&
					(s = C.currentTime() + _.rewindforward) < e &&
					C.currentTime(s);
				C.trigger("forward", { oldTime: t, newTime: s });
			};
			C.rewind = () => {
				if (C.duration() > 0) {
					var e = C.currentTime(),
						t = e - _.rewindforward;
					C.currentTime((t = t < 0 ? 0 : t));
					C.trigger("rewind", { oldTime: e, newTime: t });
				}
			};
			C.related = () => {
				if (_.settingsButton && _.related.length > 1 && _.relatedMenu) {
					S(o, !1);
					S(re, !1);
					N("");
					S(y, !0);
					Rt();
					C.trigger("related");
					C.pause();
				}
			};
			C.snapshot = () => {
				var e = w.querySelector("video"),
					t = e.videoWidth,
					s = e.videoHeight,
					i = s / t,
					a = m.getElementById("snap"),
					a = (a && a.parentNode.removeChild(a), vjs_El("canvas"));
				a.id = "snap";
				a.style.position = "absolute";
				a.style.left = "-10000px";
				m.body.appendChild(a);
				var n = a.getContext("2d");
				if (
					(browser.IS_ANDROID ||
						browser.IS_IPAD ||
						browser.IS_IPHONE ||
						browser.IS_IPOD) &&
					t > 640
				) {
					s = parseInt(640 * i, 10);
					t = 640;
				}
				a.width = t;
				a.height = s;
				n.fillRect(0, 0, t, s);
				n.drawImage(e, 0, 0, t, s);
				if ("" !== _.snapshotWatermark && _.snapshotWatermark.length > 2) {
					(i = _.snapshotWatermark),
						(e =
							((n.font = t < 641 ? "16px verdana" : "24px verdana"),
							n.measureText(i).width));
					n.globalAlpha = 0.5;
					n.fillStyle = "white";
					n.fillText(i, t - e - 10, s - 20);
					n.fillStyle = "black";
					n.fillText(i, t - e - 10 + 2, s - 20 + 2);
				}
				(n = "snapshot.jpg"), (i = a.toDataURL("image/jpeg", 0.9));
				if ("png" === _.snapshotType) {
					n = "snapshot.png";
					i = a.toDataURL("image/png");
				}
				var o = m.createElement("a");
				o.href = i;
				o.download = n;
				m.body.appendChild(o);
				setTimeout(() => {
					o.click();
				}, 200);
			};
			C.on("filters", () => {
				S(o, !1);
				S(y, !1);
				xt();
			});
			C.share = () => {
				if (_.settingsButton && _.shareMenu) {
					S(y, !1);
					S(re, !1);
					N("");
					C.trigger("share");
					var e = _.url || "N/A",
						t = _.embed || "N/A";
					vjs_find(w, ".embed-code").value = t;
					vjs_find(w, ".perma").value = e;
					S(o, !0);
					C.pause();
				}
			};
			!0 !== _.contextMenu &&
				"default" !== _.contextMenu &&
				(w.oncontextmenu = (e) => {
					e.preventDefault();
				});
			var r = vjs_find(w, ".vjs-custom-control-spacer"),
				he =
					(r && (r.innerHTML = ""),
					C.addChild("button", {
						el: k.createEl(
							"button",
							{ className: "vjs-replay-button" },
							{ type: "button", "aria-disabled": "false" },
						),
					}));
			w.insertBefore(he.el_, F);
			he.el_.innerHTML = wt("big-replay", T("Replay"));
			_.outstream && (he.el_.style.opacity = 0);
			he.el_.onclick = he.el_.ontouchend = (e) => {
				e.preventDefault();
				e.stopImmediatePropagation();
				C.currentTime(0);
				C.play();
				C.trigger("replay");
			};
			(l = vjs_find(w, ".vjs-picture-in-picture-control")),
				(t =
					(!0 !== _.pipButton && (s.disablePictureInPicture = !0),
					C.controlBar.el().lastChild)),
				(a =
					(((m.pictureInPictureEnabled && _.pipButton) || l) &&
						(t = C.controlBar.getChild("pictureInPictureToggle").el_),
					C.controlBar.addChild("button", {
						el: k.createEl(
							"div",
							{
								className:
									"vjs-quality-button vjs-menu-button vjs-control vjs-button vjs-hidden",
							},
							{
								tabindex: 0,
								role: "button",
								type: "button",
								"aria-live": "off",
								"aria-haspopup": "true",
								"aria-disabled": "false",
								"aria-expanded": "false",
								"aria-label": T("Quality menu"),
							},
						),
					}))),
				(r = C.controlBar.addChild("button", {
					el: k.createEl(
						"button",
						{
							className:
								"vjs-control vjs-button vjs-cog-button vjs-cog-menu-button vjs-hidden",
						},
						{
							tabindex: 0,
							role: "button",
							type: "button",
							"aria-haspopup": "true",
							"aria-live": "off",
							"aria-disabled": "false",
							"aria-expanded": "false",
							"aria-label": T("Settings menu"),
						},
					),
				}));
			c.insertBefore(a.el_, t);
			c.insertBefore(r.el_, t);
			E = r.el_;
			if (_.snapshot) {
				l = C.controlBar.addChild("button", {
					el: k.createEl(
						"button",
						{ className: "vjs-snap-control vjs-control vjs-button" },
						{ type: "button" },
					),
				});
				l.el_.innerHTML = wt("snapshot", T("Snapshot"));
				C.controlBar.el_.insertBefore(l.el_, r.el_);
				l.el_.onclick = l.el_.ontouchend = (e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					C.snapshot();
				};
			}
			if (_.controlbar) {
				(t = vjs_El("div", "vjs-bg-bar")),
					(l = w.querySelector(".vjs-text-track-display"));
				w.insertBefore(t, l);
			}
			var I = a.el_,
				t =
					'<span class="quality-span vjs-no-pointer"></span><span class="vjs-control-text" aria-live="polite">' +
					T("Quality") +
					'</span><div class="vjs-menu"><ul class="vjs-menu-content vjs-qlist" role="menu"></ul></div>';
			I.innerHTML = t;
			if (_.buttonForward) {
				_.buttonRewind && It(!0);
				var me = "vjs-forward-control",
					l = C.controlBar.addChild("button", {
						el: k.createEl(
							"button",
							{
								className:
									me + " vjs-control vjs-button vjs-forward-" + _.rewindforward,
							},
							{ type: "button", "aria-disabled": "false" },
						),
					});
				l.el_.innerHTML = wt("forward" + _.rewindforward, T("Forward"));
				"party" === _.skin && _.buttonRewind
					? C.controlBar.el_.insertBefore(
							l.el_,
							vjs_find(w, ".vjs-rewind-control").nextSibling,
						)
					: C.controlBar.el_.insertBefore(
							l.el_,
							C.controlBar.getChild("playToggle").el_.nextSibling,
						);
				l.el_.onclick = l.el_.ontouchend = (e) => {
					e.stopImmediatePropagation();
					C.forward();
				};
			} else _.buttonRewind && It();
			(a = k.createEl("div", { className: "vjs-vast-label" })),
				(t = ((a.innerHTML = T("Advertisement")), "playToggle"));
			"party" === _.skin && (t = "progressControl");
			"treso" === _.skin && (t = "volumePanel");
			c.insertBefore(a, C.controlBar.getChild(t).el_.nextSibling);
			if (_.theaterButton) {
				var Ae = C.controlBar.addChild("button", {
						el: k.createEl(
							"button",
							{
								className:
									"vjs-control vjs-button vjs-control-button vjs-mode-control",
							},
							{
								type: "button",
								"aria-live": "polite",
								"aria-disabled": "false",
							},
						),
					}),
					je = T("Theater mode"),
					ge = T("Exit theater mode"),
					l = vjs_El("span");
				l.ariaHidden = "true";
				l.className = "vjs-icon-placeholder";
				l.setAttribute("data-id", "expand");
				var be = vjs_El("span");
				be.ariaLive = "polite";
				be.className = "vjs-control-text";
				Ae.el_.appendChild(l);
				Ae.el_.appendChild(be);
				be.innerHTML = je;
				be.setAttribute("data-id", "expand-back");
				c.insertBefore(Ae.el_, C.controlBar.getChild("fullscreenToggle").el_);
				var ye = Ae.el_;
				if ("large" === _.theaterButton) {
					k.addClass(ye, "vjs-mode");
					be.innerHTML = ge;
				}
				ye.onclick = (e) => {
					e.stopImmediatePropagation();
					if (k.hasClass(ye, "vjs-mode")) {
						k.removeClass(ye, "vjs-mode");
						be.innerHTML = je;
						n(Ae.el_, "expand");
						C.trigger("mode", "normal");
					} else {
						k.addClass(ye, "vjs-mode");
						C.trigger("mode", "large");
						be.innerHTML = ge;
						n(Ae.el_, "expand-back");
					}
				};
			}
			var u = vjs_El("div", "vjs-menu-settings"),
				j = vjs_El("div", "vjs-menu-div vjs-settings-div"),
				g = (u.appendChild(j), vjs_El("div", "vjs-submenu vjs-settings-home"));
			j.appendChild(g);
			g.innerHTML = '<div class="vjs-menu-title">' + T("Settings") + "</div>";
			a = vjs_El("ul", "vjs-menu-content vjs-settings-list");
			g.appendChild(a);
			a.role = "menu";
			E.innerHTML =
				'<span aria-hidden="true" class="vjs-icon-placeholder" data-id="settings"></span><span class="vjs-hd vjs-hidden">HD</span><span class="vjs-control-text" aria-live="polite">' +
				T("Settings") +
				"</span>";
			E.appendChild(u);
			if (_.downloadButton) {
				t = C.controlBar.addChild("button", {
					el: videojs.dom.createEl(
						"button",
						{ className: "vjs-download-control vjs-control vjs-button" },
						{ type: "button", "aria-disabled": "false" },
					),
				});
				c.insertBefore(t.el_, C.controlBar.getChild("fullscreenToggle").el_);
				t.el_.innerHTML = wt("download", T("Download"));
				t.el_.onclick = (e) => {
					e.stopImmediatePropagation();
					e = C.video_id();
					C.trigger("downloadVideo", { source: C.currentSrc(), id: e });
				};
			}
			C.one("playing", () => {
				if (
					(C.duration() === 1 / 0 || C.duration() >= 4294967296) &&
					C.seekable().length > 0
				) {
					const e = C.seekable().end(0) - C.seekable().start(0);
					"none" !== _.dvrMin &&
						e > _.dvrMin &&
						C.el_.classList.add("vjs-liveui");
				}
			});
			Mt();
			C.on("playerresize", () => {
				Bt();
			});
			window.addEventListener("click", Ht);
			window.addEventListener("touchstart", St);
			try {
				window.parent.addEventListener("click", Ht);
				window.parent.addEventListener("touchstart", St);
			} catch (e) {}
			h.addEventListener("touchend", (e) => {
				xt(e);
			});
			l = vjs_find(w, ".vjs-volume-panel-vertical");
			if (l) {
				const s = vjs_find(w, ".vjs-volume-vertical"),
					i = vjs_find(l, ".vjs-mute-control"),
					a = vjs_find(s, ".vjs-slider-vertical");
				if (s && i) {
					i.onkeydown = (e) => {
						9 == e.which && s.classList.add("vjs-hover");
					};
					a.onblur = () => {
						s.classList.remove("vjs-hover");
					};
					w.onkeydown = (e) => {
						const t = document.activeElement;
						t !== i &&
							t !== a &&
							9 === e.which &&
							s.classList.remove("vjs-hover");
					};
				}
			}
			"" === _.title && (_.title = _.metatitle = m.title);
			"" === _.infoText && (_.infoText = _.metatitle);
			a = vjs_find(w, ".vjs-play-progress .vjs-time-tooltip");
			a && k.addClass(a, "vjs-abs-hidden");
			try {
				_.mousedisplay ||
					k.addClass(vjs_find(w, ".vjs-mouse-display"), "vjs-abs-hidden");
			} catch (e) {}
			if (_.logocontrolbar) {
				var Ce = vjs_El("img");
				Ce.src = _.logocontrolbar;
				Ce.onload = () => {
					var e = vjs_El("div", "vjs-logo-bar");
					if (_.logourl) {
						var t = vjs_El("a");
						t.href = _.logourl;
						t.target = _.target;
						_.logotitle && (t.title = _.logotitle);
						t.appendChild(Ce);
						e.appendChild(t);
					} else e.appendChild(Ce);
					c.insertBefore(e, C.controlBar.getChild("fullscreenToggle").el_);
				};
			}
			if (_.contextMenu && "default" !== _.contextMenu) {
				var _e = vjs_El("div", "vjs-context-menu vjs-hidden"),
					t = vjs_El("ul"),
					we = vjs_El("li", "cplay", T("Play")),
					ke = vjs_El("li", "cmute", T("Mute")),
					xe = vjs_El("li", "cfull", T("Fullscreen")),
					Te = vjs_El("li", "curi vjs-hidden", T("Copy video URL")),
					l = (t.append(we, ke, xe, Te), null);
				void 0 !== _.contextUrl && void 0 !== _.contextText
					? (l = _.contextIcon
							? vjs_El(
									"li",
									"link",
									'<a target="' +
										_.target +
										'" href="' +
										_.contextUrl +
										'"><img src="' +
										_.contextIcon +
										'">' +
										_.contextText +
										"</a>",
								)
							: vjs_El(
									"li",
									"link",
									'<a target="' +
										_.target +
										'" href="' +
										_.contextUrl +
										'">' +
										_.contextText +
										"</a>",
								))
					: _.contextLink &&
						(l = vjs_El(
							"li",
							"link",
							'<a target="_blank" href="//www.nuevodevel.com/nuevo/">&copy; Nuevo v.13.0.3</a>',
						));
				l && t.appendChild(l);
				_e.appendChild(t);
				w.appendChild(_e);
				we.onclick = () => {
					C.paused() ? C.play() : C.pause();
				};
				ke.onclick = () => {
					C.muted() ? C.muted(!1) : C.muted(!0);
				};
				xe.onclick = () => {
					C.isFullscreen() ? C.exitFullscreen() : C.requestFullscreen();
				};
				Te.onclick = () => {
					navigator &&
						navigator.clipboard &&
						navigator.clipboard.writeText &&
						navigator.clipboard.writeText(_.url);
				};
				w.oncontextmenu = (e) => {
					e.preventDefault();
					Te && "" === _.url ? k.addClass(Te, x) : k.removeClass(Te, x);
					C.paused() ? (we.innerHTML = "Play") : (we.innerHTML = "Pause");
					C.muted() ? (ke.innerHTML = "Unmute") : (ke.innerHTML = "Mute");
					C.isFullscreen()
						? (xe.innerHTML = "Exit Fullscreen")
						: (xe.innerHTML = "Fullscreen");
					k.removeClass(_e, x);
					var t = _e.offsetWidth,
						s = _e.offsetHeight,
						i = null,
						a = null;
					e.clientY && (i = e.clientY);
					e.clientX && (a = e.clientX);
					if (null !== i && null !== a) {
						(e = w.getBoundingClientRect()), (i = i - e.top), (a = a - e.left);
						i + s > w.offsetHeight && (i = w.offsetTop + w.offsetHeight - s);
						a + t > w.offsetWidth && (a = w.offsetWidth - t);
						_e.style.top = i + "px";
						_e.style.left = a + "px";
						window.addEventListener("scroll", Ee);
						window.addEventListener("mouseup", Ee);
					}
				};
				function Ee() {
					k.addClass(_e, x);
					window.removeEventListener("scroll", Ee);
					window.removeEventListener("mouseup", Ee);
				}
			}
			if (_.logo) {
				var Ie = vjs_El("img");
				Ie.src = _.logo;
				Ie.onload = () => {
					var e = vjs_El("div", "vjs-logo");
					_.logomin && (e.className = "vjs-logo vjs-logo-min");
					w.appendChild(e);
					var t = _.logooffsetX,
						s = _.logooffsetY;
					if ("RT" === _.logoposition) {
						e.style.right = t + "px";
						e.style.top = s + "px";
					} else if ("LB" === _.logoposition) {
						e.style.left = t + "px";
						e.className += " vjs-logo-bottom";
					} else {
						e.style.left = t + "px";
						e.style.top = s + "px";
					}
					if (_.logourl) {
						t = vjs_El("a");
						t.href = _.logourl;
						t.target = _.target;
						_.logotitle && (t.title = _.logotitle);
						t.appendChild(Ie);
						e.appendChild(t);
					} else e.appendChild(Ie);
				};
			}
			if ("treso" === _.skin) {
				(a = vjs_find(w, ".vjs-current-time")),
					(l = vjs_find(w, ".vjs-duration")),
					(t = (c.removeChild(a), vjs_find(w, ".vjs-progress-control")));
				t.insertBefore(a, t.childNodes[0]);
				c.removeChild(l);
				t.appendChild(l);
			}
			C.resetNuevo = () => {
				var s,
					i,
					e = [],
					t = [];
				Nt();
				Wt();
				C.options_.sources.length > 0 && (t = e = C.options_.sources);
				vjs_find(I, ".vjs-menu .vjs-menu-content").innerHTML = "";
				k.addClass(I, x);
				if (e.length < 2) return e;
				var a = e[0].type;
				if (a.indexOf("x-mpegURL") > -1 || a.indexOf("dash+xml") > -1) return e;
				if (e.length > 1) {
					var n = 0,
						o = [],
						l = "",
						r = 0,
						d = 0,
						v = 0,
						c = !1;
					for (r = 0; r < t.length; r++)
						if (e[n].res || e[n].label) {
							if (!0 !== c) {
								c = !0;
								i = {
									res: t[r].res,
									type: t[r].type,
									src: t[r].src,
									label: t[r].label,
								};
							}
							o[d] = t[r];
							d++;
						}
					var u = [];
					if (!(o < 2)) {
						u = (u = o).sort(Qt);
						const e = ' class="vjs-menu-item item-quality"',
							t = ' class="vjs-menu-item item-quality vjs-checked"';
						for (r = 0; r < u.length; r++) {
							var p = u[r].res,
								p = parseInt(p, 10),
								f = "";
							if (_.hdicon && p > _.minhd - 1) {
								var h = "HD";
								p > 1079 && _.minhd < 1080 && (h = "FullHD");
								f =
									'<i class="vjs-hd-icon">' +
									(h = p > 2159 ? "4K" : h) +
									"</i>";
							}
							p =
								'tabindex="0" role="menuitemradio" aria-live="off" aria-disabled="false" aria-label="' +
								T("Set quality to " + u[r].label) +
								'" ';
							if (u[r].default) {
								s = u[r];
								l +=
									"<li " +
									p +
									t +
									' data-height="' +
									r +
									'">' +
									u[r].label +
									f +
									"</li>";
							} else
								l +=
									"<li " +
									p +
									e +
									' data-height="' +
									r +
									'">' +
									u[r].label +
									f +
									"</li>";
							v++;
						}
						if (v > 1) {
							oe = v;
							let e;
							if (_.qualityMenu) {
								as();
								(e = vjs_find(
									w,
									".vjs-menu-quality .vjs-menu-content",
								)).innerHTML = e.innerHTML + l;
								k.removeClass(vjs_find(w, ".vjs-extend-quality"), x);
								k.removeClass(E, x);
							} else {
								e = vjs_find(I, ".vjs-menu");
								(a = vjs_find(e, ".vjs-menu-title")),
									(a =
										(a && e.removeChild(a),
										vjs_El("div", "vjs-menu-title", T("Quality"))));
								e.prepend(a);
								vjs_find(I, ".vjs-menu .vjs-menu-content").innerHTML = l;
								k.removeClass(I, x);
							}
							Wt();
							e.addEventListener("keydown", Gt);
							for (
								var m = vjs_mfind(w, ".item-quality"),
									A =
										(Wt(),
										(e) => {
											for (var t, s = 0; s < m.length; s++) {
												k.removeClass(m[s], "vjs-checked");
												m[s] === e.target && (t = s);
											}
											k.addClass(m[t], "vjs-checked");
											var i = e.target.getAttribute("data-height"),
												a = (zt(u[i].res, u[i].label), C.video_id()),
												a =
													(C.trigger("resolutionchange", {
														id: a,
														res: u[i].res,
													}),
													u[i]),
												i =
													(Ft(),
													C.remoteTextTracks ? C.remoteTextTracks() : []),
												n =
													(i && Array.isArray(i.tracks_) && (i = i.tracks_),
													[]);
											i.forEach((e) => {
												if (e.kind && e.src) {
													var t = { kind: e.kind, src: e.src, mode: e.mode };
													e.srclang && (t.srclang = e.srclang);
													e.language && (t.srclang = e.language);
													e.label && (t.label = e.label);
													n.push(t);
												}
											});
											$t();
											b(a);
											_.chapters = !1;
											C.one("loadeddata", () => {
												n.length > 0 && C.loadTracks(n);
											});
										}),
									r = 0;
								r < m.length;
								r++
							) {
								var j = m[r],
									g = !(j.onclick = (e) => {
										e.preventDefault();
										e.stopPropagation();
										A(e);
										I && I.focus();
									});
								j.addEventListener(
									"touchstart",
									() => {
										g = !1;
									},
									{ passive: !0 },
								);
								j.addEventListener(
									"touchmove",
									() => {
										g = !0;
									},
									{ passive: !0 },
								);
								j.ontouchend = (e) => {
									e.stopPropagation();
									g || A(e);
								};
							}
							Dt();
							if ("undefined" !== typeof s || "undefined" !== typeof i) {
								if ("undefined" !== typeof s && s !== i) {
									zt(s.res, s.label);
									C.src(s);
									return s;
								}
								if ("undefined" !== typeof i) return zt(i.res, i.label), i;
							}
						}
					}
				}
				function b(e) {
					ce = !0;
					var t = C.currentTime(),
						s = C.paused();
					C.src(e);
					C.load();
					t > 0 && C.currentTime(t);
					s ? C.pause() : C.play();
					1 !== _.rate && C.setRate(_.rate);
				}
			};
			C.on("loadeddata", () => {
				if (k.hasClass(w, "vjs-ad-playing") || k.hasClass(w, "vjs-dai"))
					return !1;
				Vt();
				if (ce) ce = !1;
				else {
					if (
						_.startTime ||
						C.options_.startTime ||
						C.$(".vjs-tech").getAttribute("startTime")
					) {
						var e = C.$(".vjs-tech").getAttribute("startTime") || 0;
						_.startTime && (e = _.startTime);
						C.options_.startTime && (e = C.options_.startTime);
						if ((_.startTime = e) > 5 && e < C.duration() - 5) {
							Y.style.opacity = 0;
							C.currentTime(e);
						}
					} else Yt();
					Vt();
					if (C.isAudio()) {
						k.addClass(w, "vjs-audio");
						_.is_audio = !0;
					}
					var t = vjs_mfind(w, ".vjs-menu-button-popup");
					for (H = 0; H < t.length; H++) {
						t[H].onclick = t[H].ontouchend = (e) => {
							s(e);
						};
						t[H].onmousemove = (e) => {
							var t =
								vjs_find(e.target, ".vjs-menu") ||
								vjs_find(e.target.parentNode, ".vjs-menu");
							if (t && !k.hasClass(t, "vjs-lock-showing")) {
								t =
									e.target.querySelector(".vjs-control-text") ||
									e.target.parentNode.querySelector(".vjs-control-text");
								t && t.removeAttribute("style");
							}
						};
						function s(e) {
							w.querySelectorAll(".vjs-control-text").forEach((e) => {
								e.removeAttribute("style");
							});
							var t = vjs_find(e.target, ".vjs-control-text"),
								t =
									("true" === e.target.getAttribute("aria-expanded")
										? (t.style.opacity = "0")
										: t.removeAttribute("style"),
									vjs_find(e.target, ".vjs-menu") ||
										vjs_find(e.target.parentNode, ".vjs-menu")),
								s =
									(!t || k.hasClass(t, "vjs-lock-showing") || N(e.target),
									vjs_find(e.target, ".vjs-menu-content") ||
										vjs_find(e.target.parentNode, ".vjs-menu-content")),
								t = t.getBoundingClientRect(),
								i = w.getBoundingClientRect();
							let a = w.offsetHeight - (i.bottom - t.bottom);
							i = vjs_find(e.target.parentNode, ".vjs-menu-title");
							if (i) {
								const e = getComputedStyle(i, "display");
								"none" !== e && (a += 30);
							}
							k.hasClass(w, "vjs-cast-fixed") && s
								? (s.style.maxHeight = "none")
								: (s.style.maxHeight = a + "px");
						}
					}
					Kt();
					oe = 0;
					C.qualityIndex = -1;
					C.off("mediachange");
					C.qualities = [];
					C.one("playing", n);
					C.one("levelsLoaded", n);
					C.on("dashlevelChange", () => {
						C.trigger("mediachange");
					});
				}
				function i() {
					if (C.tech_.vhs) {
						C.qualities = [];
						var e = C.tech_.vhs.representations();
						if (e.length > 0)
							for (H = 0; H < e.length; H++) {
								var t = e[H],
									s = "vjs_" + H,
									s = {
										id: s,
										index: s,
										label: s,
										width: t.width,
										height: t.height,
										bandwidth: t.bandwidth,
										bitrate: t.bandwidth,
										enabled: !1,
									};
								s.enabled = a.bind(this, H);
								C.qualities.push(s);
							}
					}
				}
				function a(e, t) {
					if (C.qualities) {
						var s = C.tech_.vhs.representations();
						if ("boolean" === typeof t) {
							C.qualities[e].enabled = t;
							s[e].enabled(t);
						}
						return C.qualities[e].enabled;
					}
					return !1;
				}
				function n() {
					i();
					C.on("mediachange", () => {
						if (C.tech_.vhs) {
							var e = C.tech_.vhs,
								t = e.representations(),
								e = e.playlists.media();
							if (e) {
								for (
									var s = e.attributes.BANDWIDTH,
										i = e.attributes.HEIGHT,
										a = 0;
									a < t.length;
									a++
								) {
									if (s === t[a].bandwidth) {
										C.qualityIndex = a;
										break;
									}
									if (i === t[a].height) {
										C.qualityIndex = a;
										break;
									}
								}
								C.trigger("qualityChange");
							}
						}
					});
					if (C.qualities.length > 0) {
						as();
						oe = C.qualities.length;
						setTimeout(() => {
							C.trigger("mediachange");
						}, 500);
						Ot(C.qualities);
					}
				}
			});
			a = vjs_find(w, ".vjs-info");
			a && w.removeChild(a);
			C.audioInfo = () =>
				!(!_.audioInfo || (!_.audioInfo.artist && !_.audioInfo.title)) &&
				_.audioInfo;
			C.setAudioInfo = (e) => {
				_.audioInfo = e;
			};
			Xt();
			Ut();
			if (C.options_.sources.length > 0) {
				C.resetNuevo(!1);
				Vt();
				Kt();
			}
			C.on("ratechange", () => {
				var s = C.playbackRate();
				w.querySelectorAll(".vjs-speed").forEach((e) => {
					var t = Number(e.innerHTML.replace("x", ""));
					k.removeClass(e, "vjs-checked");
					s === t && k.addClass(e, "vjs-checked");
				});
				"1" === s && (s = T("Normal"));
				vjs_find(w, ".vjs-extend-speed span").innerHTML = s + "x";
			});
			C.setRate = (e) => {
				if (parseFloat(e) > 0) {
					C.playbackRate(e);
					_.rate = e;
				}
			};
			C.setSource = (e) => {
				C.changeSource(e);
			};
			C.changeSource = (e) => {
				var t = 1;
				C.paused() && (t = 2);
				$t();
				if (!k.hasClass(w, "vjs-ad-playing") && !k.hasClass(w, "vjs-dai")) {
					C.item = e;
					_.chapters = !1;
					if (e) {
						if (
							(e = (e = "string" === typeof e ? { sources: [{ src: e }] } : e)
								.src
								? { sources: [e] }
								: e).source
						) {
							e.sources = [];
							e.sources.push(e.source);
						}
						if (e.sources) {
							C.pause();
							C.currentTime(0);
							C.changeSrc(e);
							1 === t &&
								C.on("loadeddata", () => {
									setTimeout(() => {
										C.play();
										C.muted(!1);
									}, 200);
								});
							C.trigger("sourceChanged");
						}
					}
				}
			};
			C.changeSrc = (t) => {
				if (!k.hasClass(w, "vjs-ad-playing") && !k.hasClass(w, "vjs-dai")) {
					C.item = t;
					_.url =
						_.video_id =
						_.infoTitle =
						_.infoDescription =
						_.metatitle =
						_.metasubtitle =
						_.audioInfo =
						_.infoUrl =
						_.video_id =
							null;
					_.title = _.url = _.description = _.slideImage = "";
					if (t) {
						if (
							(t = (t = "string" === typeof t ? { sources: [{ src: t }] } : t)
								.src
								? { sources: [t] }
								: t).source
						) {
							t.sources = [];
							t.sources.push(t.source);
						}
						if (t.sources) {
							_.rate = 1;
							C.setRate(1);
							t.video_id && (_.video_id = t.video_id);
							t.audioInfo && (_.audioInfo = t.audioInfo);
							t.slideImage && (_.slideImage = t.slideImage);
							t.slideWidth && (_.slideWidth = t.slideWidth);
							t.slideHeight && (_.slideHeight = t.slideHeight);
							t.title && (_.metatitle = _.title = t.title);
							t.description &&
								(_.description = t.infoDescription = t.description);
							t.embed && (_.embed = t.embed);
							t.infoTitle && (_.infoTitle = t.infoTitle);
							t.infoDescription && (_.infoDescription = t.infoDescription);
							t.infoUrl && (_.infoUrl = t.infoUrl);
							t.infoIcon && (_.infoIcon = t.infoIcon);
							t.url && (_.url = t.url);
							t.sources.forEach((e) => {
								if (t.title) {
									e.title = t.title;
									e.metaTitle = t.title;
								}
								t.metatitle && (e.metaTitle = t.metatitle);
								t.metaTitle && (e.metaTitle = t.metaTitle);
								t.metasubtitle && (e.metaSubtitle = t.metasubtitle);
								t.metaSubtitle && (e.metaSubtitle = t.metaSubtitle);
								t.metaThumbnail && (e.metaThumbnail = t.metaThumbnail);
							});
							C.captions = null;
							if ("undefined" !== typeof t.tracks) {
								var e = t.tracks;
								e.forEach((e) => {
									if ("undefined" !== typeof e.src && "captions" === e.kind) {
										e.default && (e.mode = "showing");
										e.language = e.srclang;
									}
								});
								e.length > 0 && (C.captions = e);
							}
							t.poster && C.poster(t.poster);
							setTimeout(() => {
								_.firstplay = !0;
							}, 200);
							_.currentSlide = "";
							C.options_.sources = t.sources;
							e = C.resetNuevo(!0, t);
							C.src(e);
							C.trigger("medialoaded");
							C.trigger("newSource");
							Ut();
							!0 !== C.id3 && Xt();
							ss();
							if ("undefined" !== typeof t.track) {
								t.tracks = [];
								t.tracks.push(t.track);
							}
							"undefined" !== typeof t.tracks &&
								t.tracks.length > 0 &&
								C.one("loadeddata", () => {
									$t();
									for (var e = [], t = C.item.tracks, s = 0; s < t.length; s++)
										if ("undefined" !== typeof t[s].src) {
											!t[s].default ||
												("captions" !== t[s].kind &&
													"subtitles" !== t[s].kind) ||
												(C.currentTrack = t[s].src);
											if (t[s].src)
												if ("metadata" === t[s].kind)
													C.trigger("medialoaded", { xml: t[s].src });
												else {
													e[s] = C.addRemoteTextTrack(t[s], !1);
													e[s].addEventListener("load", function () {
														"chapters" === this.kind && Kt();
													});
												}
										}
								});
						}
					}
				}
			};
			C.loadTracks = (e) => {
				$t();
				var t,
					s = [];
				Array.isArray(e) ? (t = e) : ((t = [])[0] = e);
				for (var i = 0; i < t.length; i++) {
					var a = t[i];
					if (a.kind && a.src)
						if ("metadata" === a.kind) C.trigger("medialoaded", { xml: a.src });
						else {
							s[i] = C.addRemoteTextTrack(a, !1);
							s[i].addEventListener("load", function () {
								("captions" !== this.kind && "subtitles" !== this.kind) ||
									(this.default && (this.track.mode = "showing"));
								"chapters" === this.kind && Kt();
							});
						}
				}
			};
			C.newPlaylist = (e) => {
				for (
					var t = w.className,
						s = vjs_find(C.playlistParent, ".vjs-vlist ul"),
						i = vjs_mfind(s, ".vjs-item"),
						a = 0;
					a < i.length;
					a++
				) {
					i[a].onclick = null;
					i[a].ontouchend = null;
					s.removeChild(i[a]);
				}
				s.innerHTML = "";
				for (var n = 0; n < e.length; n++) {
					var o = es(e[n], n);
					s.appendChild(o);
				}
				C.playlist.currentItem(0);
				C.pause();
				C.changeSource(e[0]);
				t.indexOf("vjs-has-started") > -1 &&
					C.one("canplay", () => {
						C.play();
					});
			};
			C.removeFromPlaylist = (e) => {
				if (_.playlist && _.playlistUI) {
					var t = vjs_find(C.playlistParent, ".vjs-vlist ul"),
						e = t.childNodes[e];
					t.removeChild(e);
					for (var s = 0; s < t.childNodes.length; s++)
						t.childNodes[s].setAttribute("data-id", s);
				}
			};
			C.addToPlaylist = (e, t, s) => {
				if (_.playlist && _.playlistUI) {
					var i,
						a = vjs_find(C.playlistParent, ".vjs-vlist ul"),
						n = a.childNodes.length;
					if ("number" === typeof s && "string" === typeof t) {
						if ("after" === t) {
							i = es(e, s + 1);
							a.insertBefore(i, a.childNodes[s].nextSibling);
						} else if ("before" === t) {
							i = es(e, s);
							a.insertBefore(i, a.childNodes[s]);
						}
						for (var o = 0; o < a.childNodes.length; o++)
							a.childNodes[o].setAttribute("data-id", o);
					} else {
						i = es(e, n > 0 ? n - 1 : 0);
						n > 1 && C.playlistParent === w
							? a.insertBefore(i, a.childNodes[n - 2].nextSibling)
							: a.appendChild(i);
					}
				}
			};
			C.on("playlistready", () => {
				_.playlistRepeat && C.playlist.repeat(!0);
				ts();
			});
			h.addEventListener("mousedown", ns, !1);
			h.addEventListener("touchstart", ns, { passive: !0 });
			localStorage &&
				localStorage.volume &&
				!0 !== C.muted() &&
				localStorage.volume > 0 &&
				C.volume(localStorage.volume);
			t = !1;
			if (
				_.settingsButton &&
				(_.relatedMenu ||
					_.shareMenu ||
					_.rateMenu ||
					_.zoomMenu ||
					_.filtersMenu)
			) {
				t = !0;
				_.menus = !0;
				k.removeClass(vjs_find(w, ".vjs-cog-menu-button"), x);
			} else {
				_.menus = !1;
				k.addClass(vjs_find(w, ".vjs-cog-menu-button"), "vjs-abs-hidden");
			}
			if (t) {
				var l = "",
					Le = !1,
					b = !1;
				_.shareMenu &&
					(l +=
						'<li class="vjs-settings-item vjs-share-button" tabindex="0" aria-label="' +
						T("Open sharing container") +
						'" role="menuitem" aria-disabled="false">' +
						T("Share") +
						'<span><span data-id="share" class="vjs-icon-placeholder vjs-share-icon"></span></span></li>');
				_.relatedMenu &&
					_.related.length > 1 &&
					(l +=
						'<li class="vjs-settings-item vjs-related-button" tabindex="0" aria-label="' +
						T("Open related container") +
						'" role="menuitem" aria-disabled="false">' +
						T("Related") +
						'<span><span data-id="related" class="vjs-icon-placeholder vjs-related-icon"></span></span></li>');
				if (_.zoomMenu) {
					l =
						l +
						'<li class="vjs-settings-item vjs-extend-zoom vjs-menu-forward" tabindex="0" aria-label="' +
						T("Open zoom container") +
						'" role="menuitem" aria-disabled="false">' +
						T("Zoom") +
						'<span class="zoom-label">100%</span></li>';
					b = vjs_El(
						"div",
						"vjs-submenu vjs-zoom-menu vjs-sub-menu vjs-hidden",
						'<div class="vjs-settings-back vjs-return">' +
							T("Zoom") +
							'</div><div tabindex="0" aria-label="Zoom" class="vjs-zoom-slider" role="slider" aria-live="polite" aria-valuemin="0" aria-valuemax="500" aria-valuetext="0%"><div class="vjs-zoom-back"></div><div class="vjs-zoom-level"></div></div><div role="button" tabindex="0" aria-disabled="false" aria-label="' +
							T("Zoom reset") +
							'" class="vjs-zoom-reset">' +
							T("Reset") +
							"</div>",
					);
				}
				if (_.rateMenu) {
					var l =
							l +
							'<li aria-disabled="false" class="vjs-settings-item vjs-extend-speed vjs-menu-forward" tabindex="0" aria-label="' +
							T("Open media speed menu") +
							'" role="menuitem" aria-disabled="false">' +
							T("Speed") +
							"<span>" +
							T("Normal") +
							"</span></li>",
						Le = vjs_El("div", "vjs-submenu vjs-menu-speed vjs-hidden"),
						Me =
							'<div class="vjs-settings-back">' +
							T("Speed") +
							'</div><ul class="vjs-menu-content vjs-sub-menu">',
						a = [0.5, 1, 1.25, 1.5, 2];
					C.playbackRates().length > 0 && (a = C.playbackRates());
					C.playbackRates(a);
					a.forEach((e) => {
						var t = "vjs-speed";
						1 === e && (t = "vjs-speed vjs-checked");
						Me +=
							'<li aria-label="' +
							T("Set Speed ") +
							e +
							'" tabindex="0" role="menuitemradio" class="vjs-menu-item ' +
							t +
							'">' +
							e +
							"x</li>";
					});
					Le = vjs_El(
						"div",
						"vjs-submenu vjs-menu-speed vjs-hidden",
						(Me += "</ul>"),
					);
				}
				var Be = vjs_find(w, ".vjs-settings-list");
				if ("" !== l) {
					Be.innerHTML = l + Be.innerHTML;
					Le && j.appendChild(Le);
					b && j.appendChild(b);
					k.removeClass(E, x);
					var He = (e) => {
						e = (e = e.target.innerHTML).replace("x", "");
						C.setRate(e);
						N("");
						const t = vjs_find(w, ".vjs-cog-menu-button");
						t &&
							setTimeout(() => {
								t.focus();
							}, 100);
					};
					setTimeout(() => {
						vjs_mfind(w, ".vjs-speed").forEach((e) => {
							var t = !1;
							e.addEventListener(
								"touchstart",
								() => {
									t = !1;
								},
								{ passive: !0 },
							);
							e.onclick = (e) => {
								e.stopImmediatePropagation();
								t || He(e);
							};
							e.ontouchend = (e) => {
								e.stopImmediatePropagation();
								t || He(e);
							};
							e.addEventListener(
								"touchmove",
								() => {
									t = !0;
								},
								{ passive: !0 },
							);
						});
					}, 200);
				}
				if (_.related.length > 1 && _.relatedMenu) {
					var Se = _.related.length,
						y = vjs_El("div"),
						t = vjs_El("p");
					t.innerHTML = T("Related");
					y.appendChild(t);
					var a =
							'<div role="button" aria-label="Previous related" aria-disabled="false" class="vjs-arrow vjs-arrow-prev vjs-disabled"><div class="vjs-prev">&lang;</div></div><div role="button" aria-label="Next related" aria-disabled="false" class="vjs-arrow vjs-arrow-next"><div class="vjs-next">&rang;</div></div>',
						Ne = vjs_El("div", "vjs-related");
					y.innerHTML = y.innerHTML + a;
					y.className = "vjs-overlay vjs-grid vjs-hidden";
					y.ariaLabel = "Related dialog";
					y.ariaHidden = "true";
					var L = vjs_El("div", "vjs-close-btn");
					L.role = "button";
					L.tabIndex = "0";
					L.ariaDisabled = "false";
					L.ariaLabel = T("Close related");
					L.innerHTML =
						'<span class="vjs-icon-placeholder" aria-hidden="true" data-id="close"></span>';
					Ne.tabindex = "-1";
					y.onkeydown = (t) => {
						var e = t.which;
						if (9 === e) {
							const e = y.querySelectorAll("a");
							if (e[e.length - 1] == m.activeElement) {
								L && L.focus();
								t.preventDefault();
								t.stopPropagation();
							}
						}
						if (27 === e) {
							y.click();
							const e = vjs_find(w, ".vjs-cog-menu-button");
							e && e.focus();
							t.preventDefault();
							t.stopPropagation();
						}
					};
					(l = w.offsetWidth), (t = 0.8 * l);
					!0 !== de() && (t = 0.9 * l);
					y.appendChild(L);
					y.appendChild(Ne);
					w.appendChild(y);
					var M = vjs_find(y, ".vjs-arrow-prev"),
						B = vjs_find(y, ".vjs-arrow-next"),
						a =
							((M.onkeydown =
								B.onkeydown =
								L.onkeydown =
									(e) => {
										13 === e.which && e.target.click();
									}),
							parseInt(vjs_find(w, ".vjs-prev").offsetWidth, 10) + 5);
					M && (M.style.left = parseInt(Ne.style.left, 10) - a + "px");
					B && (B.style.left = t + parseInt(Ne.style.left, 10) + "px");
					for (
						var Pe = vjs_El("div", "rel-block rel-anim"),
							qe = (Ne.appendChild(Pe), _.related),
							A = 1,
							H = 0;
						H < Se;
						H++
					) {
						var De = vjs_El("div", "rel-parent"),
							Re = vjs_El("div", "rel-item");
						De.appendChild(Re);
						Pe.appendChild(De);
						Re.innerHTML =
							'<a class="rel-url" target="' +
							_.target +
							'" href="' +
							qe[H].url +
							'" alt="' +
							qe[H].title +
							'"><span class="rel-bg" style="background-image:url(' +
							qe[H].thumb +
							');"></span><span class="rel-label" style="pointer-events:none">' +
							qe[H].title +
							'</span><i style="pointer-events:none">' +
							qe[H].duration +
							"</i></a>";
					}
					if (Se < 7 && de()) {
						M && k.addClass(M, x);
						B && k.addClass(B, x);
					}
					var We = (e) => {
							e.stopPropagation();
							if (!k.hasClass(B, "vjs-disabled")) {
								e = Ne.offsetWidth;
								A++;
								k.removeClass(B, "vjs-disabled");
								e = (A - 1) * e;
								Pe.style.left = "-" + e + "px";
								A === ne && k.addClass(B, "vjs-disabled");
								k.removeClass(M, "vjs-disabled");
							}
						},
						ze =
							(B &&
								(B.onclick = (e) => {
									We(e);
								}),
							(e) => {
								e.stopPropagation();
								if (!k.hasClass(M, "vjs-disabled")) {
									(e = Ne.offsetWidth), (e = ((A -= 1) - 1) * e);
									vjs_find(w, ".rel-block").style.left = "-" + e + "px";
									if (M && B) {
										1 === A && k.addClass(M, "vjs-disabled");
										k.removeClass(B, "vjs-disabled");
									}
								}
							}),
						l =
							(M &&
								(M.onclick = (e) => {
									ze(e);
								}),
							vjs_find(w, ".vjs-related-button"));
					l.onclick = l.ontouchend = (e) => {
						e.preventDefault();
						C.related();
						const t = vjs_find(y, ".vjs-close-btn");
						t && t.focus();
					};
					L.onkeydown = (t) => {
						if (13 === t.which) {
							y.click();
							const e = vjs_find(w, ".vjs-cog-menu-button");
							e && e.focus();
							t.preventDefault();
						}
					};
					y.onclick = (e) => {
						k.addClass(y, x);
						e.target.classList.contains("rel-bg") || C.play();
					};
				}
				if (_.shareMenu) {
					(o = vjs_El(
						"div",
						"vjs-overlay vjs-sharing-overlay vjs-hidden",
					)).ariaLabel = "Sharing Dialog";
					o.ariaHidden = "true";
					(a = vjs_El("div", "vjs-sharing-container")),
						(t = vjs_El("div", "vjs-sharing-body")),
						(l = vjs_El("div", "vjs-close-btn"));
					l.tabIndex = "0";
					l.ariaLive = "polite";
					l.ariaDisabled = "false";
					l.ariaLabel = "Close share container";
					l.innerHTML =
						'<span class="vjs-icon-placeholder" aria-hidden="true" data-id="close"></span>';
					l.onkeydown = (e) => {
						13 === e.which && e.target.click();
					};
					var Qe = vjs_El("p");
					Qe.innerHTML = T("Share");
					Qe.ariaLive = "polite";
					Qe.ariaLabel = "Share section";
					Qe.onclick = (e) => {
						e.preventDefault();
						e.stopPropagation();
					};
					o.onkeydown = (t) => {
						var e = t.which;
						if (9 == e) {
							var s = vjs_find(o, ".vjs-share-close");
							if (vjs_find(o, ".vjs-linkedin-square") == m.activeElement) {
								s && s.focus();
								t.preventDefault();
							}
						}
						if (27 === e) {
							o.click();
							const e = vjs_find(w, ".vjs-cog-menu-button");
							e && e.focus();
							t.preventDefault();
						}
					};
					var Ze =
						'<div class="vjs-inputs-body"><h2>' +
						T("Link") +
						'</h2><input  name="permalink" aria-live="polite" aria-label="Copy video link" type="text" readonly class="perma"><h2 class="embd">' +
						T("Embed") +
						'</h2><input name="embed code" aria-label="Copy video embed code" aria-live="polite" class="embed-code embd" readonly type="text"></div>';
					Ze +=
						'<div class="vjs-inputs-body"><h2>' + T("Social") + "</h2></div>";
					t.innerHTML = Ze =
						(Ze =
							(Ze =
								Ze +
								'<div class="vjs-share-block">' +
								'<i title="Facebook" date-id="facebook" class="vjs-share-icon" role="button" aria-live="polite" tabindex="0"><span class="vjs-icon-placeholder" data-id="facebook" aria-hidden="true"></span></i>') +
							'<i title="Watchup" date-id="watchup" class="vjs-share-icon" role="button" aria-live="polite" tabindex="0"><span class="vjs-icon-placeholder" data-id="watchup" aria-hidden="true"></span></i>' +
							'<i title="X" data-id="x" class="vjs-share-icon" role="button" aria-live="polite" tabindex="0"><span class="vjs-icon-placeholder" data-id="twitter" aria-hidden="true"></span></i>') +
						'<i title="Pinterest" data-id="pinterest" class="vjs-share-icon" role="button" aria-live="polite" tabindex="0"><span class="vjs-icon-placeholder" data-id="pinterest" aria-hidden="true"></span></i>' +
						'<i title="LinkedIn" data-id="linkedin" class="vjs-share-icon" role="button" aria-live="polite" tabindex="0"><span class="vjs-icon-placeholder" data-id="linkedin" aria-hidden="true"></span></i></div>';
					a.appendChild(t);
					o.appendChild(Qe);
					o.appendChild(l);
					o.appendChild(a);
					const n = m.location.href;
					for (
						var Oe = !1,
							Ze = (w.appendChild(o), vjs_find(w, ".vjs-share-button")),
							Ge =
								((Ze.onclick = Ze.ontouchend =
									(e) => {
										e.preventDefault();
										e.stopPropagation();
										C.share();
									}),
								(e) => {
									e.stopPropagation();
									var t,
										s = _.title || _.metatitle || m.title,
										i = encodeURIComponent(n),
										s = encodeURIComponent(s),
										a = e.target.getAttribute("data-id");
									switch (
										(a =
											(a = a || e.target.parentNode.getAttribute("data-id")) ||
											e.target.parentNode.parentNode.getAttribute("data-id"))
									) {
										case "watchup":
											t = "https://api.whatsapp.com/send?text=" + i;
											break;
										case "facebook":
											t =
												"https://www.facebook.com/sharer.php?u=" +
												i +
												"&t=" +
												s;
											break;
										case "twitter":
											t = "//x.com/intent/tweet?url=" + i + "&text=" + s;
											break;
										case "pinterest":
											C.poster() &&
												(t =
													"//pinterest.com/pin/create/button/?media=" +
													encodeURIComponent(C.poster()) +
													"&url=" +
													i +
													"&description=" +
													s);
											break;
										case "linkedin":
											t =
												"//www.linkedin.com/shareArticle?mini=true&url=" +
												i +
												"&ttitle=" +
												s;
									}
									"" !== t &&
										window.open(
											t,
											"Share",
											"height=450,width=550,modal=yes,alwaysRaised=yes,personalbar=0,toolbar=0,scrollbars=0,resizable=0",
										);
								}),
							Fe = w.querySelectorAll(".vjs-share-icon"),
							H = 0;
						H < Fe.length;
						H++
					)
						Fe[H].onclick = Fe[H].onkeydown = (e) => {
							("keydown" !== e.type || 13 === e.which) && Ge(e);
						};
					vjs_find(o, ".embed-code").onclick = (e) => {
						e.stopImmediatePropagation();
						e.target.select();
					};
					vjs_find(o, ".perma").onclick = (e) => {
						e.stopImmediatePropagation();
						e.target.select();
					};
					o.onclick = () => {
						k.addClass(o, x);
						!0 !== Oe && C.play();
					};
				}
				if (_.zoomMenu) {
					var Ye,
						Xe,
						Ue,
						Ve = C.$(".vjs-tech");
					vjs_find(w, ".vjs-poster").style.pointerEvents = "none";
					if (_.zoomInfo) {
						var $e = vjs_El("div", "vjs-zoom-parent vjs-hidden"),
							t = vjs_El("div", "vjs-reset-zoom");
						t.innerHTML = "100%";
						$e.appendChild(t);
						(Qe = vjs_El(
							"div",
							"vjs-reset-center",
							'<span data-id="center" aria-hidden="true" class="vjs-icon-placeholder"></span>',
						)),
							(l = vjs_El(
								"div",
								"vjs-reset-cancel",
								'<span data-id="cancel" aria-hidden="true" class="vjs-icon-placeholder"></span>',
							)),
							(a = vjs_El(
								"div",
								"vjs-reset-info",
								'<span data-id="help" aria-hidden="true" class="vjs-icon-placeholder"></span>',
							));
						$e.appendChild(Qe);
						$e.appendChild(l);
						$e.appendChild(a);
						var Ze = T("Drag zoomed area using your mouse."),
							t = T("Use ZOOM slider or mouse wheel to ZOOM in video."),
							Je = T("ZOOM HELP"),
							Ke = vjs_El("div", "vjs-zoom-help vjs-hidden");
						_.zoomWheel
							? (Ke.innerHTML =
									'<div class="zoom-close">x</div><div>' +
									Je +
									"</div>" +
									t +
									"<div>" +
									Ze +
									"</div>")
							: (Ke.innerHTML =
									'<div class="zoom-close">x</div><div>' +
									Je +
									"</div>" +
									Ze +
									"</div>");
						$e.appendChild(a);
						a.onclick = (e) => {
							et(e);
						};
						function et(e) {
							e.preventDefault();
							k.hasClass(Ke, x) && k.removeClass(Ke, x);
						}
						vjs_find(Ke, ".zoom-close").onclick = () => {
							k.addClass(Ke, x);
						};
						w.appendChild(Ke);
						l.onmouseup = () => {
							As();
						};
						Qe.onmouseup = (e) => {
							ms(e);
						};
						w.appendChild($e);
					}
					t = vjs_find(w, ".vjs-zoom-reset");
					t &&
						(t.onmouseup = () => {
							As();
						});
					w.hasAttribute("tabIndex") || (w.tabIndex = "-1");
					if (_.zoomWheel && !0 !== browser.TOUCH_ENABLED) {
						Ve.addEventListener("mousewheel", tt, { passive: !1 });
						Ve.addEventListener("DOMMouseScroll", tt, { passive: !1 });
						function tt(e) {
							e.preventDefault();
							e.stopImmediatePropagation();
							e = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
							if (
								1 ===
								(d =
									(d = (d = (100 * d + 20 * e) / 100) < 1 ? 1 : d) > 5 ? 5 : d)
							) {
								As();
								_.zoomInfo && k.addClass($e, x);
							} else {
								_.zoomInfo && k.removeClass($e, x);
								ys(Ve, d);
							}
							e = vjs_find(w, ".vjs-zoom-menu");
							if (!0 !== k.hasClass(e, x)) {
								e = ((d - 1) / 4) * 100;
								vjs_find(w, ".vjs-zoom-level").style.height = e + "%";
							}
							Pt(100 * d);
							return !1;
						}
					}
					function st(e) {
						if (d > 1) {
							e.preventDefault();
							e.stopPropagation();
							Ye = !0;
							Ue = [Ve.offsetLeft - e.clientX, Ve.offsetTop - e.clientY];
							m.addEventListener("mouseup", at, !0);
							m.addEventListener("mousemove", it, !0);
						}
					}
					function it(e) {
						e.preventDefault();
						if (Ye) {
							var e = (Xe = { x: e.clientX, y: e.clientY }).x + Ue[0],
								t = Xe.y + Ue[1],
								s = (w.offsetWidth / 2) * (d - 1),
								i = (w.offsetHeight / 2) * (d - 1);
							e > s && (e = s);
							(t = t > i ? i : t) < -1 * i && (t = -1 * i);
							Ve.style.left = (e = e < -1 * s ? -1 * s : e) + "px";
							Ve.style.top = t + "px";
						}
					}
					function at() {
						Ye = !1;
						m.removeEventListener("mouseup", at, !0);
						m.removeEventListener("mousemove", it, !0);
					}
					Ve.onmousedown = (e) => {
						st(e);
					};
					var nt = vjs_find(w, ".vjs-zoom-slider");
					function ot(e, t) {
						Ve.style.pointerEvents = "auto";
						var s = vjs_find(w, ".vjs-zoom-parent"),
							i = e.pageY,
							a = t.offsetHeight;
						const n = t.getBoundingClientRect();
						const o = n.top + window.scrollY;
						(t = i - o),
							(i =
								((t = t > a ? a : t) < 0 && (t = 0),
								parseInt(100 - (t / a) * 100, 10)));
						(i = i < 0 ? 0 : i) > 100 && (i = 100);
						try {
							vjs_find(w, ".vjs-zoom-level").style.height = i + "%";
						} catch (e) {}
						try {
							vjs_find(w, ".zoom-thumb").style.height = i + "%";
						} catch (e) {}
						t = 1 + (4 * i) / 100;
						d = t;
						nt.setAttribute("aria-valuetext", parseInt(100 * t) + "%");
						ys(C.$(".vjs-tech"), t);
						Pt(100 * t);
						if (t > 1) {
							videojs.options.blockKeys = !0;
							k.removeClass(s, x);
						} else {
							As();
							videojs.options.blockKeys = !1;
							k.addClass(s, x);
						}
					}
					nt.onclick = (e) => {
						e.stopImmediatePropagation();
					};
					nt.onmousedown = (e) => {
						lt(e);
					};
					function lt(e) {
						e.stopImmediatePropagation();
						var t = nt;
						ot(e, t);
						m.addEventListener("mousemove", s, !1);
						m.addEventListener("mouseup", i, !1);
						function s(e) {
							ot(e, t);
						}
						function i() {
							m.removeEventListener("mouseup", i);
							m.removeEventListener("mousemove", s);
						}
					}
				}
				var rt = vjs_find(w, ".vjs-extend-speed");
				if (rt) {
					var dt = vjs_find(w, ".vjs-menu-speed"),
						vt = vjs_find(dt, ".vjs-menu-content");
					vt.onkeydown = (t) => {
						const s = t.which;
						if (
							40 === s ||
							38 === s ||
							27 === s ||
							37 === s ||
							13 === s ||
							9 === s
						) {
							t.preventDefault();
							t.stopImmediatePropagation();
							const e = vjs_find(w, ".vjs-cog-menu-button");
							40 === s && Ct(vt);
							38 === s && _t(vt);
							(27 !== s && 37 !== s) ||
								vjs_find(dt, ".vjs-settings-back").click();
							setTimeout(() => {
								rt.focus();
							}, 100);
							if (13 === s) {
								t = yt(vt);
								vt.children[t].click();
								e &&
									setTimeout(() => {
										e.focus();
									}, 100);
							}
							if (9 === s && e) {
								e.click();
								e.focus();
							}
						}
					};
				}
				var ct = vjs_find(w, ".vjs-zoom-menu");
				if (ct) {
					const e = vjs_find(ct, ".vjs-zoom-slider"),
						s = vjs_find(b, ".vjs-zoom-reset");
					ct.onkeydown = (i) => {
						if (27 === i.which || 37 === i.which) {
							i.preventDefault();
							i.stopImmediatePropagation();
							vjs_find(ct, ".vjs-settings-back").click();
							setTimeout(() => {
								vjs_find(w, ".vjs-extend-zoom").focus();
							}, 100);
						}
						if (40 === i.which || (38 === i.which && s !== m.activeElement)) {
							let e = vjs_find(w, ".vjs-zoom-level"),
								t = vjs_find(w, ".vjs-zoom-slider"),
								s = e.style.height;
							s = s ? parseInt(s) : 0;
							38 === i.which
								? (s += 5) > 99 && (s = 100)
								: 40 === i.which && (s -= 5) < 0 && (s = 0);
							e.style.height = s + "%";
							var a = 1 + (4 * s) / 100;
							d = a;
							t.setAttribute("aria-valuetext", 100 * a + "%");
							ys(C.$(".vjs-tech"), a);
							Pt(100 * a);
							var n = vjs_find(w, ".vjs-zoom-parent");
							if (a > 1) {
								videojs.options.blockKeys = !0;
								k.removeClass(n, x);
							} else {
								As();
								videojs.options.blockKeys = !1;
								k.addClass(n, x);
							}
						}
						38 === i.which && e !== m.activeElement && e.focus();
						if (9 == i.which)
							if (s == m.activeElement) {
								vjs_find(w, ".vjs-cog-menu-button").click();
								vjs_find(w, ".vjs-cog-menu-button").focus();
							} else s.focus();
						i.preventDefault();
						i.stopImmediatePropagation();
					};
					s.onkeydown = (t) => {
						if (13 === t.which) {
							t.preventDefault();
							As();
							s.click();
							const e = vjs_find(w, ".vjs-cog-menu-button");
							e &&
								setTimeout(() => {
									e.focus();
								}, 100);
						}
					};
				}
				Dt();
				qt();
				Wt();
				C.trigger("menusReady");
			}
			var ut = !1;
			C.on("timeupdate", () => {
				if (k.hasClass(w, "vjs-ad-playing") || k.hasClass(w, "vjs-dai"))
					return !1;
				var e = C.duration();
				if (0 !== e && e !== 1 / 0) {
					var e = C.video_id(),
						t = C.currentTime();
					if (
						_.limit &&
						(_.limiturl || "" !== _.url) &&
						parseInt(C.duration(), 10) > 0
					) {
						_.startTime &&
							Number(_.startTime) > 0 &&
							Number(_.limit) > 0 &&
							(_.limit = Number(_.startTime) + Number(_.limit));
						if (t > _.limit) {
							C.pause();
							if (!0 !== ut) {
								_.limiturl || (_.limiturl = _.url);
								ut = !0;
								var s = vjs_El("div", "vjs-overlay vjs-limit-overlay"),
									i = vjs_El("a", "vjs-limit");
								i.href = _.limiturl;
								i.target = _.target;
								i.style.textDecoration = "none";
								s.appendChild(i);
								if (_.limitimage) {
									vjs_El("img").src = _.limitimage;
									i.innerHTML = '<img src="' + _.limitimage + '" />';
								} else {
									var a = vjs_El("span");
									a.innerHTML =
										_.limitmessage + "<span>" + _.limiturl + "</span>";
									i.appendChild(a);
								}
								w.appendChild(s);
							}
						}
					}
					null !== e &&
						_.resume &&
						e &&
						(t = parseFloat(t)) > 1 &&
						bs(String("vjs_resume-" + e), (t = t < 2 ? 0 : t));
				}
			});
			C.on("volumechange", () => {
				C.volume() > 0 && bs("volume", C.volume());
			});
			C.on("seeked", () => {
				if (k.hasClass(w, "vjs-ad-playing") || k.hasClass(w, "vjs-dai"))
					return !1;
			});
			window.addEventListener("message", (e) => {
				if (e.data.id && e.data.message)
					try {
						if (w.id == e.data.id)
							switch (e.data.message) {
								case "play":
									C.play();
									break;
								case "pause":
									C.pause();
									break;
								case "mute":
									C.mute(!0);
									break;
								case "unmute":
									C.mute(!1);
									break;
								case "dispose":
									C.dispose();
							}
					} catch (e) {}
			});
			_.outstream && C.on("playing", ds);
			C.one("play", () => {
				let e = 500;
				_.outstream && "always" == _.outstreamClose && ls(!1);
				_.outstream && (e = 2500);
				setTimeout(() => {
					c.classList.remove("vjs-null");
				}, e);
			});
			G = !1;
			C.on("ended", () => {
				if (_.outstream && !w.classList.contains("vjs-set-visit"))
					if (!0 !== G) G = !0;
					else {
						var e = vjs_find(w, ".outstream-end");
						e && w.removeChild(e);
						e = vjs_El("div", "vjs-overlay outstream-end");
						if (C.el_.classList.contains("vjs-set-replay")) {
							e.innerHTML = "<p>" + T("Replay") + "</p>";
							e.style.cursor = "pointer";
							w.appendChild(e);
							e.onclick = () => {
								w.removeChild(e);
								C.play();
								w.classList.add("vjs-ad-playing");
							};
						} else {
							e.innerHTML = "<p>" + T("THE END") + "</p>";
							w.appendChild(e);
						}
						"end" == _.outstreamClose && ls(!1);
						C.trigger("outstreamEnded");
						window.parent &&
							window.parent.postMessage(
								{ id: w.id, message: "outstreamEnded" },
								"*",
							);
					}
				else if (w.classList.contains("vjs-set-visit")) ls(!0);
				else if (
					!(
						k.hasClass(w, "vjs-ad-playing") ||
						k.hasClass(w, "vjs-dai") ||
						k.hasClass(w, "vjs-up-next")
					)
				) {
					var t = !0;
					if (_.playlist) {
						t = !1;
						C.playlist.currentIndex() === C.playlist.lastIndex() &&
							!0 !== C.playlist.repeat() &&
							(t = !0);
					}
					if (t) {
						C.video_id();
						if (_.customEnd) {
							var s = vjs_El("div", "vjs-cend"),
								t = vjs_El("div", "cend-inner");
							s.appendChild(t);
							t.innerHTML = _.customEnd;
							k.addClass(he.el_, x);
							C.el().appendChild(s);
							C.one("play", () => {
								C.el().removeChild(s);
							});
						} else
							_.endAction
								? _.settingsButton && "share" === _.endAction && _.shareMenu
									? C.share()
									: _.settingsButton &&
										"related" === _.endAction &&
										_.relatedMenu &&
										y &&
										C.related()
								: setTimeout(() => {
										C.el_.classList.add("vjs-ended");
										k.removeClass(he.el_, x);
									}, 100);
					}
				}
			});
			C.one("play", () => {
				F.classList.remove("vjs-bp-block");
				vs();
			});
			C.on("loadstart", () => {
				const e = C.currentType();
				e.indexOf("audio") > -1
					? w.classList.add("vjs-audio")
					: w.classList.remove("vjs-audio");
			});
			C.on("playing", () => {
				if (k.hasClass(w, "vjs-ad-playing") || k.hasClass(w, "vjs-dai"))
					return !1;
				y && S(y, !1);
				o && S(o, !1);
				k.removeClass(Y, x);
				k.removeClass(Y, "vjs-abs-hidden");
				(C.remoteTextTracks ? C.remoteTextTracks() : []).length < 1 &&
					browser.IS_IOS &&
					k.addClass(vjs_find(w, ".vjs-subs-caps-button"), x);
			});
			C.on("userinactive", () => {
				C.textTrackSettings.updateDisplay();
			});
			C.on("useractive", () => {
				C.textTrackSettings.updateDisplay();
			});
			(s = C.$(".vjs-tech")).autoplay && s.play().then(fs, hs);
			C.on("play", () => {
				var e = k.hasClass(w, "vjs-live");
				if (e && Date.now() - O > 18e4 && O > 0) {
					const e = C.currentSource();
					C.pause();
					C.src(e);
					C.play();
				}
				e = vjs_find(w, ".vjs-picture-in-picture-control");
				!0 !== _.pipButton && e && e.parentNode.removeChild(e);
				if (_.singlePlay) {
					var t = vjs_mfind(m, "video");
					if (t.length > 1)
						for (var s = 0; s < t.length; s++) {
							var i = C.$(".vjs-tech");
							t[s] !== i && t[s].pause();
						}
				}
				_.currentSlide = "";
				ss();
				Y.style.opacity = 1;
				if (!ve) {
					Mt();
					ve = !0;
				}
			});
			if (_.mirrorButton) {
				C.controlBar.mirrorButton = C.controlBar.addChild("button", {
					el: k.createEl(
						"button",
						{
							text: "Mirror view",
							className: "vjs-mirror-button vjs-control vjs-button",
						},
						{ role: "button", "aria-live": "polite", "aria-disabled": "false" },
					),
				});
				C.controlBar.mirrorButton.el_.innerHTML = wt(
					"mirror1",
					T("Mirror View"),
				);
				C.controlBar.el_.insertBefore(C.controlBar.mirrorButton.el_, r.el_);
				var pt = (e) => {
					var t = "rotateY(0)";
					if (k.hasClass(e.target, "vjs-mirrored")) {
						k.removeClass(e.target, "vjs-mirrored");
						n(e.target, "mirror1");
					} else {
						k.addClass(e.target, "vjs-mirrored");
						t = "rotateY(180deg)";
						n(e.target, "mirror2");
					}
					e = C.$(".vjs-tech");
					e.style.transform = t;
					e.style.webkitTransform = t;
				};
				C.controlBar.mirrorButton.el_.onclick =
					C.controlBar.mirrorButton.el_.ontouchend = (e) => {
						e.stopPropagation();
						pt(e);
					};
			}
			gs();
			if (videojs.svgIcons) {
				function ft() {
					w.querySelectorAll(".vjs-icon-placeholder").forEach((t) => {
						if (t.getAttribute("data-id")) {
							const e = t.getAttribute("data-id").trim();
							const s = "http://www.w3.org/2000/svg",
								i = m.createElementNS(s, "svg"),
								a =
									(i.setAttributeNS(null, "viewBox", "0 0 32 32"),
									m.createElementNS(s, "use"));
							i.appendChild(a);
							a.setAttributeNS(null, "href", "#vjs-icon-" + e);
							t.appendChild(i);
							videojs.dom.addClass(t, "vjs-svg-icon");
						}
					});
				}
				const s = {
					"vjs-big-play-button": "big-play",
					"vjs-picture-in-picture-control": "pip",
					"vjs-fullscreen-control": "fullscreen",
					"vjs-play-control": "play",
					"vjs-chapters-button": "chapters",
					"vjs-descriptions-button": "descriptions",
					"vjs-subs-caps-button": "captions",
					"vjs-audio-button": "audio",
				};
				for (var ht in s)
					if (Object.hasOwn(s, ht)) {
						const t = vjs_find(w, "." + ht);
						if (t) {
							const e = t.querySelector(".vjs-icon-placeholder");
							e && e.setAttribute("data-id", s[ht]);
						}
					}
				mt(!0);
				ft();
				C.on("pause", () => {
					O = Date.now();
					n(vjs_find(c, ".vjs-play-control"), "play");
					n(vjs_find(w, ".vjs-b-p-b"), "play");
				});
				C.on("play", () => {
					n(vjs_find(c, ".vjs-play-control"), "pause");
					n(vjs_find(w, ".vjs-b-p-b"), "pause");
				});
				C.on("ended", () => {
					n(vjs_find(c, ".vjs-play-control"), "replay");
				});
				C.$(".vjs-tech").addEventListener("enterpictureinpicture", () => {
					n(vjs_find(c, ".vjs-picture-in-picture-control"), "pip-full");
				});
				C.$(".vjs-tech").addEventListener("leavepictureinpicture", () => {
					n(vjs_find(c, ".vjs-picture-in-picture-control"), "pip");
				});
				C.on("volumechange", () => {
					mt();
				});
				C.on("fullscreenchange", () => {
					const e = vjs_find(c, ".vjs-fullscreen-control");
					C.isFullscreen() ? n(e, "fullscreen-back") : n(e, "fullscreen");
				});
				function mt(e) {
					const t = C.volume(),
						s = vjs_find(c, ".vjs-mute-control");
					var i = "mute";
					if (C.muted()) i = "mute";
					else {
						t > 0 && (i = "volume1");
						t > 0.25 && (i = "volume2");
						t > 0.75 && (i = "volume3");
					}
					e
						? s
								.querySelector(".vjs-icon-placeholder")
								.setAttribute("data-id", i)
						: n(s, i);
				}
			}
			C.el_.style.visibility = "visible";
			C.trigger("nuevoReady");
		}
		function At(e) {
			return e.touches[0].pageX || null;
		}
		function jt(e) {
			if ("mouse" === e.pointerType) {
				Q = !0;
				w.classList.remove(te);
				w.classList.remove(ee);
				bt(!1);
			}
		}
		function gt() {
			w.classList.remove("vjs-has-mouse");
			bt(!0);
		}
		function bt(e) {
			var t = vjs_find(w, ".vjs-rewind-control"),
				s = vjs_find(w, ".vjs-forward-control"),
				i = vjs_find(w, ".vjs-extend-zoom"),
				a = vjs_find(w, ".vjs-related"),
				n = vjs_find(w, ".vjs-grid"),
				o = null,
				l = null;
			if (n) {
				o = vjs_find(n, ".vjs-arrow-prev");
				l = vjs_find(n, ".vjs-arrow-next");
			}
			if (e && _.touchControls) {
				w.classList.remove("vjs-has-mouse");
				t &&
					(_.touchRewindForward && _.touchControls
						? k.addClass(t, x)
						: t.setAttribute("style", "display:block!important"));
				s &&
					(_.touchRewindForward && _.touchControls
						? k.addClass(s, x)
						: s.setAttribute("style", "display:block!important"));
				i && k.addClass(i, x);
				a && k.addClass(a, "vjs-scroll");
				o && k.addClass(o, x);
				l && k.addClass(l, x);
			} else {
				w.classList.add("vjs-has-mouse");
				t && k.removeClass(t, x);
				s && k.removeClass(s, x);
				i && k.removeClass(i, x);
				if (a) {
					k.removeClass(a, x);
					k.removeClass(a, "vjs-scroll");
				}
				o && k.removeClass(o, x);
				l && k.removeClass(l, x);
			}
		}
		function yt(e) {
			for (var t = m.activeElement, s = 0; s < e.children.length; s++)
				if (e.children[s] === t) return s;
			return 0;
		}
		function Ct(e) {
			const t = yt(e);
			if (t < e.children.length)
				for (var s = t + 1; s < e.children.length; s++)
					if (e.children[s] && e.children[s].offsetParent) {
						e.children[s].focus();
						break;
					}
		}
		function _t(e) {
			const t = yt(e);
			if (t > 0)
				for (var s = t - 1; s < e.children.length; s--)
					if (e.children[s] && e.children[s].offsetParent) {
						e.children[s].focus();
						break;
					}
		}
		function wt(e, t) {
			return (
				'<span class="vjs-icon-placeholder" aria-hidden="true" data-id="' +
				e +
				'"></span><span class="vjs-control-text" aria-live="polite">' +
				t +
				"</span>"
			);
		}
		function kt() {
			if (w.className.includes(ee)) xt();
			else if (!m.pictureInPictureElement) {
				k.removeClass(w, te);
				k.addClass(w, ee);
				k.removeClass(w, "vjs-user-inactive");
				k.addClass(w, "vjs-user-active");
				N("");
				Tt();
			}
		}
		function xt() {
			clearTimeout(C.touchtimer);
			k.removeClass(w, ee);
			k.addClass(w, te);
			k.removeClass(w, "vjs-user-active");
			k.addClass(w, "vjs-user-inactive");
			N("");
		}
		function Tt() {
			clearTimeout(C.touchtimer);
			C.userActive(!1);
			C.touchtimer = setTimeout(xt, fe);
		}
		function Et(e) {
			C.options_.inactivityTimeout = fe;
			kt();
		}
		function S(e, t) {
			if (e)
				if (t) {
					k.removeClass(e, x);
					e.ariaHidden = "false";
				} else {
					k.addClass(e, x);
					e.ariaHidden = "true";
				}
		}
		function It(e) {
			var t = "vjs-rewind-control",
				t = C.controlBar.addChild("button", {
					el: k.createEl(
						"button",
						{
							className:
								(t = e ? "vjs-rewind-control vjs-rewind-first" : t) +
								" vjs-control vjs-button vjs-rewind-" +
								_.rewindforward,
						},
						{ type: "button", "aria-disabled": "false" },
					),
				});
			t.el_.innerHTML = wt("rewind" + _.rewindforward, T("Rewind"));
			e
				? "party" === _.skin
					? c.insertBefore(
							t.el_,
							C.controlBar.getChild("playToggle").el_.nextSibling,
						)
					: c.insertBefore(t.el_, C.controlBar.getChild("playToggle").el_)
				: C.controlBar.el_.insertBefore(
						t.el_,
						C.controlBar.getChild("playToggle").el_.nextSibling,
					);
			t.el_.onclick = t.el_.ontouchend = (e) => {
				e.stopImmediatePropagation();
				C.rewind();
			};
		}
		function N(e) {
			if (!C.isDisposed() && !Z) {
				e = e || vjs_find(w, ".vjs-play-control");
				if (k.hasClass(e, "vjs-cast")) return !1;
				e = e.className;
				if (
					("string" === typeof e || e instanceof String) &&
					!(e.indexOf("vjs-settings-item") > -1)
				) {
					if (e.indexOf("vjs-quality-button") < 0) {
						var t = vjs_find(I, ".vjs-menu");
						k.hasClass(t, "vjs-lock-showing") &&
							k.removeClass(t, "vjs-lock-showing");
					}
					e.indexOf("vjs-chapters-button") < 0 &&
						C.controlBar.getChild("chaptersButton").unpressButton();
					e.indexOf("vjs-descriptions-button") < 0 &&
						C.controlBar.getChild("descriptionsButton").unpressButton();
					e.indexOf("vjs-subs-caps-button") < 0 &&
						C.controlBar.getChild("subsCapsButton").unpressButton();
					e.indexOf("vjs-audio-button") < 0 &&
						C.controlBar.getChild("audioTrackButton").unpressButton();
					if (
						e.indexOf("vjs-cog-button") < 0 &&
						e.indexOf("vjs-extend-speed") < 0
					) {
						Lt();
						k.removeClass(E, "vjs-cog-active");
					}
				}
			}
		}
		function Lt() {
			for (
				var e = g, t = vjs_mfind(w, ".vjs-submenu"), s = 0;
				s < t.length;
				s++
			) {
				k.addClass(t[s], x);
				t[s] === e && k.removeClass(e, x);
			}
			k.removeClass(u, "vjs-lock-showing");
			k.addClass(u, x);
			E.ariaExpanded = "false";
		}
		function Mt() {
			var e = C.el_.offsetWidth;
			[
				"vjs-1600",
				"vjs-1080",
				"vjs-920",
				"vjs-600",
				"vjs-640",
				"vjs-480",
				"vjs-360",
			].forEach((e) => {
				k.removeClass(w, e);
			});
			if (e < 360) {
				k.addClass(w, "vjs-360");
				k.addClass(w, "vjs-480");
			} else if (e < 480) k.addClass(w, "vjs-480");
			else if (e < 640) {
				k.addClass(w, "vjs-640");
				e < 600 && k.addClass(w, "vjs-600");
			} else if (e < 920) k.addClass(w, "vjs-920");
			else if (e < 1080) {
				k.addClass(w, "vjs-920");
				k.addClass(w, "vjs-1080");
			} else {
				k.addClass(w, "vjs-920");
				k.addClass(w, "vjs-1080");
				k.addClass(w, "vjs-1600");
			}
		}
		function Bt() {
			Mt();
			Rt();
			Wt();
			N("");
		}
		function Ht(e) {
			C.options_.innactivityTimeout = pe;
			e.stopImmediatePropagation();
			N(e.target);
		}
		function St(e) {
			w.contains(e.target) || xt();
		}
		function Nt() {
			for (
				var e = 0,
					t = vjs_mfind(w, ".item-quality"),
					s =
						(Array.isArray(t) &&
							t.forEach((e) => {
								e.onclick = null;
							}),
						vjs_mfind(w, ".item-quality")),
					e = 0;
				e < s.length;
				e++
			)
				s[e].parentNode.removeChild(s[e]);
			t = vjs_find(w, ".vjs-extend-quality");
			t && k.addClass(t, x);
			vjs_find(I, ".vjs-menu .vjs-menu-content").innerHTML = "";
			k.addClass(I, x);
		}
		function Pt(e) {
			try {
				vjs_find(w, ".vjs-reset-zoom").innerHTML = parseInt(e, 10) + "%";
				vjs_find(w, ".zoom-label").innerHTML = parseInt(e, 10) + "%";
			} catch (e) {}
		}
		function qt() {
			var i = vjs_find(w, ".vjs-menu-speed"),
				a = vjs_find(w, ".vjs-zoom-menu"),
				n = vjs_find(w, ".vjs-menu-quality"),
				t = w.querySelector(".vjs-settings-list"),
				s = (e, t, s) => {
					k.addClass(g, x);
					k.removeClass(t, x);
					setTimeout(() => {
						i &&
							i === t &&
							vjs_find(i, ".vjs-menu-content").children[0].focus();
						a &&
							(a !== t
								? k.addClass(a, x)
								: vjs_find(a, ".vjs-zoom-slider").focus());
						n && n !== t && k.addClass(n, x);
						j.style.width = v[s].width + "px";
						j.style.height = v[s].height + "px";
					}, 10);
				},
				o = (e) => {
					a && k.addClass(a, x);
					i && k.addClass(i, x);
					n && k.addClass(n, x);
					k.removeClass(g, x);
					j.style.width = v.cogMenu.width + "px";
					j.style.height = v.cogMenu.height + "px";
					Pt(100 * d);
					setTimeout(() => {
						t.children[0].focus();
					}, 100);
				};
			if (i) {
				var e = vjs_find(w, ".vjs-extend-speed"),
					e =
						((e.onclick = e.ontouchend =
							(e) => {
								e.preventDefault();
								e.stopImmediatePropagation();
								s(e, i, "speedMenu");
							}),
						vjs_find(i, ".vjs-settings-back"));
				e.onclick = e.ontouchend = (e) => {
					e.preventDefault();
					e.stopImmediatePropagation();
					o(e);
				};
			}
			if (a) {
				e = vjs_find(w, ".vjs-extend-zoom");
				e.onclick = e.ontouchend = (e) => {
					e.stopPropagation();
					s(e, a, "zoomMenu");
				};
				vjs_find(a, ".vjs-settings-back").onclick = (e) => {
					e.preventDefault();
					e.stopPropagation();
					o(e);
				};
			}
			var l = (e) => {
				if (!vjs_find(w, ".vjs-tech-chromecast")) {
					Wt();
					a && k.addClass(a, x);
					i && k.addClass(i, x);
					if (!0 !== k.hasClass(u, "vjs-lock-showing")) {
						e.target.ariaExpanded = "true";
						N(e.target);
						k.addClass(u, "vjs-lock-showing");
						vjs_find(E, ".vjs-control-text").style.opacity = 0;
						k.addClass(e.target, "vjs-cog-active");
						k.removeClass(u, x);
						k.removeClass(g, x);
						j.style.width = v.cogMenu.width + "px";
						j.style.height = v.cogMenu.height + "px";
						Pt(100 * d);
						t.children[0].focus();
						r();
					} else {
						Lt();
						k.removeClass(e.target, "vjs-cog-active");
					}
				}
			};
			function r() {
				function e(e) {
					var t = e.which;
					if (
						40 === t ||
						38 === t ||
						13 === t ||
						39 === t ||
						27 === t ||
						9 === t
					) {
						e.preventDefault();
						e.stopImmediatePropagation();
						40 === t && Ct(Be);
						38 === t && _t(Be);
						13 === t && e.target.click();
						39 === t &&
							k.hasClass(e.target, "vjs-menu-forward") &&
							e.target.click();
						if (27 === t || 9 === t) {
							E.click();
							E && E.focus();
						}
					}
				}
				for (
					var t = vjs_mfind(w, ".vjs-settings-list li"), s = 0;
					s < t.length;
					s++
				)
					t[s].addEventListener("keydown", e);
			}
			E.onclick = E.ontouchend = (e) => {
				e.preventDefault();
				e.stopPropagation();
				l(e);
			};
			E.onmouseover = () => {
				!0 !== k.hasClass(u, "vjs-lock-showing") &&
					vjs_find(E, ".vjs-control-text").removeAttribute("style");
			};
		}
		function Dt() {
			var e = I,
				t = vjs_find(e, ".vjs-menu"),
				l = vjs_find(t, ".vjs-menu-content");
			if (oe > 1) {
				var s = (t) => {
					if (k.hasClass(t.target, "vjs-quality-button")) {
						if (k.hasClass(t.target, "vjs-cast")) return !1;
						var s = vjs_find(t.target, ".vjs-control-text"),
							i = vjs_find(e, ".vjs-menu");
						if (k.hasClass(i, "vjs-lock-showing")) {
							t.target.ariaExpanded = "false";
							k.removeClass(i, "vjs-lock-showing");
							s && s.removeAttribute("style");
						} else {
							N(t.target);
							var a = i.getBoundingClientRect(),
								n = w.getBoundingClientRect();
							const e = w.offsetHeight - (n.bottom - a.bottom) - 30;
							k.hasClass(w, "vjs-casting") || (l.style.maxHeight = e + "px");
							k.addClass(i, "vjs-lock-showing");
							t.target.ariaExpanded = "true";
							s.style.opacity = "0";
							var o = vjs_find(i, "ul");
							setTimeout(() => {
								o.children[0].focus();
							}, 100);
						}
					}
				};
				e.onclick = e.ontouchend = (e) => {
					e.stopPropagation();
					s(e);
				};
				e.onkeydown = (e) => {
					13 === e.which && s(e);
				};
				e.onmouseover = (e) => {
					var t = vjs_find(e.target, ".vjs-menu");
					if (t && !0 !== k.hasClass(t, "vjs-lock-showing")) {
						t = vjs_find(e.target, ".vjs-control-text");
						t && t.removeAttribute("style");
					}
				};
			}
			var a = vjs_find(w, ".vjs-menu-quality"),
				i = (e, t, s) => {
					k.addClass(g, x);
					k.removeClass(t, x);
					b && b !== t && k.addClass(b, x);
					a && a !== t && k.addClass(a, x);
					j.style.width = v[s].width + "px";
					j.style.height = v[s].height + "px";
					const i = vjs_find(a, ".vjs-menu-content");
					i && i.children[0].focus();
				},
				n = (e) => {
					b && k.addClass(b, x);
					Le && k.addClass(Le, x);
					a && k.addClass(a, x);
					k.removeClass(g, x);
					j.style.width = v.cogMenu.width + "px";
					j.style.height = v.cogMenu.height + "px";
					Pt(100 * d);
				};
			if (a && _.qualityMenu) {
				k.removeClass(vjs_find(w, ".vjs-cog-menu-button"), x);
				a.onclick = (e) => {
					e.stopPropagation();
				};
				(t = vjs_find(w, ".vjs-extend-quality")),
					(t =
						((t.onclick = t.ontouchend =
							(e) => {
								e.preventDefault();
								e.stopPropagation();
								i(e, a, "qualityMenu");
							}),
						vjs_find(a, ".vjs-settings-back")));
				t.onclick = t.ontouchend = (e) => {
					e.stopPropagation();
					n(e);
				};
			}
		}
		function Rt() {
			if (!0 === _.menus) {
				var e = _.related.length,
					t = 0.8,
					s = 800;
				if (vjs_find(w, ".rel-block")) {
					k.removeClass(vjs_find(w, ".rel-block"), "rel-anim");
					var i = w.offsetWidth,
						a = i * t,
						n =
							(a > s && (a = s),
							parseInt(vjs_find(w, ".vjs-related").style.maxWidth, 10));
					isNaN(n) && (n = 0);
					a > (n = parseInt(n, 10) < 100 ? s : n) && (a = n);
					var o = vjs_find(w, ".vjs-related");
					o.style.maxWidth = s < n ? s + "px" : "800px";
					o.style.width = 100 * t + "%";
					var n = 3,
						l = 2;
					e < 5 && 3 !== e && (n = 2);
					e < 4 && (l = 1);
					if (a < 480) {
						n = 2;
						l = 1;
					}
					var r = (a / n) * 0.5625,
						d = a / n,
						s = Math.ceil(e / 6);
					A > s && (A = s);
					ne = s;
					2 === n && 2 === l && (ne = Math.ceil(e / 4));
					2 === n && 1 === l && (ne = Math.ceil(e / 2));
					(t = r * l), (s = ((o.style.height = t + "px"), i / 2 - a / 2));
					o.style.top = 0.55 * w.offsetHeight - t / 2 + "px";
					o.style.left = i / 2 - a / 2 + "px";
					(n = vjs_find(w, ".vjs-arrow-prev")),
						(e = vjs_find(w, ".vjs-arrow-next"));
					if (de() && n && e) {
						vjs_find(w, ".vjs-prev").getBoundingClientRect();
						t = 37;
						n.style.left = s - t + "px";
						e.style.left = a + s + "px";
						k.removeClass(e, "vjs-disabled");
						k.removeClass(n, "vjs-disabled");
						A === ne && k.addClass(e, "vjs-disabled");
						1 === A && k.addClass(n, "vjs-disabled");
					}
					if (A > 1) {
						(i = o.offsetWidth), (t = (A - 1) * i);
						vjs_find(w, ".rel-block").style.left = "-" + t + "px";
					}
					for (
						var v = 0, c = 0, u = w.querySelectorAll(".rel-parent"), p = 0;
						p < u.length;
						p++
					) {
						var f = u[p];
						f.style.left = v + "px";
						if (1 === c && l > 1) {
							f.style.top = r + "px";
							v += d;
						} else f.style.top = 0;
						1 === l && (v += d);
						f.style.width = d + "px";
						f.style.height = r + "px";
						(!(l > 1) || 2 === ++c) && (c = 0);
					}
					k.addClass(vjs_find(w, ".rel-block"), "rel-anim");
				}
			}
		}
		function Wt() {
			if (!0 === _.menus) {
				var i = vjs_find(w, ".vjs-menu-speed"),
					a = vjs_find(w, ".vjs-zoom-menu"),
					n = vjs_find(w, ".vjs-menu-quality");
				j.style.width = "auto";
				j.style.height = "auto";
				i && k.addClass(i, x);
				a && k.addClass(a, x);
				n && k.addClass(n, x);
				var o = vjs_find(w, ".vjs-menu-settings");
				k.removeClass(o, x);
				const e = window.getComputedStyle(o),
					t = parseInt(e.getPropertyValue("padding-bottom"));
				v.cogMenu = { width: o.clientWidth, height: o.clientHeight - t };
				if (i) {
					k.addClass(g, x);
					a && k.addClass(a, x);
					n && k.addClass(n, x);
					k.removeClass(i, x);
					k.addClass(i, "vjs-invisible");
					v.speedMenu = { width: i.clientWidth, height: i.clientHeight };
					k.removeClass(i, "vjs-invisible");
					k.addClass(i, x);
				}
				if (n && _.qualityMenu) {
					k.addClass(g, x);
					a && k.addClass(a, x);
					i && k.addClass(i, x);
					k.removeClass(n, x);
					k.addClass(n, "vjs-invisible");
					v.qualityMenu = { width: n.offsetWidth + 10, height: n.offsetHeight };
					k.removeClass(n, "vjs-invisible");
					k.addClass(n, x);
					k.removeClass(vjs_find(w, ".vjs-cog-menu-button"), x);
				}
				if (a) {
					k.addClass(g, x);
					i && k.addClass(i, x);
					n && k.addClass(n, x);
					k.removeClass(a, x);
					k.addClass(a, "vjs-invisible");
					a.style.width = "auto";
					v.zoomMenu = { width: a.clientWidth, height: a.clientHeight + 1 };
					k.removeClass(a, "vjs-invisible");
					k.addClass(a, x);
				}
				var l = vjs_mfind(w, ".vjs-submenu");
				if (l) for (var r = 0; r < l.length; r++) k.addClass(l[r], x);
				k.removeClass(g, x);
				k.removeClass(o, "vjs-invisible");
				k.removeClass(g, x);
				(_.speedMenu ||
					_.zoomMenu ||
					_.relatedMenu ||
					_.shareMenu ||
					_.qualityMenu) &&
					k.removeClass(vjs_find(w, ".vjs-cog-menu-button"), x);
				(i = j.getBoundingClientRect()), (n = w.getBoundingClientRect());
				const s = w.offsetHeight - (n.bottom - i.bottom);
				j.style.maxHeight = s + "px";
			}
		}
		function zt(e, t) {
			var e = parseInt(e, 10),
				s = '<i class="vjs-hd-icon vjs-hd-home vjs-hidden"></i>',
				i = "";
			if (_.hdicon) {
				i = "HD";
				e > 2159 && (i = "4K");
				e > _.minhd - 1 &&
					(s = '<i class="vjs-hd-icon vjs-hd-home">' + i + "</i>");
			}
			if (_.qualityMenu) {
				vjs_find(w, ".quality-label").innerHTML = t + s;
				i = vjs_find(w, ".vjs-hd");
				e > _.minhd - 1 ? k.removeClass(i, x) : k.addClass(i, x);
			} else vjs_find(I, ".quality-span").innerHTML = t + s;
		}
		function Qt(e, t) {
			return e.res && t.res ? +t.res - +e.res : 0;
		}
		function Zt(e) {
			if (_.hdicon && _.qualityMenu) {
				var t = vjs_find(w, ".vjs-hd");
				if (e > _.minhd - 1) {
					var s = "HD";
					t.innerHTML = s = e > 2159 ? "4K" : s;
					k.removeClass(t, x);
				} else k.addClass(t, x);
			}
		}
		function Ot(e) {
			var r = null,
				o = null;
			if (!(e.length < 2)) {
				try {
					r = C.dash.mediaPlayer || null;
				} catch (e) {}
				var t = C.options().html5.hlsjsConfig || null,
					d = !0;
				t && !1 === t.smoothQualityChange && (d = !1);
				Nt();
				Wt();
				for (var s = [], i = !1, a = 0; a < e.length; a++) {
					for (var i = !1, n = 0; n < s.length; n++)
						e[a].height === s[n].height &&
							e[a].bitrate === s[n].bitrate &&
							(i = !0);
					!0 !== i && s.push(e[a]);
				}
				_.is_auto = !0;
				var v = 0,
					c = 0,
					t = "bitrate";
				s.forEach((e) => {
					e.height > 0 && v++;
					e.bitrate > 0 && c++;
				});
				s = (s = sortByKey(s, (t = v > c ? "height" : t))).reverse();
				oe = s.length + 1;
				var u = "vjs-menu-item item-quality",
					t = "vjs-menu-item item-quality vjs-checked",
					p = "";
				s.forEach((e) => {
					var t = "";
					if (e.height) {
						var s = parseInt(e.height, 10);
						if (_.hdicon && s > _.minhd - 1) {
							var i = "HD";
							s > 1079 && _.minhd < 1080 && (i = "FullHD");
							t =
								'<i class="vjs-hd-icon">' + (i = s > 2159 ? "4K" : i) + "</i>";
							Zt(s);
						}
					}
					var i = parseInt(e.bitrate, 10) || 0,
						s = parseInt(e.height, 10) || 0,
						a = 0;
					i > 0 && (a = Math.round(i / 1e3));
					if (s > 0 || i > 0) {
						var n = u,
							o = a + " kbps",
							l = "",
							r = "";
						if (v === c) {
							l = _.resOnly
								? s + "p" + t + "</li>"
								: s + "p <i>(" + o + ")</i>" + t + " </li>";
							r = T("set quality to ") + s.toString() + "p";
						} else if (v > c) {
							l = s + "p" + t + "</li>";
							r = T("Set quality to") + s.toString() + "p";
						} else {
							l = a + " kbps</li>";
							r = T("Set quality to") + a.toString() + " kbps";
						}
						o =
							'<li aria-label="' +
							r +
							'" data-id="' +
							e.index +
							'" class="' +
							n +
							'" data-bitrate="' +
							i +
							'" data-height="' +
							s +
							'" tabindex="0" role="menuitemradio" aria-live="off" aria-disabled="false">';
						p += o + l;
					}
				});
				p +=
					'<li id="auto" class="vjs-menu-item item-quality auto-res vjs-checked" data-height="Autores"' +
					t +
					' tabindex="0" aria-label="' +
					T("Set auto quality") +
					'" role="menuitem" aria-live="off" aria-disabled="false">Auto<i class="autores"></i></li>';
				t = vjs_find(w, ".quality-span");
				(t = _.qualityMenu ? vjs_find(w, ".quality-label") : t).innerHTML =
					"Auto";
				if (_.qualityMenu) {
					as();
					(l = vjs_find(w, ".vjs-menu-quality .vjs-menu-content")).innerHTML =
						l.innerHTML + p;
					k.removeClass(vjs_find(w, ".vjs-extend-quality"), x);
					k.removeClass(E, x);
				} else {
					var l = vjs_find(I, ".vjs-menu"),
						t = vjs_find(l, ".vjs-menu-title"),
						t =
							(t && l.removeChild(t),
							vjs_El("div", "vjs-menu-title", T("Quality")));
					l.prepend(t);
					vjs_find(I, ".vjs-menu .vjs-menu-content").innerHTML = p;
					k.removeClass(I, x);
				}
				var f = vjs_mfind(w, ".item-quality");
				Dt();
				Wt();
				l.addEventListener("keydown", Gt);
				C.on("qualityChange", (e, t) => {
					r && (o = { height: t.height, bitrate: t.bitrate });
					t = vjs_find(w, ".auto-res");
					t && t.className.indexOf("vjs-checked") > -1 && g();
				});
				for (
					var h = (e) => {
							e.preventDefault();
							e.stopPropagation();
							f.forEach((e) => {
								k.removeClass(e, "vjs-checked");
							});
							k.removeClass(vjs_find(w, ".auto-res"), "vjs-checked");
							k.addClass(e.target, "vjs-checked");
							var t = e.target.getAttribute("id");
							Ft();
							"auto" === t ? g(!0) : b(e.target);
						},
						m = 0;
					m < f.length;
					m++
				) {
					var A = f[m],
						j = (A.addEventListener("click", h), !1);
					A.addEventListener(
						"touchstart",
						() => {
							j = !1;
						},
						{ passive: !0 },
					);
					A.addEventListener(
						"touchmove",
						() => {
							j = !0;
						},
						{ passive: !0 },
					);
					A.ontouchend = (e) => {
						if (!j) {
							e.stopPropagation();
							h(e);
						}
					};
				}
				"undefined" !== _.startLevel ? y(parseInt(_.startLevel, 10)) : g(!1);
			}
			function g(e) {
				k.hasClass(w, "vjs-has-started") && k.addClass(Y, x);
				if (r) {
					r.updateSettings({
						streaming: { abr: { autoSwitchBitrate: { video: !0 } } },
					});
					var t = vjs_find(w, ".auto-res");
					t &&
						(t.className = "vjs-menu-item item-quality auto-res vjs-checked");
					vjs_find(w, ".quality-span").innerHTML = "Auto";
				}
				if (e && !r)
					if (C.hlsjs)
						d ? (C.hlsjs.nextLevel = -1) : (C.hlsjs.currentLevel = -1);
					else for (var s = 0; s < C.qualities.length; s++) C.setQuality(s, !0);
				(t = vjs_find(w, ".auto-res")) &&
					(t.className = "vjs-menu-item item-quality auto-res vjs-checked");
				var e = null,
					i = "",
					a = "",
					n = 0;
				if ((e = r ? o : C.qualities[C.qualityIndex])) {
					a =
						(n = e.height ? parseInt(e.height, 10) : n) > 0
							? e.height + "p"
							: Math.round(e.bitrate / 1e3) + "kbps";
					t && (t.innerHTML = 'Auto<i class="autores">' + a + "</i>");
					if (_.hdicon) {
						n >= _.minhd - 1 && (i = "HD");
						n > 2159 && (i = "4K");
						Zt(n);
					}
				}
				me =
					"" === i
						? "vjs-hd-icon vjs-hd-home vjs-hidden"
						: "vjs-hd-icon vjs-hd-home";
				t = vjs_find(w, ".quality-span");
				(t = _.qualityMenu ? vjs_find(w, ".quality-label") : t).innerHTML =
					void 0 !== e ? 'Auto<i class="' + me + '">' + i + "</i>" : "Auto";
			}
			function b(e) {
				vjs_find(w, ".auto-res").innerHTML = 'Auto<i class="autores"></i>';
				var t = parseInt(e.getAttribute("data-height"), 10),
					s = t,
					i = parseInt(e.getAttribute("data-bitrate"), 10),
					a = C.qualities;
				vjs_mfind(w, ".item-quality").forEach((e) => {
					k.removeClass(e, "vjs-checked");
				});
				k.addClass(e, "vjs-checked");
				e = C.video_id();
				0 === s && (s = i);
				C.trigger("resolutionchange", { id: e, res: s });
				for (var n = 0; n < a.length; n++) {
					C.hlsjs || C.setQuality(n, !1);
					if (a[n].height === s || a[n].bitrate === i)
						if (C.hlsjs)
							d ? (C.hlsjs.nextLevel = n) : (C.hlsjs.currentLevel = n);
						else if (r) {
							r.updateSettings({
								streaming: { abr: { autoSwitchBitrate: { video: !1 } } },
							});
							r.setQualityFor("video", a[n].id);
						} else C.setQuality(n, !0);
				}
				var e = "",
					o = "",
					l = vjs_find(w, ".quality-span");
				_.qualityMenu && (l = vjs_find(w, ".quality-label"));
				if (t > 0) {
					e = "HD";
					t > 2159 && (e = "4K");
					o =
						t > _.minhd - 1
							? '<i class="vjs-hd-icon vjs-hd-home">' + e + "</i>"
							: '<i class="vjs-hd-icon vjs-hd-home vjs-hidden">' + e + "</i>";
					l.innerHTML = t + "p" + o;
				} else i > 0 && (l.innerHTML = Math.round(i / 1e3) + "kbps");
				Zt(t);
			}
			function y(i) {
				var a = C.qualities;
				f.forEach((e) => {
					var t = parseInt(e.getAttribute("data-height"), 10),
						s = parseInt(e.getAttribute("data-bitrate"), 10);
					(t !== a[i].height && s !== a[i].bitrate) || e.click();
				});
			}
		}
		function Gt(e) {
			const t = e.target.parentNode;
			var s = e.which;
			e.preventDefault();
			e.stopPropagation();
			40 === s && Ct(t);
			38 === s && _t(t);
			if (13 === s) {
				t.children[yt(t)].click();
				I && I.focus();
			}
			if (27 === s || 37 === s) {
				if (_.qualityMenu) {
					e = vjs_find(w, ".vjs-menu-quality");
					vjs_find(e, ".vjs-settings-back").click();
					vjs_find(w, ".vjs-extend-quality").focus();
				} else I && I.click();
				I && I.focus();
			}
			if (9 === s)
				if (_.qualityMenu) {
					if (E) {
						E.click();
						E.focus();
					}
				} else if (I) {
					I.click();
					I.focus();
				}
		}
		function Ft() {
			if (_.qualityMenu) {
				k.addClass(vjs_find(w, ".vjs-menu-quality"), x);
				k.removeClass(vjs_find(w, ".vjs-settings-home"), x);
				k.removeClass(u, "vjs-lock-showing");
				k.addClass(u, x);
			} else if (I) {
				var e = vjs_find(I, ".vjs-menu"),
					t = vjs_find(I, ".vjs-control-text");
				if (e) {
					k.removeClass(e, "vjs-lock-showing");
					t && t.removeAttribute("style");
				}
			}
		}
		function Yt() {
			if (
				!(
					k.hasClass(w, "vjs-ad-playing") ||
					k.hasClass(w, "vjs-dai") ||
					k.hasClass(w, "vjs-up-next")
				) &&
				C.duration() !== 1 / 0 &&
				("8" !== browser.IOS_VERSION || 0 !== C.duration())
			) {
				var e = C.video_id();
				if (null !== e) {
					var t = 0;
					if (_.resume && e) {
						e = String("vjs_resume-" + e);
						localStorage &&
							localStorage.key &&
							(t = Number(localStorage.getItem(e)));
					}
					t > 0 &&
						t < C.duration() - 20 &&
						setTimeout(() => {
							C.currentTime(t);
						}, 200);
				}
			}
		}
		function Xt() {
			var e = vjs_find(w, ".vjs-audio-info");
			e && w.removeChild(e);
			if (_.audioInfo && (_.audioInfo.artist || _.audioInfo.title)) {
				var e = vjs_find(w, ".vjs-info"),
					e =
						(e && e.parentNode.removeChild(e),
						vjs_El("span", "vjs-audio-info")),
					t = "";
				_.audioInfo.cover &&
					(t +=
						'<span class="vjs-cover"><img src="' +
						_.audioInfo.cover +
						'"/></span>');
				t += '<span class="vjs-audio-item vjs-text">';
				_.audioInfo.artist &&
					(t += '<span class="audio-artist">' + _.audioInfo.artist + "</span>");
				_.audioInfo.title &&
					(t +=
						'<span class="vjs-audio-item vjs-song">' +
						_.audioInfo.title +
						"</span>");
				if (_.audioInfo.genre || _.audioInfo.album || _.audioInfo.year) {
					t += '<span class="vjs-audio-item audio-id">';
					_.audioInfo.album &&
						(t += "<span>Album: " + _.audioInfo.album + "</span>");
					if (_.audioInfo.year || _.audioInfo.genre) {
						if (_.audioInfo.year) {
							t += "<span>Year: " + _.audioInfo.year;
							_.audioInfo.genre && (t += " | Genre:" + _.audioInfo.genre);
						} else _.audioInfo.genre && (t += "Genre:" + _.audioInfo.genre);
						t += "</span>";
					}
					t += "</span>";
				}
				e.innerHTML = t += "</span>";
				w.appendChild(e);
				e.onclick = () => {
					_.audioInfo.url && window.open(_.audioInfo.url, _.target);
				};
			}
		}
		function Ut() {
			var e = vjs_find(w, ".vjs-info");
			e && w.removeChild(e);
			if (_.videoInfo && (_.infoText || _.infoTitle || "" !== _.title)) {
				var e = vjs_El("span", "vjs-info"),
					t = "",
					s = (w.appendChild(e), vjs_find(w, ".vjs-cast-big")),
					i = "",
					a =
						(_.infoTitle ? (i = _.infoTitle) : "" !== _.title && (i = _.title),
						""),
					t =
						(t += a =
							"" !== _.infoIcon
								? '<span class="vjs-icon"><img src="' +
									_.infoIcon +
									'"/></span>'
								: a) +
						(s
							? '<span class="vjs-text" style="padding-left:50px">'
							: '<span class="vjs-text">') +
						('<span class="vjs-ttl">' + i + "</span>");
				if (_.infoDescription || _.description) {
					a = _.infoDescription || null;
					t +=
						'<span class="vjs-dsc">' +
						(a = !a && _.description ? _.description : a) +
						"</span>";
				}
				e.innerHTML = t += "</span>";
				e.onclick = () => {
					_.infoUrl && window.open(_.infoUrl, _.target);
				};
			}
		}
		function Vt() {
			var e = [],
				t = !1;
			if (C.textTracks().length > 0)
				for (var s = C.textTracks(), i = 0; i < s.length; i++) {
					var a = {},
						n = s[i];
					if ("captions" === n.kind || "subtitles" === n.kind) {
						a.kind = n.kind;
						a.src = n.src;
						a.language = n.language;
						a.label = n.label;
						n.default && (a.mode = "showing");
						e.push(a);
					}
					if ("metadata" === n.kind && !0 !== t && void 0 !== n.src) {
						t = !0;
						C.trigger("medialoaded", { xml: n.src });
					}
				}
			e.length > 0 && (C.captions = e);
		}
		function $t() {
			for (var e = C.textTracks(), t = e.length || 0; t--; )
				e[t].mode = "hidden";
			for (var s = C.remoteTextTracks(), i = 0; i < s.length; i++)
				("captions" !== s[i].kind && "subtitles" !== s[i].kind) ||
					(s[i].mode = "hidden");
			for (var a = s.length || 0; a--; ) C.removeRemoteTextTrack(s[a]);
		}
		function Jt(e) {
			var t = vjs_find(w, ".vjs-thumbnail-holder"),
				s = vjs_find(w, ".vjs-progress-slide .vjs-thumb");
			if (t) {
				if ("shaka" === _.skin) {
					var i = Number(t.style.height.replace(/px$/, "")),
						i = t.computedStyleMap().get("bottom").value + i + 5;
					e.style.bottom = i + "px";
				} else k.addClass(t, "vjs-vtt");
				k.addClass(e, "vjs-chapter-mix");
			} else if (s) {
				if ("shaka" === _.skin) {
					i = Number(s.style.height.replace(/px$/, ""));
					e.style.bottom = i + 32 + "px";
				} else k.addClass(s, "vjs-sld");
				k.addClass(e, "vjs-chapter-mix");
			}
			return 0;
		}
		function Kt() {
			var e = C.remoteTextTracks(),
				t = vjs_find(w, ".vjs-chapter"),
				s = !1;
			t && t.parentNode.removeChild(t);
			h.removeEventListener("mousemove", i, !1);
			h.removeEventListener("mouseout", n, !1);
			h.removeEventListener("touchstart", a);
			function i(e) {
				is(!0);
				if (vjs_find(w, ".vjs-chapter")) {
					var t,
						s = vjs_find(w, ".vjs-thumbnail-holder");
					s && "slategrey" === _.skin && k.addClass(s, "vjs-thumb-mix");
					"mousemove" === e.type
						? (t = e.pageX)
						: "touchmove" === e.type && (t = At(e));
					var i = t - h.getBoundingClientRect().left;
					if (!(i < 0)) {
						var a = (i / h.offsetWidth) * c;
						Jt(u);
						u.style.left = i + "px";
						for (var n = d.length - 1; n >= 0; n--) {
							var o = d[n];
							if (a >= o.startTime) {
								if (u.innerHTML !== o.text) {
									u.innerHTML = o.text;
									u.style.maxWidth = 0.9 * h.offsetWidth + "px";
								}
								var o = u.offsetWidth / 2,
									l = h.offsetWidth - u.offsetWidth / 2;
								i < o && (u.style.left = o + "px");
								i > l && (u.style.left = l + "px");
								u.style.opacity = "1";
								u.style.visibility = "visible";
								break;
							}
						}
					}
				}
			}
			function a(e) {
				i(e);
				m.addEventListener("touchmove", i);
				m.addEventListener("touchend", n);
			}
			function n() {
				is(!1);
				if (!videojs.holderdown) {
					m.removeEventListener("touchmove", i);
					m.removeEventListener("touchend", n);
					u.style.opacity = "0";
					u.style.visibility = "visible";
				}
			}
			if (_.chapterMarkers) {
				var o = w.getElementsByClassName("vjs-marker");
				if (o) for (; o.length > 0; ) o[0].parentNode.removeChild(o[0]);
				if (!_.chapters) {
					for (var l, r = 0; r < e.length; r++) {
						"chapters" === e[r].kind && (e[r].mode = "showing");
						e[r].cues &&
							"chapters" === e[r].kind &&
							e[r].cues.length > 0 &&
							!0 !== s &&
							((s = !0), (l = e[r]));
					}
					if (s) {
						var d = l.cues;
						d.length > 0 && (_.chapters = !0);
						l.mode = "hidden";
						if (d) {
							var t = vjs_find(w, ".vjs-progress-control"),
								t = vjs_find(t, ".vjs-mouse-display"),
								v = (t && k.addClass(t, "vjs-abs-hidden"), []),
								c = C.duration(),
								u = vjs_El("div");
							u.className = "vjs-chapter";
							h.appendChild(u);
							h.addEventListener("touchstart", a, { passive: !0 });
							h.addEventListener("mousemove", i, !1);
							h.addEventListener("mouseout", n, !1);
							for (r = 0; r < d.length; r++)
								if (c > 0 && d[r].startTime > 0) {
									v[r] = d[r].startTime;
									var p = vjs_El("div", "vjs-marker"),
										f = vjs_El("div", "vjs-marker-inn");
									p.appendChild(f);
									p.style.left = (v[r] / c) * 100 + "%";
									h.appendChild(p);
								}
						}
					}
				}
			}
		}
		function es(e, t) {
			var s = vjs_El("li", "vjs-item");
			t == C.playlist.currentIndex() && s.classList.add("vjs-active-item");
			s.setAttribute("data-id", t);
			s.tabIndex = "0";
			t = vjs_El("div", "vjs-tmb");
			e.thumb && (t.style.backgroundImage = "url(" + e.thumb + ")");
			s.appendChild(t);
			var i,
				t = vjs_El("p");
			if (e.title) t.innerHTML = e.title;
			else {
				var a = "";
				if (e.audioInfo && e.audioInfo.title) {
					a = e.audioInfo.title;
					e.audioInfo.artist && (a = e.audioInfo.artist + " - " + a);
				}
				if ("" !== a) t.innerHTML = a;
				else {
					var n = e.sources[0].src,
						o = n.substring(n.lastIndexOf("/") + 1);
					if (e.sources.length > 0)
						for (var l = 0; l < e.sources.length; l++)
							e.sources[l].default &&
								(o = (n = e.sources[l].src).substring(n.lastIndexOf("/") + 1));
					o = o.replace(/(\.[^/.]+)+$/, "");
					t.innerHTML = o;
				}
			}
			s.appendChild(t);
			if ((i = _.playlistID ? m.getElementById(_.playlistID) : i)) {
				a = vjs_El("p", "vjs-desc");
				e.description && (a.innerHTML = e.description);
				s.appendChild(a);
			}
			if (e.duration) {
				t = vjs_El("span");
				t.innerHTML = e.duration;
				s.appendChild(t);
			}
			s.onclick = (e) => {
				e.stopPropagation();
				r(e);
			};
			function r(e) {
				if (!C.adPlaying) {
					e = e.target.getAttribute("data-id");
					C.playlist.currentItem(parseInt(e, 10));
					C.paused() && C.play();
				}
			}
			return s;
		}
		function ts() {
			var e = C.playlist.list();
			if (!(e.length < 2)) {
				C.on("error", () => {
					C.playlist.currentIndex() === C.playlist.lastIndex() &&
					!0 !== _.playlistRepeat
						? (Y.style.display = "none")
						: C.playlist.next(!0);
				});
				if (!0 !== _.playlist) {
					_.playlist = !0;
					if (_.playlistNavigation) {
						var t = vjs_El(
								"div",
								"vjs-playlist-nav vjs-nav-prev",
								'<div class="vjs-prev vjs-disabled">&lang;</div>',
							),
							s =
								(t.setAttribute("tabindex", "0"),
								vjs_El(
									"div",
									"vjs-playlist-nav vjs-nav-next",
									'<div class="vjs-next">&rang;</div>',
								));
						s.setAttribute("tabindex", "0");
						w.insertBefore(t, c);
						w.insertBefore(s, c);
						s.role = t.role = "button";
						s.ariaLabel = "Next video";
						t.ariaLabel = "Previous video";
						s.onclick = s.onkeydown = (e) => {
							e.target.className.indexOf("disabled") < 0 &&
								(("keydown" == e.type && 13 == e.which) || "click" == e.type) &&
								C.playlist.next();
						};
						t.onclick = t.onkeydown = (e) => {
							e.target.className.indexOf("disabled") < 0 &&
								(("keydown" == e.type && 13 == e.which) || "click" == e.type) &&
								C.playlist.previous();
						};
					}
					if (_.playlistUI) {
						var n = null,
							o = null;
						if (_.playlistID) {
							n = m.getElementById(_.playlistID);
							C.playlistParent = n;
						} else C.playlistParent = w;
						o = vjs_El(
							"div",
							n
								? "vjs-vplaylist vjs-vplaylist-horizontal vjs-vplaylist-show"
								: "vjs-vplaylist vjs-vplaylist-show",
						);
						if (!n) {
							var i = k.createEl("button", {
								className: "vjs-playlist-button",
							});
							i.ariaLabel = i.title = T("Open playlist");
							i.tabIndex = "0";
							i.ariaDisabled = "false";
							s = '<span class="vjs-icon-placeholder ';
							videojs.svgIcons && (s += "vjs-svg-icon");
							s += '" aria-hidden="true">';
							videojs.svgIcons &&
								(s +=
									'<svg viewBox="0 0 512 512"><use href="#vjs-icon-playlist"></use></svg>');
							i.innerHTML = s += "</span>";
							w.insertBefore(i, c);
							i.onclick = () => {
								k.removeClass(o, "vjs-hidden");
								k.addClass(o, "vjs-vplaylist-show");
								var e = C.playlist.currentIndex();
								const t = vjs_find(o, ".vjs-vlist ul"),
									s = t.childNodes[e];
								s && s.focus();
								_.playlistIndex = e;
								_.playlistFirst && k.addClass(o, "vjs-vplaylist-first");
							};
						}
						var t = vjs_El(
								"div",
								"vjs-head",
								'<span class="p-label">' + T("PLAYLIST") + "</span>",
							),
							a = vjs_El("button", "vjs-back", "<i></i>");
						a.ariaLabel = a.title = T("Hide playlist");
						a.setAttribute("tabindex", "-1");
						if (n) {
							a.innerHTML = '<i class="vdown"></i>';
							a.ariaLabel = a.title = T("Collapse playlist");
							a.setAttribute("tabindex", "0");
						}
						t.appendChild(a);
						o.appendChild(t);
						a.onclick = () => {
							if (n)
								if (l.offsetHeight > 0) {
									a.innerHTML = '<i class="vup"></i>';
									a.ariaLabel = a.title = T("Expand playlist");
									l.style.height = 0;
								} else {
									a.innerHTML = '<i class="vdown"></i>';
									a.ariaLabel = a.title = T("Collapse playlist");
									l.removeAttribute("style");
								}
							else {
								k.removeClass(o, "vjs-vplaylist-show");
								setTimeout(() => {
									k.addClass(o, "vjs-hidden");
								}, 300);
								i.focus();
							}
						};
						var l = vjs_El("div", "vjs-vlist");
						if (n) {
							k.addClass(l, "vjs-list-max");
							if (_.playlistMaxH) {
								s = parseInt(_.playlistMaxH, 10);
								s > 0 && (l.style.height = s + "px");
							}
						}
						o.appendChild(l);
						var e = C.playlist.list(),
							r = vjs_El("ul");
						l.appendChild(r);
						for (var d = 0; d < e.length; d++) {
							var v = es(e[d], d);
							r.appendChild(v);
						}
						n || (!0 !== _.playlistShow && (o.className = "vjs-vplaylist"));
						o &&
							(o.onkeydown = (e) => {
								_.playlistIndex ||
									(_.playlistIndex = C.playlist.currentIndex());
								const t = e.which;
								27 === t && a.click();
								13 === t && e.target !== a && e.target.click();
								if (9 === t) {
									r.childNodes.length;
									n || r.lastChild.focus();
								}
								if (40 == t || 38 == t) {
									if (40 === t) {
										_.playlistIndex++;
										_.playlistIndex > r.childNodes.length &&
											(_.playlistIndex = r.childNodes.length);
									}
									if (38 === t) {
										_.playlistIndex--;
										_.playlistIndex < 0 && (_.playlistIndex = 0);
									}
									const e = r.childNodes[_.playlistIndex];
									e && e.focus();
								}
							});
						setTimeout(() => {
							n ? n.appendChild(o) : w.insertBefore(o, c);
						}, 100);
					}
				}
				C.on("playlist_newitem", () => {
					if (_.playlistUI)
						for (var e = vjs_mfind(l, ".vjs-item"), t = 0; t < e.length; t++) {
							k.removeClass(e[t], "vjs-active-item");
							t == C.playlist.currentIndex() &&
								k.addClass(e[t], "vjs-active-item");
						}
					C.on("play", () => {
						if (_.playlistUI) {
							for (
								var e = C.playlist.currentIndex(),
									t = vjs_mfind(l, ".vjs-item"),
									s = 0;
								s < t.length;
								s++
							) {
								k.removeClass(t[s], "vjs-active-item");
								s === e && k.addClass(t[s], "vjs-active-item");
							}
							_.playlistAutoHide &&
								!n &&
								k.removeClass(o, "vjs-vplaylist-show");
						}
						if (_.playlistNavigation) {
							var i = vjs_find(w, ".vjs-nav-prev"),
								a = vjs_find(w, ".vjs-nav-next"),
								i = vjs_find(i, ".vjs-prev"),
								a = vjs_find(a, ".vjs-next");
							0 === C.playlist.currentIndex()
								? k.addClass(i, "vjs-disabled")
								: k.removeClass(i, "vjs-disabled");
							C.playlist.currentIndex() === C.playlist.lastIndex()
								? k.addClass(a, "vjs-disabled")
								: k.removeClass(a, "vjs-disabled");
						}
					});
				});
			}
		}
		function ss() {
			C.sprite = !1;
			var e = vjs_find(w, ".vjs-progress-slide");
			e && e.parentNode.removeChild(e);
			h.removeEventListener("mousemove", r);
			h.removeEventListener("mousedown", v);
			h.removeEventListener("mouseleave", u);
			h.removeEventListener("touchstart", i);
			e = vjs_find(w, ".vjs-thumb-poster");
			e && w.removeChild(e);
			if (
				("" === _.slideImage || _.currentSlide !== _.slideImage) &&
				!0 !== C.isAudio() &&
				_.slideImage
			) {
				if ("" === _.slideImage) return;
				_.currentSlide = _.slideImage;
				e = vjs_find(w, ".vjs-mouse-display");
				if (C.shadowSlide) {
					var a = vjs_El("div", "vjs-thumb-poster"),
						n = vjs_El("canvas");
					a.appendChild(n);
					w.insertBefore(a, X);
				}
				var t = vjs_find(w, ".vjs-play-progress .vjs-time-tooltip");
				t && k.addClass(t, "vjs-abs-hidden");
				e && k.addClass(e, "vjs-abs-hidden");
				C.sprite = !0;
				se = vjs_El("div", "vjs-progress-slide");
				p = vjs_El("div", "vjs-thumb");
				ie = vjs_El("div", "vjs-thumb-dr");
				f = vjs_El("img");
				if ("horizontal" === _.slideType) {
					f.style.width = "auto";
					f.style.height = _.slideHeight + "px";
				} else {
					f.style.height = "auto";
					f.style.width = _.slideWidth + "px";
				}
				p.appendChild(f);
				p.appendChild(ie);
				se.appendChild(p);
				p.style.left = "-" + parseInt(_.slideWidth / 2, 10) + "px";
				h.appendChild(se);
				se.style.left = "-1000px";
				var o = 0,
					l = 0;
				h.addEventListener("mousemove", r);
				h.addEventListener("mousedown", v);
				h.addEventListener("mouseleave", u);
				h.addEventListener("touchstart", i, { passive: !0 });
				t = new Image();
				f.src = _.slideImage;
				t.src = _.slideImage;
				t.onload = (e) => {
					var t = e.target.width,
						e = e.target.height;
					ae = t / _.slideWidth;
					"horizontal" !== _.slideType && (ae = e / _.slideHeight);
					k.removeClass(se, x);
				};
			}
			function s() {
				h.removeEventListener("touchmove", r);
				h.removeEventListener("touchend", s);
				c();
			}
			function i(e) {
				is(!0);
				videojs.holderdown = !1;
				h.addEventListener("touchmove", (e) => {
					r(e);
				});
				h.addEventListener("touchend", s);
			}
			function r(e) {
				is(!0);
				if (!vjs_find(w, ".vjs-tech-chromecast")) {
					var t = h.getBoundingClientRect(),
						s = h.offsetWidth,
						i = null,
						e =
							(e.pageX ? (i = e.pageX) : e.changedTouches && (i = At(e)),
							i - t.left),
						i = e,
						t = e,
						e =
							(0 === i &&
								h.offsetWidth > 0 &&
								videojs.holderdown &&
								(t = i = h.offsetWidth),
							Number(i) / Number(s)),
						i = e * C.duration(),
						s = ((ie.innerHTML = videojs.formatTime(i)), parseInt(e * ae, 10));
					p.style.width = _.slideWidth + "px";
					p.style.height = _.slideHeight + "px";
					i = 0;
					if ("horizontal" === _.slideType) {
						i = s * _.slideWidth;
						f.style.left = "-" + i + "px";
						o = i;
						l = 0;
					} else {
						i = s * _.slideHeight;
						f.style.top = "-" + i + "px";
						o = 0;
						l = i;
					}
					(e = _.slideWidth / 2), (s = h.offsetWidth - _.slideWidth / 2);
					(t = t > s ? s : t) < e && (t = e);
					se.style.left = parseInt(t, 10) + "px";
					if (videojs.holderdown && C.shadowSlide) {
						i = n.getContext("2d");
						n.width = w.offsetWidth;
						n.height = w.offsetHeight;
						a.style.width = w.offsetWidth + "px";
						a.style.height = w.offsetHeight + "px";
						i.drawImage(
							f,
							o,
							l,
							_.slideWidth,
							_.slideHeight,
							0,
							0,
							n.width,
							n.height,
						);
					}
					k.addClass(p, "vjs-thumb-show");
				}
			}
			function d() {
				videojs.holderdown = !1;
				m.removeEventListener("mousemove", r);
				c();
			}
			function v() {
				is(!0);
				m.addEventListener("mousemove", r);
				m.addEventListener("mouseup", d);
				if (C.shadowSlide) {
					var e = n.getContext("2d");
					n.width = w.offsetWidth;
					n.height = w.offsetHeight;
					a.style.width = w.offsetWidth + "px";
					a.style.height = w.offsetHeight + "px";
					e.drawImage(
						f,
						o,
						l,
						_.slideWidth,
						_.slideHeight,
						0,
						0,
						n.width,
						n.height,
					);
				}
			}
			function c() {
				is(!1);
				if (se) {
					k.removeClass(p, "vjs-thumb-show");
					if (C.shadowSlide) {
						n.width = n.height = 0;
						a.removeAttribute("style");
					}
				}
			}
			function u() {
				c();
			}
		}
		function is(e) {
			var t = C.controlBar.progressControl.el();
			e ? t.setAttribute("style", "z-index:22") : t.removeAttribute("style");
		}
		function as() {
			var e = vjs_find(w, ".vjs-extend-quality"),
				t = T("Quality");
			if (!e) {
				e = vjs_El(
					"li",
					"vjs-settings-item vjs-extend-quality vjs-menu-forward vjs-hidden",
					t + '<span class="quality-label"></span>',
				);
				e.tabIndex = "0";
				e.ariaLabel = "Open quality menu";
				e.role = "menuitem";
				vjs_find(w, ".vjs-settings-list").appendChild(e);
				e = vjs_El(
					"div",
					"vjs-submenu vjs-menu-quality vjs-hidden",
					'<div class="vjs-settings-back">' +
						t +
						'</div><ul class="vjs-menu-content vjs-sub-menu"></ul>',
				);
				vjs_find(w, ".vjs-settings-div").appendChild(e);
			}
		}
		function ns(e) {
			e.stopPropagation();
			document.addEventListener("mouseup", os, !1);
			document.addEventListener("touchend", os);
			C.trigger("progressdown");
		}
		function os(e) {
			document.removeEventListener("mouseup", os);
			document.removeEventListener("touchend", os);
			C.trigger("progressup");
		}
		function ls(e) {
			var t = w.querySelector("dispose");
			if (!t) {
				(t = vjs_El("button", "dispose")).innerHTML = "&times;";
				t.title = T("Close");
				if (_.outstreamvisit) {
					t.style.left = "10px";
					t.style.right = "auto";
					t.style.textAlign = "left";
				}
				w.appendChild(t);
				t.onclick = () => {
					rs();
				};
			}
		}
		function rs() {
			window.removeEventListener("scroll", K);
			C.trigger("dispose");
			C.dispose();
			window.parent &&
				window.parent.postMessage({ id: w.id, message: "dispose" }, "*");
		}
		function ds() {
			if (C.currentSrc() !== U) {
				K();
				C.off("playing", ds);
			}
		}
		function vs() {
			k.hasClass(w, "vjs-ad-playing") ? (G = !0) : setTimeout(vs, 1e3);
		}
		function cs() {
			if (!_.outstream || "force" == _.automuteButton) {
				var e = vjs_El("button", "vjs-auto-mute");
				e.title = T("Unmute");
				e.type = "button";
				e.ariaLive = "polite";
				e.innerHTML =
					'<span class="vjs-svg-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><use href="#vjs-icon-mute"></use></svg>';
				C.el_.insertBefore(e, F);
				C.one("volumechange", () => {
					if (e) {
						C.el_.removeChild(e);
						e = null;
					}
				});
				e.onclick = () => {
					C.muted(!1);
					C.el_.removeChild(e);
					e = null;
				};
				C.on("ended", () => {
					e && C.el_.removeChild(e);
				});
			}
		}
		function us() {
			cs();
		}
		function ps() {
			C.el_.classList.add("vjs-muted");
			C.pause();
		}
		function fs() {}
		function hs() {
			if (C.paused()) {
				C.muted(!0);
				setTimeout(() => {
					s.play().then(us, ps);
				}, 300);
			}
		}
		function ms(e) {
			e.preventDefault();
			e = C.$(".vjs-tech");
			e.style.left = e.offsetWidth / 2 - w.offsetWidth / 2 + "px";
			e.style.top = e.offsetHeight / 2 - w.offsetHeight / 2 + "px";
		}
		function As() {
			js();
			d = 1;
			vjs_find(w, ".vjs-zoom-level").style.height = "0";
			var e = C.$(".vjs-tech");
			ys(e, 1);
			e.style.top = 0;
			e.style.left = 0;
			Pt(100);
			e = vjs_find(w, ".vjs-zoom-parent");
			k.addClass(e, "vjs-hidden");
			return (videojs.options.blockKeys = !1);
		}
		function js() {
			var e = ((d - 1) / 4) * 100,
				t = vjs_find(w, ".zoom-thumb");
			t && (t.style.height = e + "%");
		}
		function gs() {
			setTimeout(() => {
				if ((!videojs.dispose || !videojs.nuevo) && !_.mapp) {
					w.innerHTML = "";
					w.classList.add("vjs-lcn");
				}
			}, 1e3);
		}
		function bs(e, t) {
			localStorage && (localStorage[e] = t);
		}
		function ys(e, t) {
			js();
			e.style.scale = t;
			k.removeClass(X, x);
		}
	},
	nuevo = function (e) {
		this.ready(function () {
			initPlugin(this, e);
		});
	};
"undefined" !== typeof window && videojs.registerPlugin("nuevo", nuevo);
nuevo.VERSION = "13.0.1";
export default nuevo;
