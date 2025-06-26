/**
 * Copyright (c) 2024 The Nuevodevel Team. All rights reserved.
 * News ticker plugin for video.js
 * Version 1.0.0
 */
!(function (e, t) {
	'function' == typeof define && define.amd
		? define([], t.bind(this, e, e.videojs))
		: 'undefined' != typeof module && module.exports
			? (module.exports = t(e, e.videojs))
			: t(e, e.videojs);
})(window, function (q, R) {
	'use strict';
	q.videojs_scroll = { version: '1.0' };
	R.registerPlugin('ticker', function (m) {
		var t = {
				rss: '',
				logo: '',
				logourl: '',
				logotitle: '',
				titleOnly: !1,
				clock: !0,
				speed: 5,
				direction: 'ltr',
				position: 'auto',
				toggleButton: !1,
				feed: void 0,
				refresh: 10,
				target: '_blank',
				withCredentials: !1,
				timeout: 2e3
			},
			e = (e = document.currentScript.src).substring(0, e.lastIndexOf('/'));
		try {
			m = R.obj.merge(t, m || {});
		} catch (e) {
			m = R.mergeOptions(t, m || {});
		}
		(m.refresh = parseInt(m.refresh)), m.refresh < 1 && (m.refresh = 1);
		var u = this,
			p = u.el(),
			g = null,
			v = null,
			h = null,
			f = null,
			C = null,
			j = null,
			y = null,
			k = null,
			w = null,
			N = null,
			T = null,
			L = null,
			b = !1,
			H = 0,
			n = null,
			M = [],
			E = [];
		if (m.rss)
			return (
				S(!1),
				0 < m.refresh &&
					(function e() {
						n = setTimeout(function () {
							g && (clearTimeout(n), u.ticker.update(), e());
						}, 6e4 * m.refresh);
					})(),
				this
			);
		function x(e) {
			let t = '';
			var n, s;
			return (
				e &&
					((n = e),
					((s = document.createElement('textarea')).innerHTML = n),
					(e = s.firstChild.nodeValue),
					(t = e.replace('<![CDATA[', '').replace(']]>', '')),
					'mix' == m.scrollType &&
						(t = (t = t.replace('<img', '||img')).replace('</img>', '||/img||')),
					'html' !== m.scrollType && (t = t.replace(/(<([^>]+)>)/gi, '')),
					(t = (t = (t = (t =
						'mix' == m.scrollType
							? (t = t.replace('||img', '<img')).replace('||/img||', '</img>')
							: t).replace(/\\u[\dA-F]{4}/gi, function (e) {
						return String.fromCharCode(parseInt(e.replace(/\\u/g, ''), 16));
					})).replace(/^\s+|\s+$/gm, '')).replace(/['"]+/g, ''))),
				t
			);
		}
		function s(e, t) {
			t || e.status;
			t
				? console.log('XHR URLHandler: Request timed out after ' + m.timeout + ' +ms.')
				: console.log('XHR URLHandler: ' + e.statusText + ' ' + e.statusCode);
		}
		function l(e, t) {
			if (
				(4 == e.readyState && 404 === e.status && console.log('Error 404. RSS file not found.'),
				4 == e.readyState &&
					0 === e.status &&
					console.log('XHTML Response Empty or blocked by CORS policy.'),
				200 === e.status)
			)
				try {
					var n = e.responseXML;
					if ('rss' == n.documentElement.localName)
						for (var s in n.documentElement.childNodes) {
							var l = n.documentElement.childNodes[s];
							if ('item' == l.localName) {
								var o,
									a = {},
									r = {};
								for (o in l.childNodes) {
									var i,
										d,
										c = l.childNodes[o];
									'title' == c.nodeName &&
										((i = (c.textContent || c.text || null).trim()), (a.content = x(i))),
										'link' == c.nodeName &&
											a.content &&
											(a.link = (c.textContent || c.text || '').trim()),
										'description' == c.nodeName &&
											((d = (c.textContent || c.text || null).trim()), (r.content = x(d))),
										'link' == c.nodeName &&
											r.content &&
											(r.link = (c.textContent || c.text || '').trim()),
										'pubTime' == c.nodeName &&
											r.content &&
											(r.time = (c.textContent || c.text || '').trim());
								}
								a && M.push(a),
									r && E.push(r),
									0 < M.length || 0 < E.length
										? t
											? (function (e, t) {
													if (0 < t.length && 1 != m.titleOnly) {
														k.innerHTML = '';
														for (var n = 0; n < t.length; n++) {
															var s = document.createElement('div'),
																l = ((s.className = 'news-item'), t[n].content);
															t[n].time && (l = '<span class="ct">' + t[n].time + '</span>' + l),
																t[n].link &&
																	(l =
																		'<a target="' +
																		m.target +
																		'" href="' +
																		t[n].link +
																		'">' +
																		l +
																		'</a>'),
																(s.innerHTML = '<span class="break"></span>' + l),
																k.appendChild(s);
														}
														(w.innerHTML = k.innerHTML), (H = 0), (M = e);
													} else {
														k.innerHTML = '';
														for (n = 0; n < e.length; n++) {
															var o = document.createElement('div'),
																l = ((o.className = 'news-item'), e[n].content);
															e[n].time && (l = '<span class="ct">' + e[n].time + '</span>' + l),
																e[n].link &&
																	(l =
																		'<a target="' +
																		m.target +
																		'" href="' +
																		e[n].link +
																		'">' +
																		l +
																		'</a>'),
																(o.innerHTML = '<span class="break"></span>' + l),
																k.appendChild(o);
														}
														w.innerHTML = k.innerHTML;
													}
													let a = 150;
													5 < m.speed && (a = 190);
													7 < m.speed && (a = 240);
													setTimeout(function () {
														var e = parseInt(k.offsetWidth / (a * (m.speed / 10)));
														k.style.animationDuration = w.style.animationDuration = e + 's';
													}, 200);
												})(M, E)
											: (function () {
													function d() {
														if (L) {
															var n = new Date();
															let e = n.getHours().toString(),
																t = (e.length < 2 && (e = '0' + e), n.getMinutes().toString());
															t.length < 2 && (t = '0' + t),
																(L.innerHTML = e + ':' + t),
																setTimeout(d, 1e3);
														}
													}
													function c() {
														var e, t, n;
														'top' === m.position
															? u.el_.classList.add('news-top')
															: ((e = (t =
																	u.el_.querySelector('.vjs-control-bar')).getBoundingClientRect()),
																u.el_.getBoundingClientRect(),
																(t = q.getComputedStyle(t).getPropertyValue('bottom')),
																(e = e.bottom - e.top + parseInt(t)),
																(t = 8),
																u.duration() === 1 / 0 ||
																	('8' === R.browser.IOS_VERSION && 0 === u.duration()) ||
																	(p.querySelector('.vjs-skin-treso') && (t = 20),
																	p.querySelector('.vjs-skin-roundal') && (t = 15),
																	p.querySelector('.vjs-skin-mockup') && (t = 14),
																	p.querySelector('.vjs-skin-jwlike') && (t = 14),
																	p.querySelector('.vjs-skin-chrome') && (t = 11),
																	p.querySelector('.vjs-skin-chrome') && (t = 14),
																	p.querySelector('.vjs-skin-gold') &&
																		(n = p.querySelector('.vjs-progress-control')) &&
																		((n = q.getComputedStyle(n).getPropertyValue('bottom')),
																		10 < parseInt(n)) &&
																		(t = 14)),
																(g.style.bottom = e + t + 'px'));
													}
													function e() {
														if (
															((m.position = m.position.toLowerCase()),
															(m.speed = Number(m.speed)),
															(m.direction = m.direction.toLowerCase()),
															(0 < M.length || 0 < E.length) && null === g)
														) {
															'rtl' == m.direction && R.dom.addClass(p, 'vjs-rtl'),
																((g = document.createElement('div')).className = 'vjs-news'),
																c(),
																((f = document.createElement('div')).className = 'vjs-news-scroll'),
																((C = document.createElement('div')).className = 'marq'),
																(k = document.createElement('div')),
																(w = document.createElement('div')),
																m.clock
																	? (k.className = w.className = 'marq-group')
																	: (k.className = w.className = 'marq-group marq-group-nt'),
																'rtl' == m.direction &&
																	(m.clock
																		? (R.dom.addClass(k, 'group-rtl'),
																			R.dom.addClass(w, 'group-rtl'))
																		: (R.dom.addClass(k, 'group-nt-rtl'),
																			R.dom.addClass(w, 'group-nt-rtl'))),
																C.appendChild(k),
																C.appendChild(w);
															var t = !1,
																n = !1;
															if (0 < E.length && 1 != m.titleOnly)
																for (var t = !0, s = 0; s < E.length; s++) {
																	var l = document.createElement('div'),
																		o = ((l.className = 'news-item'), E[s].content);
																	E[s].time &&
																		(o = '<span class="ct">' + E[s].time + '</span>' + o),
																		E[s].link &&
																			(o =
																				'<a target="' +
																				m.target +
																				'" href="' +
																				E[s].link +
																				'">' +
																				o +
																				'</a>'),
																		(l.innerHTML = '<span class="break"></span>' + o),
																		k.appendChild(l);
																}
															else {
																k.innerHTML = '';
																for (s = 0; s < M.length; s++) {
																	var a = document.createElement('div'),
																		o = ((a.className = 'news-item'), M[s].content);
																	M[s].time &&
																		(o = '<span class="ct">' + M[s].time + '</span>' + o),
																		M[s].link &&
																			(o =
																				'<a target="' +
																				m.target +
																				'" href="' +
																				M[s].link +
																				'">' +
																				o +
																				'</a>'),
																		(a.innerHTML = '<span class="break"></span>' + o),
																		k.appendChild(a);
																}
															}
															w.innerHTML = k.innerHTML;
															-1 < p.className.indexOf('vjs-controls-none') &&
																(m.position = 'static'),
																m.speed < 1 && (m.speed = 1),
																20 < m.speed && (m.speed = 20),
																'rtl' === m.direction && g.setAttribute('dir', 'rtl'),
																f.appendChild(C);
															var r,
																n = !1;
															'' != m.logo &&
																'top' !== m.position &&
																((n = !0),
																((r = document.createElement('div')).className = 'left-block'),
																((i = document.createElement('div')).className = 'left-logo'),
																m.logourl
																	? ((h = document.createElement('a')).setAttribute(
																			'href',
																			m.logourl
																		),
																		h.setAttribute('nofollow', 'nofollow'),
																		h.setAttribute('target', m.target),
																		((v = document.createElement('img')).src = m.logo),
																		'' != m.logotitle
																			? v.setAttribute('alt', m.logotitle)
																			: v.setAttribute('alt', u.localize('Recent news')),
																		h.appendChild(v),
																		i.appendChild(h))
																	: (((v = document.createElement('img')).src = m.logo),
																		i.appendChild(v)),
																!0 !== m.clock && (r.style.bottom = '25px'),
																r.appendChild(i)),
																m.clock &&
																	(1 != n &&
																		((r = document.createElement('div')).className = 'left-block'),
																	(n = !0),
																	((L = document.createElement('div')).className = 'left-time'),
																	(i = new Date()).getHours(),
																	i.getMinutes(),
																	r.appendChild(L),
																	d()),
																((N = document.createElement('div')).className = 'vjs-news-title'),
																('' != m.logo && 1 == n && 'top' != m.position) ||
																	(N.className = 'vjs-news-title no-logo'),
																(T = document.createElement('p')),
																N.appendChild(T),
																1 != t && R.dom.addClass(N, 'vjs-news-hidden'),
																0 < E.length &&
																	0 == M.length &&
																	R.dom.addClass(N, 'vjs-news-hidden'),
																n &&
																	(f.appendChild(r), 'rtl' == m.direction) &&
																	(f.className = 'vjs-news-scroll scroll-rtl'),
																m.toggleButton &&
																	(((j = document.createElement('div')).className = 'news-toggle'),
																	'rtl' == m.direction && j.classList.add('toggle-rtl'),
																	((y = document.createElement('div')).className =
																		'toggle-icon-down'),
																	j.appendChild(y),
																	g.appendChild(j),
																	(j.onclick = function (e) {
																		e.stopPropagation(),
																			'toggle-icon-down' === y.className
																				? ((y.className = 'toggle-icon-up'),
																					R.dom.addClass(g, 'news-hidden'))
																				: ((y.className = 'toggle-icon-down'),
																					R.dom.removeClass(g, 'news-hidden'));
																	})),
																g.appendChild(N),
																g.appendChild(f),
																p.appendChild(g);
															let e = 150;
															5 < m.speed && (e = 190);
															var i = parseInt(k.offsetWidth / (e * (m.speed / 10)));
															if (
																((k.style.animationDuration = i + 's'),
																(w.style.animationDuration = i + 's'),
																t && k)
															) {
																let t =
																		'<span class="vjs-icon"><svg version="1.1" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"></path><path d="M38 38H10V10h14V6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V24h-4v14zM28 6v4h7.17L15.51 29.66l2.83 2.83L38 12.83V20h4V6H28z"></path></svg></span>',
																	e = M[0].content;
																M[0].link &&
																	(e =
																		'<a target="' +
																		m.target +
																		'" href="' +
																		M[0].link +
																		'">' +
																		t +
																		e +
																		'</a>'),
																	(T.innerHTML = e),
																	1 < M.length &&
																		setTimeout(function e() {
																			(T.style.opacity = 0),
																				setTimeout(function () {
																					H > M.length - 1 && (H = 0);
																					let e = M[H].content;
																					M[H].link &&
																						(e =
																							'<a target="' +
																							m.target +
																							'" href="' +
																							M[H].link +
																							'">' +
																							t +
																							e +
																							'</a>'),
																						(T.innerHTML = e),
																						(T.style.opacity = 1);
																				}, 500),
																				H++,
																				setTimeout(e, 7e3);
																		}, 7e3);
															}
															(N.onclick = N.ontouchend =
																function (e) {
																	e.stopPropagation(),
																		e.preventDefault(),
																		k &&
																			(k.classList.contains('vjs-scroll-paused')
																				? (R.dom.removeClass(k, 'vjs-scroll-paused'),
																					R.dom.removeClass(w, 'vjs-scroll-paused'))
																				: (R.dom.addClass(k, 'vjs-scroll-paused'),
																					R.dom.addClass(w, 'vjs-scroll-paused')));
																}),
																(C.ontouchend = function (e) {
																	k.classList.contains('vjs-scroll-paused')
																		? (R.dom.removeClass(k, 'vjs-scroll-paused'),
																			R.dom.removeClass(w, 'vjs-scroll-paused'))
																		: (R.dom.addClass(k, 'vjs-scroll-paused'),
																			R.dom.addClass(w, 'vjs-scroll-paused'));
																}),
																(C.onmouseenter = function () {
																	R.dom.addClass(k, 'vjs-scroll-paused'),
																		R.dom.addClass(w, 'vjs-scroll-paused');
																}),
																(C.onmouseleave = function () {
																	R.dom.removeClass(k, 'vjs-scroll-paused'),
																		R.dom.removeClass(w, 'vjs-scroll-paused');
																});
														}
													}
													(u.ticker.hide = function () {
														null != g &&
															(g && R.dom.addClass(g, 'vjs-hidden'), C) &&
															R.dom.addClass(C, 'vjs-scroll-paused');
													}),
														(u.ticker.show = function () {
															null != g &&
																(g && R.dom.removeClass(g, 'vjs-hidden'), C) &&
																R.dom.removeClass(C, 'vjs-scroll-paused');
														}),
														(u.ticker.logo = function (e) {
															null != v &&
																(Array.isArray(e)
																	? (e.src && (v.src = e.src),
																		e.title && v.setAttribute(e.title),
																		e.url && null != h && h.setAttribute('href', e.url))
																	: (v.src = e));
														}),
														(u.ticker.update = function (e) {
															e && (m.rss = e), m.rss && S(!0);
														}),
														u.on('playerresize', function () {
															c();
														}),
														u.on('playing', function () {
															R.dom.hasClass(p, 'vjs-ad-playing') ||
															R.dom.hasClass(p, 'vjs-dai') ||
															R.dom.hasClass(p, 'vjs-up-next')
																? null !== g && R.dom.addClass(g, 'news-hidden')
																: 1 != b && (startTime = Date.now());
														}),
														u.on('timeupdate', function () {
															(R.dom.hasClass(p, 'vjs-ad-playing') ||
																R.dom.hasClass(p, 'vjs-dai') ||
																R.dom.hasClass(p, 'vjs-up-next')) &&
																null !== g &&
																R.dom.addClass(g, 'news-hidden'),
																0 < u.currentTime() && !0 !== b && ((b = !0), e());
														}),
														u.on('ended', function () {
															R.dom.hasClass(p, 'vjs-ad-playing') ||
																R.dom.hasClass(p, 'vjs-dai') ||
																R.dom.hasClass(p, 'vjs-up-next') ||
																(null !== g && R.dom.addClass(g, 'news-hidden'));
														});
												})()
										: console.log('Missing RSS content or invalid strutrure');
							}
						}
				} catch (e) {
					console.log('Invalid XML document');
				}
		}
		function o() {
			try {
				var e = new q.XMLHttpRequest();
				return 'withCredentials' in e ? e : null;
			} catch (e) {
				return null;
			}
		}
		function S(e) {
			var t = m.rss + '?' + Date.now();
			let n = new o();
			n.open('GET', t),
				(n.timeout = m.timeout),
				(n.withCredentials = m.withCredentials),
				n.overrideMimeType && n.overrideMimeType('text/xml'),
				(n.onload = e ? () => l(n, !0) : () => l(n, !1)),
				(n.onerror = () => s(n, !1)),
				(n.onabort = () => s(n, !1)),
				(n.ontimeout = () => s(n, !0)),
				n.send();
		}
	});
});
