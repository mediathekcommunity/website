/**
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * UpNext plugin for video.js
 * Version 1.2.0
 */
/* eslint-disable */ import videojs from 'video.js';
function factory(e, i, l) {
	var n = { nextTitle: 'Up Next', offset: 30 };
	try {
		l = videojs.obj.merge(n, l || {});
	} catch (e) {
		l = videojs.mergeOptions(n, l || {});
	}
	var t,
		a,
		o,
		r = !1,
		d = !1,
		s = l.nextTitle,
		c = l.offset,
		v = 0;
	e.upnext.title = function (e) {
		e.length > 1 && (s = e);
	};
	e.upnext.offset = function (e) {
		parseInt(e, 10) > 1 && (c = e);
	};
	if (!Array.isArray(i) && i.title && (i.sources || i.url) && i.poster) {
		var u = [];
		u[0] = i;
		i = u;
	}
	if (Array.isArray(i)) {
		for (var p = [], f = 0; f < i.length; f++)
			if (i[f].title && (i[f].sources || i[f].url) && i[f].poster) {
				var h = y('img');
				h.src = i[f].poster;
				i[f].img = h;
				p.push(i[f]);
			}
		if (p.length > 1) {
			t = p[1];
			v = 1;
		} else t = p[0];
		var m = null,
			g = null,
			j = null,
			C = null;
		if (0 != p.length) {
			videojs.dom.addClass(e.el(), 'vjs-up-next');
			e.on('timeupdate', function () {
				if (
					!videojs.dom.hasClass(e.el(), 'vjs-ad-playing') &&
					!videojs.dom.hasClass(e.el(), 'vjs-dai') &&
					!(p.length < 1) &&
					!(p.length > 1 && v == p.length - 1) &&
					!x()
				) {
					!0 !== r && e.currentTime() > 0 && e.duration() - e.currentTime() < c && b();
					if (r && e.duration() - e.currentTime() > c) {
						if (m) {
							m.onclick = null;
							m.parentNode.removeChild(m);
							m = null;
						}
						r = !1;
					}
				}
			});
			e.on('ended', function () {
				videojs.dom.hasClass(e.el(), 'vjs-ad-playing') ||
					videojs.dom.hasClass(e.el(), 'vjs-dai') ||
					k();
			});
			return this;
		}
	} else console.log('Error: Upnext - Invalid list array');
	function x() {
		return e.duration() === 1 / 0 || ('8' === videojs.browser.IOS_VERSION && 0 === e.duration());
	}
	function y(e, i, l) {
		var n = document.createElement(e);
		i && (n.className = i);
		l && (n.innerHTML = l);
		return n;
	}
	function b() {
		if (!r && !d) {
			(m = y('div', 'vjs-upnext')).ariaDisabled = !1;
			m.tabIndex = '0';
			m.ariaLabel = e.localize('UpNext video');
			var i = t.img;
			i.setAttribute('alt', t.title);
			m.appendChild(i);
			if (t.duration) {
				var l = y('div', 'next-dur', t.duration);
				m.appendChild(l);
			}
			var n = y(
				'span',
				'upnext-right',
				'<span class="nextup">' + s + '</span><span class="vjs-up-title">' + t.title + '</span>'
			);
			m.appendChild(n);
			if (t.url) {
				var a = y('a');
				a.href = t.url;
				a.target = '_blank';
				t.target ? (a.target = t.target) : (a.target = '_blank');
				m.appendChild(a);
			}
			e.el().appendChild(m);
			setTimeout(() => {
				m.className = 'vjs-upnext vjs-upnext-show';
			}, 500);
			r = !0;
			m.onkeydown = function (e) {
				if (13 === e.which) {
					e.preventDefault();
					e.stopPropagation();
					m.click();
				}
			};
			m.onclick = function () {
				if (a) a.click();
				else {
					e.changeSource(t);
					m.onclick = null;
					e.el().removeChild(m);
					m = null;
					e.play();
					if (1 == p.length) {
						d = !0;
						videojs.dom.removeClass(e.el(), 'vjs-up-next');
						p.splice(0, 1);
					} else v < p.length - 1 && (t = p[++v]);
				}
			};
		}
	}
	function k() {
		if (0 == p.length);
		else {
			videojs.dom.addClass(e.controlBar.el_, 'vjs-hidden');
			var i = e.el().querySelector('.vjs-replay-button');
			i &&
				setTimeout(function () {
					i.removeAttribute('style');
				}, 100);
			videojs.dom.addClass(e.el(), 'vjs-up-next');
			1 == p.length && (d = !0);
			if (m) {
				m.onclick = null;
				m.parentNode.removeChild(m);
				m = null;
			}
			j = y('div', 'vjs-nextup');
			var l = y('div', 'next-header', '<span>' + e.localize('Up Next') + '</span>');
			j.appendChild(l);
			g = y('div', 'vjs-fullnext');
			j.appendChild(g);
			var n = y('div', 'respo');
			n.tabIndex = 0;
			n.ariaDiabled = !1;
			n.ariaLabel = e.localize('Play') + ' ' + t.title;
			(a = y('div', 'img')).style.backgroundImage = 'url(' + t.poster + ')';
			n.appendChild(a);
			g.appendChild(n);
			if (t.duration) {
				var r = y('div', 'full-dur', t.duration);
				g.appendChild(r);
			}
			var s = y('div', 'next-title', t.title);
			g.appendChild(s);
			var c = y('div', 'progress');
			c.innerHTML =
				'<svg viewBox="0 0 84 84" preserveAspectRatio="xMinYMin meet"><circle class="circle1" cx="40" cy="40" r="40"></circle><circle id="circle2" class="circle2" cx="40" cy="40" r="40"></circle><g style="transform: translate(77%,26%) rotate(90deg) scale(3, 3);fill: #fff;"><path d="M3 12.2V3.8c0-.8.8-1.3 1.5-.9l7.1 4.2c.6.4.6 1.3 0 1.7L4.5 13c-.7.5-1.5 0-1.5-.8z"></path></g></svg>';
			g.appendChild(c);
			n.onclick = function () {
				if (t.url) {
					(o = y('a')).href = t.url;
					t.target ? (o.target = t.target) : (o.target = '_blank');
					g.appendChild(o);
					o.click();
				} else N();
			};
			C = y('div', 'next-overlay');
			e.el().appendChild(C);
			e.el().appendChild(j);
			if (p.length > 1) {
				var u = 'vjs-nav-prev',
					f = 'vjs-nav-next';
				0 === v && (u = 'vjs-nav-prev disabled');
				v === p.length - 1 && (f = 'vjs-nav-next disabled');
				var h = y('div', u, '<div class="icon"></div>'),
					x = y('div', f, '<div class="icon"></div>');
				h.ariaDisabled = x.ariaDisabled = !1;
				h.tabIndex = x.tabIndex = 0;
				h.role = x.role = 'button';
				x.ariaLabel = e.localize('Next video');
				h.ariaLabel = e.localize('Previous video');
				C.appendChild(h);
				C.appendChild(x);
				x.onkeydown = function (e) {
					if (13 === e.which) {
						e.preventDefault();
						e.stopPropagation();
						x.click();
					}
				};
				x.onclick = function () {
					if (++v > p.length - 1) v = p.length - 1;
					else {
						v === p.length - 1 && videojs.dom.addClass(x, 'disabled');
						videojs.dom.removeClass(h, 'disabled');
						k(v, 'next');
					}
				};
				h.onkeydown = function (e) {
					if (13 === e.which) {
						e.preventDefault();
						e.stopPropagation();
						h.click();
					}
				};
				h.onclick = function () {
					if (--v < 0) v = 0;
					else {
						0 === v && videojs.dom.addClass(h, 'disabled');
						videojs.dom.removeClass(x, 'disabled');
						k(v, 'prev');
					}
				};
				var b = y('div', 'next-close');
				b.innerHTML = '&#9447;';
				b.tabIndex = '0';
				b.ariaLabel = e.localize('Close UpNext container');
				b.ariaDisabled = !1;
				j.appendChild(b);
				b.onkeydown = function (e) {
					if (13 == e.which) {
						e.preventDefault();
						e.stopPropagation();
						b.click();
					}
				};
				b.onclick = function () {
					g.onclick = null;
					if (j) {
						j.parentNode.removeChild(j);
						j = null;
					}
					if (C) {
						C.parentNode.removeChild(C);
						C = null;
					}
					e.play();
					e.one('playing', function (i) {
						videojs.dom.removeClass(e.el(), 'vjs-up-next');
						videojs.dom.removeClass(e.controlBar.el_, 'vjs-hidden');
						d = !0;
						if (1 == p.length) {
							d = !0;
							p.splice(0, 1);
							t = null;
						}
					});
				};
				function k(i, l) {
					t = p[i];
					var d = y('div', 'img');
					d.style.backgroundImage = 'url(' + p[i].poster + ')';
					d.style.left = 'next' == l ? '100%' : '-100%';
					var c,
						v = 100,
						u = -100;
					n.appendChild(d);
					function f() {
						if ((v -= 3) <= 0) {
							cancelAnimationFrame(c);
							d.style.left = 0;
							a.parentNode.removeChild(a);
							a = d;
							d = null;
						} else {
							v > 0 && (d.style.left = v + '%');
							c = requestAnimationFrame(f);
						}
					}
					function h() {
						if ((u += 3) >= 0) {
							cancelAnimationFrame(c);
							d.style.left = 0;
							a.parentNode.removeChild(a);
							a = d;
							d = null;
						} else {
							u < 0 && (d.style.left = u + '%');
							c = requestAnimationFrame(h);
						}
					}
					c = 'next' == l ? requestAnimationFrame(f) : requestAnimationFrame(h);
					s.innerHTML = p[i].title;
					n.ariaLabel = e.localize('Play') + ' ' + p[i].title;
					o && n.removeChild(o);
					if (p[i].duration && r) {
						r.innerHTML = p[i].duration;
						videojs.dom.removeClass(r, 'vjs-hidden');
					} else r && videojs.dom.addClass(r, 'vjs-hidden');
				}
			}
		}
		function N() {
			g.onclick = null;
			if (j) {
				j.parentNode.removeChild(j);
				j = null;
			}
			if (C) {
				C.parentNode.removeChild(C);
				C = null;
			}
			e.changeSource(t);
			e.play();
			e.one('playing', function (i) {
				videojs.dom.removeClass(e.el(), 'vjs-up-next');
				videojs.dom.removeClass(e.controlBar.el_, 'vjs-hidden');
				if (1 == p.length) {
					d = !0;
					p.splice(0, 1);
					t = null;
				}
			});
			p.length > 1 && v < p.length - 1 && (t = p[++v]);
		}
	}
}
var registerPlugin = videojs.registerPlugin || videojs.plugin,
	plugin = function (e, i) {
		this.ready(function () {
			factory(this, e, i);
		});
	};
'undefined' !== typeof window && registerPlugin('upnext', plugin);
export default plugin;
