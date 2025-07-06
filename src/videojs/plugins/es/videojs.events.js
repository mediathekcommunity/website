/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * Events plugin for video.js
 * Version 3.0.0
 */
/* eslint-disable */ import videojs from "video.js";

var vjs_pageTimer,
	_edata = null,
	vjs_currentSource = "",
	_summaryData = {
		sessionId: "",
		videoId: "",
		videoTitle: "",
		category: "",
		watchedTime: 0,
		pauseCount: 0,
		resumeCount: 0,
		seekCount: 0,
		bufferDuration: 0,
	},
	isIPv4 = (e) => {
		if (!e.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)) return !1;
		var t = e.split(".");
		for (const e of t) {
			if (Number(e) > 255) return !1;
		}
		return !0;
	},
	isIPv6 = (e, t = 8) => {
		e = e.toLowerCase();
		if ("::" === e) return !0;
		if (!e.match(/^([0-9a-f]{0,4}:?){2,8}$/)) return !1;
		if (":" === e[e.length - 1]) if (":" !== e[e.length - 2]) return !1;
		if (e.split("::").length > 2) return !1;
		if (1 === e.split("::").length) if (e.split(":").length !== t) return !1;
		if (2 === e.split("::").length) {
			var i = e.split("::")[1];
			i = i.split(":");
			for (let e = 0; e < i.length - 1; e++) if ("" === i[e]) return !1;
		}
		return !0;
	},
	isIPv64 = (e) => {
		var [t, i] = splitIPv64(e);
		return isIPv6(t, 6) && isIPv4(i);
	},
	isIPv4MappedIPv6 = (e) =>
		isIPv64(e) &&
		(!binaryIPv64(e).substring(0, 96).includes("1") ||
			(!binaryIPv64(e).substring(0, 80).includes("1") &&
				!binaryIPv64(e).substring(80, 96).includes("0"))),
	ipType = (e) => {
		if (isIPv4(e)) return "IPv4";
		if (isIPv6(e)) return "IPv6";
		if (isIPv64(e)) return "IPv6_4";
		else return "None";
	},
	padRight = (e, t, i = "0") => {
		for (; e.length < t; ) e += i;
		return e;
	},
	padLeft = (e, t, i = "0") => {
		for (; e.length < t; ) e = i + e;
		return e;
	},
	split = (e, t) => {
		for (var i = []; e.length > 0; ) {
			var a = e.substring(0, t);
			i.push(a);
			e = e.substring(t);
		}
		return i;
	},
	toBinary = (e) => Number(e).toString(2),
	fromBinary = (e) => parseInt(e, 2),
	binaryIPv4 = (e) =>
		e
			.split(".")
			.map((e) => padLeft(toBinary(e), 8))
			.join(""),
	toHex = (e) => e.toString(16),
	binaryIPv6 = (e) => {
		var [t, i] = e.split("::");
		t = t.split(":");
		if (void 0 !== i) i = i.split(":");
		else i = [];
		for (; t.length + i.length < 8; ) t.push("0");
		var a = t.concat(i);
		for (let e = 0; e < a.length; e++) if (0 === a[e].length) a[e] = "0";
		return a
			.map((e) => parseInt(e, 16))
			.map((e) => padLeft(toBinary(e), 16))
			.join("");
	},
	splitIPv64 = (e) => {
		var t = e.lastIndexOf(":"),
			i = e.substring(0, t),
			a = e.substring(t + 1);
		if (":" === i[i.length - 1]) i += ":";
		return [i, a];
	},
	binaryIPv64 = (e) => {
		var [t, i] = splitIPv64(e),
			[a, n] = t.split("::");
		a = a.split(":");
		if (void 0 !== n) n = n.split(":");
		else n = [];
		for (; a.length + n.length < 6; ) a.push("0");
		var r = a.concat(n);
		for (let e = 0; e < r.length; e++) if (0 === r[e].length) r[e] = "0";
		return (
			r
				.map((e) => parseInt(e, 16))
				.map((e) => padLeft(toBinary(e), 16))
				.join("") + binaryIPv4(i)
		);
	},
	fromBinaryIPv4 = (e) => split(e, 8).map(fromBinary).join("."),
	compressIPv6 = (e) => {
		var t = e.split(":"),
			i = 0,
			a = null,
			n = !1,
			r = 0,
			o = null;
		for (let e = 0; e < t.length; e++)
			if (n)
				if ("0" === t[e]) r++;
				else {
					if (r > i) {
						i = r;
						a = o;
					}
					n = !1;
					r = 0;
					o = null;
				}
			else if ("0" === t[e]) {
				n = !0;
				r = 1;
				o = e;
			}
		if (null !== o && r > i) {
			i = r;
			a = o;
		}
		if (i < 2) return e;
		else return t.slice(0, a).join(":") + "::" + t.slice(a + i).join(":");
	},
	fromBinaryIPv6 = (e) => {
		var t = split(e, 16).map(fromBinary).map(toHex);
		return compressIPv6(t.join(":"));
	},
	fromBinaryIPv64 = (e) => {
		var t = e.substring(0, 96),
			i = e.substring(96),
			a = fromBinaryIPv6(t),
			n = fromBinaryIPv4(i),
			r = a;
		if (":" !== r[r.length - 1]) r += ":";
		return r + n;
	},
	anonymizeIPv4 = (e, t) => {
		var i = binaryIPv4(e).substring(0, t),
			a = padRight(i, 32);
		return fromBinaryIPv4(a);
	},
	anonymizeIPv6 = (e, t) => {
		var i = binaryIPv6(e).substring(0, t),
			a = padRight(i, 128);
		return fromBinaryIPv6(a);
	},
	anonymizeIPv64 = (e, t) => {
		var i = binaryIPv64(e).substring(0, t),
			a = padRight(i, 128);
		return fromBinaryIPv64(a);
	},
	anonymizeIP = (e, t = 24, i = 24) => {
		if ("string" !== typeof e) return null;
		e = e.trim().toLowerCase();
		var a = ipType(e);
		if ("IPv4" === a) return anonymizeIPv4(e, t);
		if ("IPv6" === a) return anonymizeIPv6(e, i);
		if ("IPv6_4" === a)
			if (isIPv4MappedIPv6(e)) return anonymizeIPv64(e, t + 96);
			else return anonymizeIPv64(e, i);
		return null;
	};
