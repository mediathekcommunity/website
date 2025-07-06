/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * Transcript plugin for video.js
 * Version 1.0.0
 */
/* eslint-disable */ import videojs from "video.js";

window["videojs.transcript"] = { version: "1.0" };
const defaults = {
		timestamps: !0,
		linelength: 160,
		timegap: 10,
		theme: "dark",
		css: !1,
		enabled: !0,
	},
	onPlayer = (s, t) => {
		try {
			t = videojs.obj.merge(defaults, t || {});
		} catch (s) {
			t = videojs.mergeOptions(defaults, t || {});
		}
		var e = [],
			n = 0,
			r = "",
			i = 0,
			l = null,
			a = null,
			o = null,
			d = null,
			c = null,
			v = null,
			p = null,
			h = 0,
			f = 0;
		s.transcript.enabled = (s) => {
			t.enabled = s;
		};
		function u(s, t, e, n) {
			var r;
			if (s) {
				r = document.createElement(s);
				if (t) r.className = t;
				if (e)
					Object.entries(e).forEach((s) => {
						const [t, e] = s;
						r.setAttribute(t, e);
					});
				if (n) r.innerHTML = n;
			}
			return r;
		}
		function g(s) {
			var t = parseInt(s, 10),
				e = Math.floor(t / 3600),
				n = Math.floor((t - 3600 * e) / 60),
				r = t - 3600 * e - 60 * n;
			if (e < 10) e = "0" + e;
			if (n < 10) n = "0" + n;
			if (r < 10) r = "0" + r;
			if (e < 1) return n + ":" + r;
			else return e + ":" + n + ":" + r;
		}
		s.on("loadeddata", () => {
			s.one("playing", () => {
				setTimeout(() => {
					x();
				}, 300);
			});
		});
		function j() {
			if (s.el_.className.indexOf("vjs-live")) return !0;
			else return !1;
		}
		function b() {
			if (!0 === t.enabled && !j()) {
				if (o) o.classList.add("vjs-hidden");
				if (d) d.classList.add("vjs-hidden");
				if (v) v.innerHTML = "";
				if (c) c.innerHTML = "";
			} else b();
		}
		function x() {
			e = [];
			if (o) o.classList.add("vjs-hidden");
			var l = s.textTracks();
			if (l.length < 1) l = s.remoteTextTracks();
			for (var a = 0; a < l.length; a++) {
				var c = l[a];
				if (
					("captions" === c.kind || "subtitles" === c.kind) &&
					"hidden" !== c.mode
				)
					if (c.cues.length > 0) {
						var v = [],
							p = c.cues;
						v.default = c.default;
						v.language = c.language;
						if (c.label) v.label = c.label;
						else if (c.language) v.label = c.language;
						else v.label = "Unknown";
						v.cues = [];
						n = 0;
						r = "";
						i = 0;
						h = 0;
						for (var u = 0; u < p.length; u++) {
							var g = p[u].startTime;
							if (r.length > 0)
								r += " " + p[u].text.replace(/(<([^>]+)>)/gi, "");
							else {
								r = p[u].text.replace(/(<([^>]+)>)/gi, "");
								n = p[u].startTime;
							}
							i = r.length;
							if (g > h + t.timegap || i > t.linelength || u === p.length - 1) {
								h = p[u].startTime;
								h = p[u].endTime;
								h = g;
								var j = {};
								j.startTime = n;
								j.endTime = p[u].endTime;
								j.text = r;
								v.cues.push(j);
								n = 0;
								r = "";
								i = 0;
							}
						}
						e.push(v);
					}
			}
			if (e.length > 0) {
				for (var x = 0; x < e.length; x++)
					if (!0 === e[x].default && e[x].cues.length > 0) f = x;
				if (o) o.classList.add("vjs-hidden");
				if (d) d.classList.remove("vjs=hidden");
				y();
				m(f);
				L();
				if (d) d.classList.remove("vjs-hidden");
			} else b();
		}
		function m(n) {
			v.innerHTML = "";
			for (var r = 0; r < e[n].cues.length; r++) {
				var i = document.createElement("li");
				i.id = "transcript-cue-" + r;
				i.dir = "lt";
				i.role = "option";
				i.ariaSelected = "false";
				i.ariaLabel = "Transcript Segment";
				var l =
					'<span class="txt">' +
					e[n].cues[r].text +
					'</span><span class="vjs-stamp';
				if (!0 !== t.timestamps) l += " vjs-hidden";
				l += '">' + g(e[n].cues[r].startTime) + "</span>";
				i.innerHTML = l;
				i.id = "transcript-cue-" + r;
				v.appendChild(i);
				i.onclick = (t) => {
					n = (n = t.target.id).replace("transcript-cue-", "");
					n = parseInt(n, 10);
					s.currentTime(e[f].cues[n].startTime);
				};
			}
		}
		s.on("playerresize", () => {
			k();
		});
		function k() {
			if (!(e.length < 1)) {
				if (s.el_.offsetWidth < 480) o.classList.add("vjs-trns-full");
				else o.classList.remove("vjs-trns-full");
			}
		}
		function w() {
			for (var s = v.querySelectorAll("li"), t = 0; t < s.length; t++)
				s[t].removeAttribute("class");
		}
		s.on("timeupdate", () => {
			if (e.length > 0) {
				var t = v.querySelectorAll("li");
				if (v)
					for (var n = s.currentTime(), r = 0; r < t.length; r++)
						if (n >= e[f].cues[r].startTime && n < e[f].cues[r].endTime)
							if ("trns-current" !== t[r].className) {
								w();
								t[r].className = "trns-current";
								v.parentNode.scrollTo({
									top: t[r].offsetTop,
									behavior: "smooth",
								});
							}
			}
		});
		function L() {
			c.innerHTML = "";
			for (var s = 0; s < e.length; s++) {
				var t = u("li", "vjs-lang-item", { "data-id": s }, e[s].label);
				c.appendChild(t);
				var n = "vjs-lang-checked";
				if (f !== s) n = "vjs-lang-checked vjs-hidden";
				var r = u(
					"div",
					n,
					{},
					'<svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.66668 6.39041L10.1953 0.861816L11.1381 1.80463L5.13808 7.80463C4.87773 8.06498 4.45562 8.06498 4.19527 7.80463L0.861938 4.47129L1.80475 3.52848L4.66668 6.39041Z"></path></svg>',
				);
				t.appendChild(r);
				t.onclick = (s) => {
					var t = s.target.getAttribute("data-id");
					c.querySelectorAll(".vjs-lang-checked").forEach((s) => {
						s.classList.add("vjs-hidden");
					});
					s.target
						.querySelector(".vjs-lang-checked")
						.classList.remove("vjs-hidden");
					p.querySelector("label").innerHTML = e[t].label;
					m(t);
				};
			}
		}
		function y() {
			if (null === o) {
				var n =
						'<svg viewBox="0 0 32 32"><path d="M0.013 20.822c-0.941 0.527-0.897 2.265 0.071 2.678 1.477 0.038 3.521-0.057 5.014 0.001 1.093-0.383 0.938-2.407-0.107-2.678-1.687 0.020-3.502-0.011-4.978-0zM-0.012 14.441c-1.035 0.527-0.987 2.265 0.078 2.678 1.625 0.038 3.873-0.057 5.515 0.001 1.202-0.383 1.032-2.407-0.118-2.678-1.856 0.020-3.852-0.011-5.475-0zM18.163 6.014c-4.482 0.708-8.081 4.885-8.159 9.408-0.398 5.174 3.914 10.25 9.136 10.418 2.587 0.238 5.72-1.062 7.596-2.841 1.492 1.043 2.739 2.15 4.327 3.035 1.334 0.427 2.29-0.872 1.458-2.023-1.309-1.21-2.824-2.17-4.247-3.239 2.416-4.212 1.199-10.080-2.743-12.932-2.077-1.569-4.797-2.269-7.368-1.826zM0.064 8.488c-1.238 0.527-1.181 2.265 0.093 2.678 1.944 0.038 4.634-0.057 6.598 0.001 1.438-0.383 1.234-2.407-0.141-2.678-2.22 0.020-4.608-0.011-6.551-0zM21.717 8.616c4.237 1.604 5.359 3.846 5.536 7.714-0.098 3.482-4.342 7.421-7.877 7.072-4.498-0.421-6.814-4.022-6.924-7.235-0.268-3.121 2.354-6.831 5.38-7.578 1.044-0.235 2.85-0.232 3.884 0.026z"></path></svg>',
					i = videojs.dom.createEl(
						"button",
						{ className: "vjs-transcript-button vjs-control vjs-button" },
						{ role: "button", type: "button", "aria-disabled": "false" },
					),
					h = s.controlBar.addChild("button", { el: i });
				h.el_.innerHTML =
					'<span aria-hidden="true" class="vjs-icon-placeholder vjs-svg-icon">' +
					n +
					'</span><span class="vjs-control-text" aria-live="polite">' +
					s.localize("Transcript") +
					"</span>";
				d = h.el_;
				var g = s.el_.querySelector(".vjs-subs-caps-button");
				if (g) s.controlBar.el_.insertBefore(h.el_, g.nextSibling);
				else {
					g = s.controlBar.getChild("fullscreenToggle").el_;
					s.controlBar.el_.insertBefore(h.el_, g);
				}
				o = u("div", "vjs-trns vjs-hidden");
				var j = u("div", "vjs-trns-header");
				a = u("div", "vjs-trns-search");
				var b = u("input", "", {
					type: "text",
					dir: "auto",
					role: "combobox",
					placeholder: s.localize("Search transcript"),
				});
				trsicon = u(
					"div",
					"vjs-trns-sicon",
					{ "data-icon": "Search" },
					'<svg viewBox="0 0 20 20" fill="none"><path d="M14.5776 14.5419C15.5805 13.53 16.2 12.1373 16.2 10.6C16.2 7.50721 13.6928 5 10.6 5C7.50721 5 5 7.50721 5 10.6C5 13.6928 7.50721 16.2 10.6 16.2C12.1555 16.2 13.5628 15.5658 14.5776 14.5419ZM14.5776 14.5419L19 19" stroke-linecap="round" stroke-linejoin="round"/></svg>',
				);
				a.appendChild(trsicon);
				a.appendChild(b);
				var x = u("div", "vjs-trns-nav vjs-hidden"),
					m =
						'<svg width="24" height="24" viewBox="0 0 24 24" data-icon="close"><path clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM14.7071 9.26251C14.3571 8.9125 13.7896 8.9125 13.4396 9.26251L12 10.7023L10.5604 9.26252C10.2104 8.9125 9.64292 8.9125 9.29293 9.26252L9.26302 9.29244C8.91306 9.64243 8.91306 10.2099 9.26302 10.5599L10.7027 11.9997L9.26247 13.4401C8.91251 13.7901 8.91251 14.3576 9.26247 14.7076L9.29239 14.7375C9.64237 15.0875 10.2098 15.0875 10.5598 14.7375L12 13.2971L13.4402 14.7375C13.7902 15.0875 14.3576 15.0875 14.7076 14.7375L14.7375 14.7076C15.0875 14.3576 15.0875 13.7901 14.7375 13.4401L13.2973 11.9997L14.737 10.5599C15.0869 10.2099 15.0869 9.64243 14.737 9.29244L14.7071 9.26251Z" fill-rule="evenodd"></path></svg>',
					w = u(
						"div",
						"trns-search-action trns-cursor",
						{ type: "reset", "aria-label": "Clear Search Results" },
						m,
					);
				x.appendChild(w);
				a.appendChild(x);
				var y = u("div", "vjs-trns-btns"),
					C =
						'<svg viewBox="0 0 32 32" stroke="#fff"><style type="text/css">.st0{fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><path class="st0" d="M28.6,13c-1.6,0.2-3.1-0.5-4-2c-0.8-1.4-0.7-3.2,0.3-4.4c-1.5-1.4-3.3-2.4-5.2-3C19.1,5,17.7,6,16,6,s-3.1-1-3.7-2.5c-2,0.6-3.8,1.6-5.2,3C8,7.8,8.2,9.6,7.3,11c-0.8,1.4-2.4,2.2-4,2c-0.2,1-0.4,2-0.4,3c0,1,0.1,2.1,0.4,3,c1.6-0.2,3.1,0.5,4,2c0.8,1.4,0.7,3.2-0.3,4.4c1.5,1.4,3.3,2.4,5.2,3c0.6-1.4,2-2.5,3.7-2.5s3.1,1,3.7,2.5c2-0.6,3.8-1.6,5.2-3,c-0.9-1.2-1.1-3-0.3-4.4c0.8-1.4,2.4-2.2,4-2c0.2-1,0.4-2,0.4-3C29,15,28.9,13.9,28.6,13z"/><circle class="st0" cx="16" cy="16" r="3"/></svg>',
					T =
						((C =
							'<svg fill="#fff" viewBox="0 0 24 24"><path d="M12,16a4,4,0,1,0-4-4A4,4,0,0,0,12,16Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,12,10ZM3.5,12.877l-1,.579a2,2,0,0,0-.733,2.732l1.489,2.578A2,2,0,0,0,5.99,19.5L7,18.916a1.006,1.006,0,0,1,1.008.011.992.992,0,0,1,.495.857V21a2,2,0,0,0,2,2h3a2,2,0,0,0,2-2V19.782a1.009,1.009,0,0,1,1.5-.866l1.009.582a2,2,0,0,0,2.732-.732l1.488-2.578a2,2,0,0,0-.733-2.732l-1-.579a1.007,1.007,0,0,1-.5-.89,1,1,0,0,1,.5-.864l1-.579a2,2,0,0,0,.733-2.732L20.742,5.234A2,2,0,0,0,18.01,4.5L17,5.083a1.008,1.008,0,0,1-1.5-.867V3a2,2,0,0,0-2-2h-3a2,2,0,0,0-2,2V4.294a.854.854,0,0,1-.428.74l-.154.089a.864.864,0,0,1-.854,0L5.99,4.5a2,2,0,0,0-2.733.732L1.769,7.813A2,2,0,0,0,2.5,10.544l1,.578a1.011,1.011,0,0,1,.5.891A.994.994,0,0,1,3.5,12.877Zm1-3.487-1-.578L4.99,6.234l1.074.62a2.86,2.86,0,0,0,2.85,0l.154-.088A2.863,2.863,0,0,0,10.5,4.294V3h3V4.216a3.008,3.008,0,0,0,4.5,2.6l1.007-.582L20.5,8.812l-1,.578a3.024,3.024,0,0,0,0,5.219l1,.579h0l-1.488,2.578L18,17.184a3.008,3.008,0,0,0-4.5,2.6V21h-3V19.784a3.006,3.006,0,0,0-4.5-2.6l-1.007.582L3.5,15.188l1-.579a3.024,3.024,0,0,0,0-5.219Z"/></svg>'),
						u(
							"button",
							"vjs-trns-btn",
							{ type: "button", "aria-label": s.localize("Settings") },
							C,
						)),
					M =
						'<svg viewBox="0 0 20 20" focusable="false"><path d="M11.06 10l4.597-4.596a.749.749 0 1 0-1.061-1.06L10 8.938 5.404 4.343a.749.749 0 1 0-1.06 1.061L8.938 10l-4.596 4.596a.749.749 0 1 0 1.061 1.06L10 11.062l4.596 4.596a.749.749 0 1 0 1.06-1.061L11.062 10z" fill-rule="evenodd"></path></svg>',
					z = u(
						"button",
						"vjs-trns-btn",
						{ type: "button", "aria-label": s.localize("Close Transcript") },
						M,
					);
				y.appendChild(T);
				y.appendChild(z);
				j.appendChild(a);
				j.appendChild(y);
				var N = u("div", "vjs-trns-settings vjs-hidden"),
					S = u("div", "vjs-settings-header", {}, "Settings"),
					A = u(
						"button",
						"vjs-settings-close",
						{ type: "button", "aria-label": s.localize("Close settings") },
						m,
					);
				S.appendChild(A);
				N.appendChild(S);
				var _ =
					'<svg viewBox="0 0 24 24"><path d="M9.71 17.71l-1.42-1.42 4.3-4.29-4.3-4.29 1.42-1.42 5 5a1 1 0 0 1 0 1.41z"></path></svg>';
				p = u(
					"div",
					"trns-item",
					{},
					"<span>" +
						s.localize("Language") +
						"</span><label>" +
						e[f].label +
						"</label>" +
						_,
				);
				N.appendChild(p);
				var B = null,
					H = null,
					q = u(
						"div",
						"trns-item",
						{},
						"<span>" + s.localize("Timestaps") + "</span>",
					);
				if (!0 !== t.timestamps) {
					H = u("div", "trns-switch  trns-switch-off", { id: "stamp_switch" });
					B = u("label", "", {}, s.localize("Off"));
				} else {
					H = u("div", "trns-switch", { id: "stamp_switch" });
					B = u("label", "", {}, s.localize("On"));
				}
				var E = u(
					"div",
					"trns-item",
					{},
					"<span>" + s.localize("Theme") + "</span>" + s.localize("Dark"),
				);
				if ("dark" === t.theme)
					l = u("div", "trns-switch", { id: "theme_switch" });
				else
					l = u("div", "trns-switch trns-switch-off", { id: "theme_switch" });
				var V = u("button", "vjs-trns-back", {}, "Back to Transcript");
				q.appendChild(B);
				q.appendChild(H);
				E.appendChild(l);
				N.appendChild(q);
				N.appendChild(E);
				N.appendChild(V);
				var O = u("div", "vjs-trns-lang vjs-hidden"),
					Z = u("div", "vjs-lang-header", {}, "Language"),
					P = u(
						"button",
						"vjs-lang-back",
						{ type: "button", "aria-label": "Back" },
						_,
					);
				c = u("ul", "vjs-lang-list");
				L();
				var I = u("button", "vjs-trns-back", {}, "Back to Transcript");
				Z.appendChild(P);
				O.appendChild(Z);
				O.appendChild(c);
				O.appendChild(I);
				o.appendChild(N);
				o.appendChild(O);
				o.appendChild(j);
				var R = u("div", "vjs-trns-list");
				v = document.createElement("ul");
				R.appendChild(v);
				o.appendChild(R);
				if (!0 !== t.css) {
					var D =
							'.vjs-trns{background-color:#000;color:#fff;height:100%;overflow:hidden;position:absolute;right:0;top:0;width:360px;z-index:6}.vjs-trns .vjs-trns-back{background:#f0f0f0;border:1px solid #ccc;border-radius:6px;color:#000;cursor:pointer;display:block;margin:15px auto;padding:10px;-webkit-transition:background .3s ease-out;transition:background .3s ease-out;white-space:nowrap;width:auto}.vjs-trns .vjs-trns-back:hover{background:#e5e5e5}.vjs-trns-lt{background-color:#f5f5f5;border:1px solid #e5e5e5;color:#222}.vjs-trns-full{width:100%}.vjs-trns .vjs-trns-lang{background-color:inherit;color:inherit;height:100%;left:0;overflow-x:hidden;overflow-y:auto;position:absolute;scrollbar-width:none;top:0;width:100%;z-index:3}.vjs-trns .vjs-trns-lang::-webkit-scrollbar{display:none}.vjs-trns .vjs-trns-lang .vjs-lang-header{border-bottom:1px solid #ccc;font-size:14px;font-weight:700;padding:18px;position:relative;text-align:center}.vjs-trns .vjs-trns-lang .trns-lang-item{cursor:pointer;display:flex;line-height:22px;padding:10px 18px}.vjs-trns .vjs-trns-lang .vjs-lang-back{fill:#fff;background-color:transparent;border-radius:5px;cursor:pointer;height:40px;left:5px;padding:3px;position:absolute;top:5px;width:40px}.vjs-trns-lt .vjs-trns-lang .vjs-lang-back{fill:#000}.vjs-trns .vjs-trns-lang .vjs-lang-back svg{transform:rotate(180deg)}.vjs-trns .vjs-trns-lang .vjs-lang-back:hover{background-color:#484848}.vjs-trns-lt .vjs-trns-lang .vjs-lang-back:hover{background-color:#e5e5e5}.vjs-trns .vjs-trns-lang .vjs-lang-list::-webkit-scrollbar{display:none}.vjs-trns .vjs-trns-lang .vjs-lang-list{color:inherit;display:block;font-family:Arial,sans-serif;font-size:15px;font-weight:300;line-height:20px;list-style:none;margin:20px 8px 10px;overflow-x:hidden;overflow-y:auto;padding:0;position:relative;scrollbar-width:none;text-shadow:none}.vjs-trns .vjs-trns-lang .vjs-lang-item{cursor:pointer;line-height:22px;padding:10px 10px 10px 35px;position:relative}.vjs-trns .vjs-trns-lang .vjs-lang-item:hover{background-color:#333}.vjs-trns-lt .vjs-trns-lang .vjs-lang-item:hover{background-color:#ccc}.vjs-trns .vjs-trns-lang .vjs-lang-checked{fill:#fff;height:24px;left:10px;position:absolute;top:8px;width:24px}.vjs-trns-lt .vjs-trns-lang .vjs-lang-checked{fill:#222}.vjs-trns .vjs-trns-settings{background-color:inherit;height:100%;left:0;overflow-x:hidden;overflow-y:auto;position:absolute;scrollbar-width:none;top:0;width:100%;z-index:3}.vjs-trns .vjs-trns-settings::-webkit-scrollbar{display:none}.vjs-trns .vjs-trns-settings .vjs-settings-header{border-bottom:1px solid #ccc;color:inherit;font-size:14px;font-weight:700;margin-bottom:10px;padding:18px;position:relative;text-align:left}.vjs-trns-lt .vjs-trns-settings .vjs-settings-header{background:#f0f0f0}.vjs-trns .vjs-trns-settings .vjs-settings-close{fill:#fff;background-color:transparent;border-radius:5px;cursor:pointer;height:32px;padding:4px;position:absolute;right:10px;top:10px;width:32px}.vjs-trns-lt .vjs-trns-settings .vjs-settings-close{fill:#222}.vjs-trns .vjs-trns-settings .vjs-settings-close:hover{background-color:#484848}.vjs-trns-lt .vjs-trns-settings .vjs-settings-close:hover{background-color:#ccc}.vjs-trns .vjs-trns-settings .trns-item{cursor:pointer;display:flex;line-height:22px;padding:10px 18px}.vjs-trns .vjs-trns-settings .trns-item span{flex-grow:1}.vjs-trns-settings .trns-item:hover{background:#333}.vjs-trns-lt .vjs-trns-settings .trns-item:hover{background:#ccc}.vjs-trns .vjs-trns-settings .trns-item svg{fill:#fff;height:24px;padding-left:8px;width:auto}.vjs-trns-lt .vjs-trns-settings .trns-item svg{fill:#222}.vjs-trns .vjs-trns-settings .trns-switch{background-color:#2f8363;border-radius:10px;display:inline-block;height:16px;margin:3px 6px;position:relative;width:33px}.vjs-trns .vjs-trns-settings .trns-switch:before{background-color:#fff;border-radius:50%;content:"";height:12px;position:absolute;right:3px;top:2px;width:12px}.vjs-trns .vjs-trns-settings .trns-switch-off{background-color:#666}.vjs-trns .vjs-trns-settings .trns-switch-off:before{left:3px}.vjs-trns .vjs-trns-header{display:flex;padding:8px 10px;width:100%}.vjs-trns .vjs-trns-search{background-color:#222;border:1px solid #999;-webkit-border-radius:6px;border-radius:6px;display:flex;flex:auto;padding:0 5px;position:relative}.vjs-trns-lt .vjs-trns-search{background-color:#f0f0f0;border:1px solid #ccc}.vjs-trns .vjs-trns-header input[type=text]{background-color:#222;border:0;color:#f0f0f0;font-size:12px;padding:10px 5px;width:100%}.vjs-trns-lt .vjs-trns-header input[type=text]{background-color:#f0f0f0;color:#222}.vjs-trns .vjs-trns-nav{padding-top:4px}.vjs-trns .vjs-trns-nav .trns-search-action{fill:#fff;border-radius:4px;display:inline-block;height:24px;width:24px}.vjs-trns-lt .vjs-trns-nav .trns-search-action{fill:#222}.vjs-trns .vjs-trns-nav .trns-search-action:hover{background:#484848}.vjs-trns-lt .vjs-trns-nav .trns-search-action:hover{background:transparent}.vjs-trns .vjs-trns-btns{padding-left:8px}.trns-cursor{cursor:pointer}.vjs-trns .vjs-trns-sicon{stroke:#fff;display:inline-block;height:24px;padding-top:4px;width:24px}.vjs-trns-lt .vjs-trns-sicon{stroke:#222}.vjs-trns .vjs-trns-btn{fill:#fff;background:#444;-webkit-border-radius:4px;border-radius:4px;cursor:pointer;height:100%;margin:0 2px;width:34px}.vjs-trns-lt .vjs-trns-btn svg{fill:#222}.vjs-trns-lt .vjs-trns-btn{fill:#222;background:#e5e5e5}.vjs-trns-lt .vjs-trns-btn:hover{background:#ccc}.vjs-trns .vjs-trns-list::-webkit-scrollbar{display:none}.vjs-trns .vjs-trns-list{-webkit-overflow-scrolling:touch;-ms-overflow-style:none;height:calc(100% - 55px);overflow-x:hidden;overflow-y:auto;scrollbar-width:none;width:100%}.vjs-trns .vjs-trns-list ul{color:#ccc;display:block;font-family:Arial,sans-serif;font-size:12px;font-weight:300;line-height:20px;list-style:none;margin:0 8px;padding:0;position:relative;text-shadow:none}.vjs-trns-lt .vjs-trns-list ul{color:#222}.vjs-trns .vjs-trns-list ul li{border:2px solid transparent;cursor:pointer;display:flex;padding:8px;text-align:left;-webkit-transition:background .3s ease-out;transition:background .3s ease-out;width:100%}.vjs-trns-lt .vjs-trns-list ul li{padding-left:0}.vjs-trns .vjs-trns-list ul li .vjs-m1{background-color:#e5e5e5;background-color:#999;border-radius:4px;color:#000;color:#fff;font-weight:700;font-weight:400;padding:3px 4px;z-index:1}.vjs-trns .vjs-trns-list ul li .vjs-m2{background:#666;border-radius:4px;padding:4px 2px}.vjs-trns .vjs-trns-list ul li:hover{background:#363636;color:#fff}.vjs-trns-lt .vjs-trns-list ul li:hover{background:#e0e0e0;color:#222}.vjs-trns .vjs-trns-list .trns-current{border:2px solid #b5b5b5;-webkit-border-radius:8px;border-radius:8px}.vjs-trns-lt .vjs-trns-list .trns-current{background:#e5e5e5;border:0;border-left:1px solid #f99;border-radius:0}.vjs-trns .vjs-trns-list ul li .txt{padding:0 8px 0 5px;pointer-events:none}.vjs-trns-lt .vjs-trns-list ul li{border-left:1px solid transparent}.vjs-trns .vjs-trns-list ul li .vjs-stamp{align-items:center;background:hsla(0,0%,100%,.2);-webkit-border-radius:2px;border-radius:2px;display:flex;gap:10px;height:20px;justify-content:center;padding:4px;pointer-events:none}.vjs-trns-lt .vjs-trns-list ul li .vjs-stamp{background:#e5e5e5}.vjs-trns .vjs-trns-list ul li:hover .vjs-stamp{background:#565656}.vjs-trns-lt .vjs-trns-list ul li:hover .vjs-stamp{background:#ccc}',
						U = document.createElement("style");
					U.innerHTML = D;
					s.el_.appendChild(U);
				}
				s.el_.appendChild(o);
				V.onclick = I.onclick = () => {
					N.classList.add("vjs-hidden");
					O.classList.add("vjs-hidden");
				};
				h.el_.onclick = h.el_.ontouchend = (s) => {
					s.preventDefault();
					s.stopPropagation();
					if ("vjs-trns" === o.className) o.className = "vjs-trns vjs-hidden";
					else if ("dark" == t.theme) o.className = "vjs-trns";
					else o.className = "vjs-trns vjs-trns-lt";
					k();
				};
				P.onclick = () => {
					N.classList.remove("vjs-hidden");
					O.classList.add("vjs-hidden");
				};
				p.onclick = () => {
					N.classList.add("vjs-hidden");
					O.classList.remove("vjs-hidden");
				};
				E.onclick = () => {
					if ("dark" === t.theme) {
						t.theme = "light";
						l.classList.add("trns-switch-off");
						o.classList.add("vjs-trns-lt");
					} else {
						t.theme = "dark";
						l.classList.remove("trns-switch-off");
						o.classList.remove("vjs-trns-lt");
					}
				};
				q.onclick = () => {
					if (t.timestamps) {
						t.timestamps = !1;
						H.classList.add("trns-switch-off");
						B.innerHTML = s.localize("Off");
						W(!1);
					} else {
						t.timestamps = !0;
						H.classList.remove("trns-switch-off");
						B.innerHTML = s.localize("On");
						W(!0);
					}
				};
				function W(s) {
					for (
						var t = v.querySelectorAll(".vjs-stamp"), e = 0;
						e < t.length;
						e++
					)
						if (s) t[e].classList.remove("vjs-hidden");
						else t[e].classList.add("vjs-hidden");
				}
				A.onclick = () => {
					N.classList.add("vjs-hidden");
				};
				z.onclick = () => {
					o.classList.add("vjs-hidden");
				};
				T.onclick = () => {
					N.classList.remove("vjs-hidden");
				};
				b.onfocus = () => {
					trsicon.className = "vjs-trns-sicon vjs-hidden";
				};
				b.onblur = () => {
					if (0 === b.value.length) trsicon.className = "vjs-trns-sicon";
				};
				b.onkeyup = () => {
					if (b.value.length > 0) {
						x.className = "vjs-trns-nav";
						trsicon.className = "vjs-trns-sicon vjs-hidden";
					} else {
						x.className = "vjs-trns-nav vjs-hidden";
						trsicon.className = "vjs-trns-sicon";
					}
					if (b.value.length > 2) F(b.value);
					else $();
				};
				w.onclick = () => {
					b.value = "";
					x.className = "vjs-trns-nav vjs-hidden";
					trsicon.className = "vjs-trns-sicon";
					setTimeout(() => {
						b.focus();
						$();
					}, 100);
				};
				function $() {
					for (var s = v.querySelectorAll(".txt"), t = 0; t < s.length; t++) {
						var e = s[t].innerHTML;
						e = e.replace(/(<mark class="vjs-m1">|<\/mark>)/gim, "");
						r = e.replace('<mark class="vjs-m1">', "");
						r = e.replace("</mark>", "");
						s[t].innerHTML = r;
					}
				}
				function F(s) {
					for (
						var t = !1, e = v.querySelectorAll(".txt"), n = 0;
						n < e.length;
						n++
					) {
						if (!0 !== t) t = !0;
						var r = e[n].innerHTML;
						r = (r = (r = r.replace(
							/(<mark class="vjs-m1">|<\/mark>)/gim,
							"",
						)).replace('<mark class="vjs-m1">', "")).replace("</mark>", "");
						const i = new RegExp(s, "gi"),
							l = (r = r.replace(
								/(<mark class="vjs-m1">|<\/mark>)/gim,
								"",
							)).replace(i, '<mark class="vjs-m1">$&</mark>');
						e[n].innerHTML = l;
					}
					for (var i = 0; i < e.length; i++) {
						if (e[i].querySelector("mark")) {
							v.parentNode.scrollTo({
								top: e[i].offsetTop,
								behavior: "smooth",
							});
							break;
						}
					}
				}
			}
		}
		return this;
	},
	transcript = function (s) {
		onPlayer(this, s);
	};
if ("undefined" != typeof window) {
	var registerPlugin = videojs.registerPlugin || videojs.plugin;
	registerPlugin("transcript", transcript);
}
transcript.VERSION = "1.0";
export default transcript;