function sendscript(e, t, i) {
	if ("" !== e.trackingUrl && navigator.sendBeacon)
		if ("undefined" !== e.trackingUrl)
			if (void 0 !== e.trackingUrl) {
				if (!_edata.uid) return;
				i = JSON.stringify(i);
				var a = {
					sessionId: _edata.uid,
					category: _edata.category,
					videoId: _edata.id,
					videoTitle: _edata.label,
					event: t,
					value: i,
				};
				navigator.sendBeacon(e.trackingUrl, JSON.stringify(a));
			}
}
function sendbeacon(e, t) {
	if ("" === _edata.label) _edata.label = _edata.id;
	var i = !0;
	if ("" !== _edata.label && "" !== e)
		if (window.gtag)
			window.gtag("event", e, {
				event_category: _edata.category,
				event_label: _edata.label,
				value: t,
				eventNonInteraction: !0,
			});
		else if (window._ga)
			window.ga("send", "event", _edata.category, e, _edata.label, t, {
				transport: "beacon",
			});
		else if (window._gaq)
			window._gaq.push([
				"_trackEvent",
				_edata.category,
				e,
				_edata.label,
				t,
				i,
				{ transport: "beacon" },
			]);
		else if (window._paq)
			window._paq.push(["trackEvent", _edata.category, e, _edata.label, t]);
}
var BufferTracking = function (e) {
		var i = null,
			a = !1,
			n = !1,
			r = !1,
			o = 0,
			d = () => {
				if (i) clearTimeout(i);
				a = !1;
				n = !1;
				r = !1;
				o = 0;
			},
			s = () => {
				r = !1;
				if (
					this.scrubbing() &&
					(!e.bufferingConfig || !e.bufferingConfig.includeScrub)
				) {
					a = !0;
					i = setTimeout(() => {
						a = !1;
					}, 200);
				}
			},
			u = () => {
				if (!1 === r && !1 === a && this.currentTime() > 0) {
					r = new Date();
					n = +this.currentTime().toFixed(2);
				}
			},
			c = () => {
				var e = +this.currentTime().toFixed(2);
				if (r && e !== n) {
					var i = (new Date() - r) / 1e3;
					r = !1;
					n = !1;
					o++;
					if (!_edata.uid) return;
					this.trigger("track", {
						event: "buffered",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						bufferTime: i.toFixed(3),
						bufferCount: o,
					});
				}
			};
		this.on("loadstart", d);
		this.on("pause", s);
		this.on("waiting", u);
		this.on("timeupdate", c);
	},
	PauseTracking = function (e) {
		var i = 0,
			a = null,
			n = !1,
			r = (e) => {
				if (a) clearTimeout(a);
				i = 0;
				n = !1;
			};
		this.on("dispose", r);
		this.on("loadstart", r);
		this.on("pause", () => {
			if (!(this.scrubbing() || this.seeking() || n))
				a = setTimeout(() => {
					i++;
					_summaryData.pauseCount = i;
					if (_edata.uid)
						this.trigger("track", {
							event: "pause",
							sessionId: _edata.uid,
							category: _edata.category,
							videoId: _edata.id,
							videoTitle: _edata.label,
							pauseCount: i,
						});
				}, 300);
		});
	},
	ResumeTracking = function (e) {
		var i = 0,
			a = null,
			n = !1,
			r = (e) => {
				if (a) clearTimeout(a);
				i = 0;
				n = !1;
			};
		this.on("dispose", r);
		this.on("loadstart", r);
		this.on("ended", r);
		this.on("play", () => {
			if (
				!(this.scrubbing() || this.seeking() || n || this.currentTime() < 1)
			) {
				clearTimeout(vjs_pageTimer);
				a = setTimeout(() => {
					i++;
					_summaryData.resumeCount = i;
					if (_edata.uid)
						this.trigger("track", {
							event: "resume",
							sessionId: _edata.uid,
							category: _edata.category,
							videoId: _edata.id,
							videoTitle: _edata.label,
							resumeCount: i,
						});
				}, 300);
			}
		});
	},
	PercentileTracking = function (e) {
		var t = this,
			i = !1,
			a = !1,
			n = !1,
			r = !0,
			o = !1,
			d = !0,
			s = !1,
			u = !0,
			c = !1,
			l = !0,
			f = 0,
			v = 0,
			g = 0,
			_ = 0,
			p = (e) => {
				i = !1;
				a = !0;
				n = !1;
				r = !0;
				o = !1;
				d = !0;
				s = !1;
				u = !0;
				c = !1;
				l = !0;
				f = 0;
				v = 0;
				g = 0;
				_ = 0;
			},
			y = () => g++,
			m = () => v++,
			b = () => _++;
		t.on("dispose", p);
		t.on("loadstart", p);
		t.on("tracking:pause", m);
		t.on("tracking:resume", y);
		t.on("tracking:seek", b);
		t.on("timeupdate", () => {
			var e = t.currentTime().toFixed(0);
			f = +t.duration().toFixed(0);
			if (null !== _edata) {
				if (i > 0 && e > i && e < o && !1 !== a) {
					a = !1;
					if (!_edata.uid) return;
					t.trigger("track", {
						event: "10%",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						currentTime: e,
						duration: f,
					});
					if (t.analytics) sendbeacon("10%", i);
					sendscript(t, "progress", "10%");
				}
				if (o > 0 && e > o && e < s && !1 !== d) {
					d = !1;
					if (!_edata.uid) return;
					t.trigger("track", {
						event: "25%",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						currentTime: e,
						duration: f,
					});
					if (t.analytics) sendbeacon("25%", o);
					sendscript(t, "progress", "25%");
				}
				if (s > 0 && e > s && e < c && !1 !== u) {
					u = !1;
					if (!_edata.uid) return;
					t.trigger("track", {
						event: "50%",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						currentTime: e,
						duration: f,
					});
					if (t.analytics) sendbeacon("50%", s);
					sendscript(t, "progress", "50%");
				}
				if (c > 0 && e > c && e < n && !1 !== l) {
					l = !1;
					if (!_edata.uid) return;
					t.trigger("track", {
						event: "75%",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						currentTime: e,
						duration: f,
					});
					if (t.analytics) sendbeacon("75%", c);
					sendscript(t, "progress", "75%");
				}
				if (n > 0 && e > n && !1 !== r) {
					r = !1;
					if (!_edata.uid) return;
					t.trigger("track", {
						event: "90%",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						currentTime: e,
						duration: f,
					});
					if (t.analytics) sendbeacon("90%", n);
					sendscript(t, "progress", "90%");
				}
			}
		});
		t.on("replay", function () {
			if (null !== _edata) {
				if (!_edata.uid) return;
				this.trigger("track", {
					event: "replay",
					sessionId: _edata.uid,
					category: _edata.category,
					videoId: _edata.id,
					videoTitle: _edata.label,
				});
				if (this.analytics) sendbeacon("replay", null);
				if (null !== _edata) sendscript(t, "replay", null);
			}
		});
		t.on("loadeddata", () => {
			f = +t.duration().toFixed(0);
			if (f > 0) {
				var e = (f / 4).toFixed(0),
					a = (f / 10).toFixed(0),
					r = (0.9 * f).toFixed(0);
				n = +r;
				i = +a;
				o = +e;
				s = 2 * +e;
				c = 3 * +e;
			}
		});
		t.on("ended", function () {
			var t = this.duration();
			if (this.el_.className.indexOf("vjs-live") > -1) t = 0;
			if (_edata.uid) {
				this.trigger("track", {
					event: "ended",
					sessionId: _edata.uid,
					videoId: _edata.id,
					category: _edata.category,
					videoTitle: _edata.title,
					duration: t,
				});
				if (this.analytics) sendbeacon("completed", t);
				if (null !== _edata) sendscript(this, "completed", t);
			}
		});
		t.on("fullscreenchange", function () {
			var t = "on";
			if (this.isFullscreen()) {
				if (!_edata.uid) return;
				this.trigger("track", {
					event: "enterFullscreen",
					sessionId: _edata.uid,
					videoId: _edata.id,
					category: _edata.category,
					videoTitle: _edata.label,
					mode: t,
				});
				if (this.analytics) sendbeacon("fullscreen", 1);
				if (null !== _edata) sendscript(this, "fullscreen", 1);
			} else {
				if (!_edata.uid) return;
				this.trigger("track", {
					event: "exitFullscreen",
					sessionId: _edata.uid,
					videoId: _edata.id,
					category: _edata.category,
					videoTitle: _edata.label,
					mode: t,
				});
				if (this.analytics) sendbeacon("fullscreen", 0);
				if (null !== _edata) sendscript(this, "fullscreen", 0);
			}
		});
	},
	SummaryTracking = function (e) {
		var i = 0,
			a = 0,
			n = 0,
			r = 0,
			o = 0,
			d = 0,
			s = 0,
			u = [],
			c = "",
			l = 0,
			f = "Videos",
			v = "",
			g = !1,
			_ = () => {
				i = 0;
				a = 0;
				n = 0;
				r = 0;
				o = 0;
				d = 0;
				s = 0;
				l = 0;
				u = [];
			},
			p = () => {
				if (_edata.uid) {
					var e = {
						event: "summary",
						initialLoadTime: s,
						totalDuration: r,
						watchedTime: o,
						pauseCount: a,
						seekCount: i,
						bufferCount: n,
						lastTime: l,
						bufferDuration: d,
						video_id: c,
						video_category: f,
						video_label: v,
						analytics: g,
						sessionId: _edata.uid,
					};
					if (this) this.trigger("track", e);
				}
			},
			y = () => {
				var e = {
					event: "summary",
					initialLoadTime: s,
					totalDuration: r,
					watchedDuration: o,
					pauseCount: a,
					seekCount: i,
					bufferCount: n,
					lastTime: l,
					bufferDuration: d,
					video_id: c,
					video_category: f,
					video_label: v,
					analytics: g,
				};
				if (e.watchedDuration > 1) {
					if (e.analytics) sendbeacon("watchedTime", e.watchedDuration);
					if (null !== _edata)
						sendscript(this, "watchedTime", e.watchedDuration);
				}
				_();
			};
		if ("function" === typeof window.addEventListener) {
			var m = !1,
				b = () => {
					vjs_pageTimer = setTimeout(() => {
						y();
						_edata = null;
						vjs_currentSource = "";
					}, 1e4);
				},
				h = (e) => {
					if (!m) {
						if ("pagehide" === e.type) {
							m = !0;
							y();
							_edata = null;
							vjs_currentSource = "";
						} else if ("pageshow" === e.type) clearTimeout(vjs_pageTimer);
						if (
							"visibilitychange" === e.type &&
							"hidden" === document.visibilityState
						)
							b();
					}
				};
			document.addEventListener("visibilitychange", h);
			window.addEventListener("pagehide", h);
			window.addEventListener("beforeunload", (e) => {
				y();
				_edata = null;
				vjs_currentSource = "";
			});
		}
		this.on("ended", p);
		this.on("dispose", () => {
			y();
			_edata = null;
			vjs_currentSource = "";
		});
		this.on("timeupdate", () => {
			var e = +this.currentTime().toFixed(0);
			if (0 !== e) {
				if (u.indexOf(e) < 0) u.push(e);
				o = u.length;
				_edata.watchedDuration = u.length;
				l = this.currentTime().toFixed(0);
				_summaryData.watchedTime = o;
			}
		});
		this.on("loadeddata", (e, i) => {
			r = +this.duration().toFixed(0);
		});
		this.on("track", (e, r) => {
			switch (r.event) {
				case "seek":
					i = r.seekCount;
					break;
				case "pause":
					a = r.pauseCount;
					break;
				case "buffered":
					n = r.bufferCount;
					d += parseFloat(r.bufferTime);
					_summaryData.bufferDuration = d;
					break;
				case "loaded":
					s = r.initialLoadTime;
					break;
				case "start":
					if (this.analytics) g = !0;
					break;
				default:
			}
		});
	},
	PlayTracking = function (e) {
		var t = function () {
				if (null !== _edata)
					if (_edata.watchedDuration > 1) {
						if (this.analytics)
							sendbeacon("watchedTime", _edata.watchedDuration);
						sendscript(this, "watchedTime", _edata.watchedDuration);
					}
				_edata = {};
			},
			i = function () {
				clearTimeout(vjs_pageTimer);
				if (vjs_currentSource !== this.currentSource()) {
					vjs_currentSource = this.currentSource();
					if (null !== _edata) {
						if (_edata.id)
							if ("function" === typeof this.video_id)
								if (_edata.id.length > 0)
									if (_edata.id === this.video_id()) {
										_summaryData.videoId = _edata.id;
										return;
									}
						if (_edata.label)
							if ("function" === typeof this.video_title)
								if (_edata.label.length > 0)
									if (_edata.label === this.video_title()) {
										_summaryData.videoTitle = _edata.label;
										return;
									}
					}
					_edata = {};
					if (void 0 !== this.trackingUrl)
						_edata.trackingUrl = this.trackingUrl;
					else _edata.trackingUrl = "";
					var t = Date.now();
					_edata.uid = _summaryData.sessionId = t;
					if ("function" === typeof this.video_title)
						if (this.video_title())
							_edata.label = _summaryData.videoTitle = this.video_title();
					if ("function" === typeof this.video_id)
						if (this.video_id())
							_edata.id = _summaryData.videoId = this.video_id();
					var i = this.el_.className;
					_edata.category = "Video";
					if (this.isAudio()) _edata.category = "Audio";
					if (i.indexOf("vjs-live") > -1) _edata.category = "Live video";
					_summaryData.category = _edata.category;
					if (!_edata.uid) return;
					this.trigger("track", {
						event: "firstPlay",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						initialPlayTime: this.currentTime().toFixed(0),
					});
					sendscript(this, "firstPlay", this.currentTime().toFixed(0));
					a(this);
					if (this.analytics)
						sendbeacon("firstPlay", this.currentTime().toFixed(0));
				}
			};
		function a(e) {
			function t(t, i) {
				var a = new XMLHttpRequest();
				a.onreadystatechange = () => {
					if (4 === a.readyState && 200 === a.status)
						if (a.responseText) {
							var t = a.responseText;
							t = JSON.parse(t);
							var i = {
								ip_address: "Unknown",
								country: "N/A",
								country_code: "N/A",
								city: "N/A",
								region: "N/A",
							};
							Object.entries(t).forEach((e) => {
								const [t, a] = e;
								i[t] = a;
							});
							if (i.ip) i.ip_address = i.ip;
							if (i.country_name) i.country = i.country_name;
							if (i.ip_address)
								if (e.anonymizeIP) i.ip_address = anonymizeIP(i.ip_address);
							i.browser = r();
							i.device = n();
							_edata.userInfo = i;
							if (!_edata.uid) return;
							sendscript(e, "user", _edata.userInfo);
							e.trigger("track", {
								event: "user",
								sessionId: _edata.uid,
								category: _edata.category,
								videoId: _edata.id,
								videoTitle: _edata.label,
								userInfo: i,
							});
						}
				};
				a.open("GET", t, !0);
				a.send(null);
			}
			let i = "//ipapi.co/json/";
			if (e.abstractApiKey)
				i = "//ipgeolocation.abstractapi.com/v1/?api_key=" + e.abstractApiKey;
			else if (e.ipdataApiKey) i = "//api.ipdata.co?api-key=" + e.ipdataApiKey;
			t(i);
		}
		function n() {
			if ("undefined" !== window.orientation && void 0 !== window.orientation)
				return "Mobile";
			else return "Desktop";
		}
		function r() {
			if (-1 !== navigator.userAgent.indexOf("Chrome")) return "Google Chrome";
			else if (-1 !== navigator.userAgent.indexOf("Firefox"))
				return "Mozilla Firefox";
			else if (-1 !== navigator.userAgent.indexOf("MSIE"))
				return "Internet Exploder";
			else if (-1 !== navigator.userAgent.indexOf("Edge")) return "Edge";
			else if (-1 !== navigator.userAgent.indexOf("Safari")) return "Safari";
			else if (-1 !== navigator.userAgent.indexOf("Opera")) return "Opera";
			else if (-1 !== navigator.userAgent.indexOf("YaBrowser")) return "Yandex";
			else return "Other";
		}
		var o = () => {
			_edata = {};
		};
		this.on("dispose", o);
		this.on("loadeddata", t);
		this.on("playing", i);
	},
	SeekTracking = function (e) {
		if (!(this.el_.className.indexOf("vjs-live") > -1)) {
			var i = 0,
				a = 0,
				n = () => {
					i = 0;
					a = 0;
				};
			this.on("dispose", n);
			this.on("loadstart", n);
			var r = this.el().querySelector(".vjs-progress-holder");
			r.onmouseup = r.ontouchend = () => {
				a = this.currentTime().toFixed(2);
				i++;
				_summaryData.seekCount = i;
				setTimeout(() => {
					if (_edata.uid)
						this.trigger("track", {
							event: "seek",
							sessionId: _edata.uid,
							videoId: _edata.id,
							category: _edata.category,
							videoTitle: _edata.label,
							seekTo: a,
							seekCount: i,
						});
				}, 200);
			};
		}
	},
	MuteTracking = function (e) {
		this.on("volumechange", () => {
			if (_edata.uid)
				if (this.currentTime() > 1) {
					if (this.muted())
						this.trigger("track", {
							event: "mute",
							sessionId: _edata.uid,
							category: _edata.category,
							videoId: _edata.id,
							videoTitle: _edata.label,
						});
					if (!0 !== this.muted())
						this.trigger("track", {
							event: "unmute",
							sessionId: _edata.uid,
							category: _edata.category,
							videoId: _edata.id,
							videoTitle: _edata.label,
						});
				}
		});
	},
	RateTracking = function (e) {
		this.on("ratechanged", (e, i) => {
			if (_edata.uid)
				if (i.oldRate !== i.newRate)
					this.trigger("track", {
						event: "rateChange",
						sessionId: _edata.uid,
						category: _edata.category,
						videoId: _edata.id,
						videoTitle: _edata.label,
						rate: i.newRate,
					});
		});
	},
	ResolutionChange = function (e) {
		this.on("resolutionchange", (e, i) => {
			if (_edata.uid)
				this.trigger("track", {
					event: "resolutionChange",
					sessionId: _edata.uid,
					category: _edata.category,
					videoId: _edata.id,
					videoTitle: _edata.label,
					resolution: i.res,
				});
		});
	},
	defaults = {
		analytics: !1,
		trackingUrl: void 0,
		abstractApiKey: void 0,
		ipdataApiKey: void 0,
		anonymizeIP: !1,
		base64: !1,
	},
	events = function (e) {
		try {
			e = videojs.obj.merge(defaults, e);
		} catch (t) {
			e = videojs.mergeOptions(defaults, e);
		}
		this.analytics = e.analytics;
		this.anonymizeIP = e.anonymizeIP;
		this.abstractApiKey = e.abstractApiKey;
		this.ipdataApiKey = e.ipdataApiKey;
		this.trackingUrl = e.trackingUrl;
		this.base64 = e.base64;
		this.getSummary = () => _summaryData;
		PauseTracking.apply(this, arguments);
		ResumeTracking.apply(this, arguments);
		MuteTracking.apply(this, arguments);
		RateTracking.apply(this, arguments);
		BufferTracking.apply(this, arguments);
		PercentileTracking.apply(this, arguments);
		PlayTracking.apply(this, arguments);
		SeekTracking.apply(this, arguments);
		SummaryTracking.apply(this, arguments);
		ResolutionChange.apply(this, arguments);
	};
if ("undefined" !== typeof window) {
	var registerPlugin = videojs.registerPlugin || videojs.plugin,
		getPlugin = videojs.getPlugin || videojs.plugin;
	if (void 0 === getPlugin("events")) registerPlugin("events", events);
}
events.VERSION = "3.0.0";
export default events;
