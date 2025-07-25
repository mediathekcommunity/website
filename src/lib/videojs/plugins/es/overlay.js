/**
 * Overlay plugin for video.js
 * Version 1.0.0
 */
!(function (e) {
	var t;
	'undefined' != typeof window && window.videojs
		? e(window.videojs)
		: 'function' == typeof define && define.amd
			? define('vroll', ['video.js'], function (t) {
					return e(t.default || t);
				})
			: 'undefined' != typeof module &&
				module.exports &&
				((t = require('video.js')), (module.exports = e(t.default || t)));
})(function (t) {
	function u(t) {
		return '[object Array]' === Object.prototype.toString.call(t);
	}
	((t = t && t.hasOwnProperty('default') ? t.default : t).registerPlugin || t.plugin)(
		'overlay',
		function (f, t) {
			this.ready(function () {
				{
					var p = this,
						n = f,
						i;
					let e = 26,
						d = !1;
					u(n) || (!(i = n).txt && !i.img) || ((n = [])[0] = i),
						0 < n.length &&
							(((i = document.createElement('style')).innerHTML =
								'.vjs-ad-playing .vjs-ov{display:none}.vjs-ov{transition:all .8s ease-out;position:absolute;font-size:16px;font-family:sans-serif;display:table;color:white;line-height:1.3em;opacity:0;text-align:center;max-width:90%;padding:2px 5px;background:black;}.vjs-ov-img{background:transparent;padding:0}.vjs-ov img{border:2px solid transparent;width:100%;height:auto}.vjs-ov-vid {border:solid 2px transparent;left:auto;right:0;top:0;padding:0;margin:0;max-width:50%}.vjs-ov-vid video{width:100%;display:block;outline:0}.vjs-ov-tp{top:0}.vjs-ov-bt{bottom:65px;top:auto;}.vjs-ov-txt{z-index:2}.vjs-ov-lcnt{transform:translateY(-50%);top:50%;left:0}.vjs-ov-rcnt{transform:translateY(-50%);top:50%;right:0}.vjs-ov-center-edge{left:0;right:0;margin:auto}.vjs-ov-center{transform:translate(-50%, -50%);left:50%;top:50%}.vjs-bottom-center{bottom:65px;transform:translateX(-50%);left:50%;top:auto}.ov-close{position:absolute;width:24px;height:24px;line-height:24px;border-radius:50%;background:#000;color:#fff;text-align:center;font-size:24px;right:-5px;top:-5px;box-shadow:0 0 2px 2px #ccc;cursor: pointer}.ov-close:hover{box-shadow:0 0 4px 2px #fff;}.vjs-ov .resw{width:100%;height:auto}.vjs-ov .resh{width:auto;height:100%}.vjs-top-center{transform:translateX(-50%);left:50%;top:0}.ov-blocker{width:100%;height:100%;position:absolute;top:0;left:0;background:transparent;cursor:pointer}.svg-white{fill:#fff;filter:drop-shadow(1px 1px 1px #000)}.mute-overlay{position:absolute!important;right:10px;bottom:10px;background:transparent}'),
							p.el_.appendChild(i));
					for (let t = 0; t < n.length; t++) n[t].start = parseInt(n[t].start);
					function l(t, e) {
						return t.start - e.start;
					}
					function c(t) {
						return !!/^(\d+|(\.\d+))(\.\d+)?%$/.test(t);
					}
					function a() {
						return !!p.el_.classList.contains('vjs-ad-playing');
					}
					function s() {
						a() || p.isOffline
							? clearTimeout(t)
							: ((p.liveTime = p.liveTime + 0.5), (t = setTimeout(s, 500)));
					}
					n = n.sort(l);
					let t,
						o = !1;
					(p.liveTime = 0),
						p.on('pause', function () {
							clearTimeout(t), (o = !1);
						}),
						p.on('playing', function () {
							!0 !== o && ((o = !0), (t = setTimeout(s, 250)));
						}),
						p.on('playlist_change', function () {
							p.liveTime = 0;
						}),
						p.on('sourceChanged', function () {
							p.liveTime = 0;
						}),
						p.on('timeupdate', function () {
							var e = p.liveTime;
							if (!a())
								for (let t = 0; t < n.length; t++) {
									var o = n[t];
									if ((o.start || (o.start = 0), o.duration))
										if (parseInt(o.start + o.duration) <= e && o.used) {
											let e = p.el_.querySelector('#' + o.id);
											e &&
												((e.style.opacity = 0),
												setTimeout(function () {
													try {
														var t = e.getAttribute('data-type');
														('img' != t && 'video' != t) || (d = !1),
															'video' == t && p.muted(!1),
															e.parentNode.removeChild(e);
													} catch (t) {}
												}, 1e3));
										}
									if (!0 !== o.used && o.start <= e) {
										r(o);
										break;
									}
								}
						});
					const r = function (l) {
						let a = document.createElement('div');
						if (
							(l.id ? (a.id = l.id) : (e++, (a.id = 'ov' + e)),
							(l.id = a.id),
							(a.className = 'vjs-ov'),
							l.txt)
						) {
							if (!p.options_.multiOverlay) {
								let e = p.el_.querySelectorAll('.vjs-ov');
								if (e)
									for (let t = 0; t < e.length; t++) {
										var o = e[t].getAttribute('data-type'),
											i = e[t].getAttribute('data-pos');
										'text' == o &&
											i == l.position &&
											l.txt &&
											((e[t].style.opacity = 0),
											setTimeout(function () {
												try {
													e[t].parentNode.removeChild(e[t]);
												} catch (t) {}
											}, 1e3));
									}
							}
							(l.used = !0),
								(a.innerHTML = l.txt),
								a.setAttribute('data-type', 'text'),
								l.position || (l.position = 'top-left'),
								a.setAttribute('data-pos', l.position),
								l.color && (a.style.color = l.color),
								l.background && (a.style.background = l.background),
								l.fontSize && (a.style.fontSize = l.fontSize + 'px'),
								l.fontFamily && (a.style.fontFamily = l.fontFamily),
								l.fontWeight && 'bold' == l.fontWeight && (a.style.fontWeight = 'bold'),
								l.fontStyle && (a.style.fontStyle = l.fontStyle);
						} else if (l.video) {
							let e = !1;
							var s = p.el_.querySelectorAll('.vjs-ov');
							if (s)
								for (let t = 0; t < s.length; t++) {
									var n = s[t].getAttribute('data-type');
									if ('img' == n || 'video' == n) {
										e = !0;
										break;
									}
								}
							if (e || d) return;
							(l.used = !0),
								(d = !0),
								(l.type = 'video'),
								a.setAttribute('data-type', 'video'),
								l.width || (l.width = 420);
							let o = document.createElement('video');
							(o.src = l.video),
								(o.preload = !0),
								(o.controls = !1),
								(o.muted = !0),
								o.setAttribute('playsinline', 'playsinline'),
								setTimeout(function () {
									o.play();
								}, 100),
								(l.start = p.liveTime),
								a.appendChild(o),
								l.url &&
									((o.style.cursor = 'pointer'),
									(a.onclick = function (t) {
										t.preventDefault(),
											t.stopImmediatePropagation(),
											o.pause(),
											window.open(l.url, '_blank');
									})),
								o.addEventListener('ended', function () {
									a.parentNode.removeChild(a), (d = !1), p.muted(!1);
								});
							var t = document.createElement('button');
							t.className = 'vjs-mute-control vjs-control vjs-button mute-overlay vjs-vol-3';
							let i = document.createElement('span');
							(i.className = 'vjs-svg-icon svg-white'),
								(i.innerHTML = '<svg viewBox="0 0 32 32"><use href="#vjs-icon-mute"></use></svg>'),
								t.appendChild(i),
								a.appendChild(t),
								l.border && (a.style.borderColor = l.border),
								(t.onclick = function (t) {
									t.preventDefault(),
										t.stopImmediatePropagation(),
										o.muted
											? (p.muted(!0),
												(o.muted = !1),
												(i.innerHTML =
													'<svg viewBox="0 0 32 32"><use href="#vjs-icon-volume3"></use></svg>'))
											: (p.muted(!1),
												(o.muted = !0),
												(i.innerHTML =
													'<svg viewBox="0 0 32 32"><use href="#vjs-icon-mute"></use></svg>'));
								}),
								l.close &&
									(((t = document.createElement('div')).className = 'ov-close'),
									(t.style.right = '10px'),
									(t.style.top = '10px'),
									(t.innerHTML = '&times;'),
									a.appendChild(t),
									(t.onclick = t.ontouchend =
										function (t) {
											t.stopPropagation(), a.parentNode.removeChild(a), (d = !1), p.muted(!1);
										})),
								l.width || (l.width = 420);
						} else if (l.img) {
							let e = !1;
							var r = p.el_.querySelectorAll('.vjs-ov');
							if (r)
								for (let t = 0; t < r.length; t++) {
									var f = r[t].getAttribute('data-type');
									if ('img' == f || 'video' == f) {
										e = !0;
										break;
									}
								}
							if (e || d) return;
							d = !0;
							let i = new Image(),
								s = void (i.src = l.img),
								n;
							(i.onerror = function () {
								(l.used = !0), (d = !1);
							}),
								(i.onload = function (t) {
									var e, o;
									(s = i.width),
										(n = i.height),
										0 < s &&
											0 < n &&
											((a.style.display = 'block'),
											s >= n
												? (a.style.width = s + 'px')
												: ((a.style.height = n + 'px'), (a.style.maxHeight = '80%')),
											a.setAttribute('data-type', 'img'),
											(l.used = !0),
											(l.start = p.liveTime),
											(l.type = 'img'),
											((e = document.createElement('img')).src = l.img),
											a.appendChild(e),
											(a.style.background = 'transparent'),
											l.close &&
												(((o = document.createElement('div')).className = 'ov-close'),
												(o.innerHTML = '&times;'),
												a.appendChild(o),
												(o.onclick = o.ontouchend =
													function (t) {
														t.stopPropagation(), a.parentNode.removeChild(a), (d = !1);
													})),
											l.border && (e.style.borderColor = l.border),
											s >= n ? (e.className = 'resw') : (e.className = 'resh'),
											l.url) &&
											((e.style.pointerEvents = 'auto'),
											(e.style.cursor = 'pointer'),
											(e.onclick = e.ontouchend =
												function (t) {
													t.stopPropagation(), p.pause(), window.open(l.url, '_blank');
												}));
								});
						}
						if (
							(l.maxWidth &&
								((l.width = '100%'),
								c(l.maxWidth)
									? (a.style.maxWidth = l.maxWidth)
									: (a.style.maxWidth = l.maxWidth + 'px')),
							l.maxHeight &&
								((l.height = '100%'),
								c(l.maxHeight)
									? (a.style.maxHeight = l.maxHeight)
									: (a.style.maxHeight = l.maxHeight + 'px')),
							l.position || (l.position = 'top-left'),
							'top-left' === l.position)
						) {
							a.classList.add('vjs-ov-tp');
							let t = '0',
								e =
									(l.offsetX && (t = c(l.offsetX) ? l.offsetX : parseInt(l.offsetX) + 'px'),
									l.offsetY &&
										(c(l.offsetY)
											? (a.style.top = l.offsetY)
											: (a.style.top = parseInt(l.offsetY) + 'px')),
									!0);
							l.slide && (e = l.slide),
								p.el_.appendChild(a),
								e
									? ((a.style.left = '-100%'),
										setTimeout(function () {
											(a.style.left = t), (a.style.opacity = 1);
										}, 100))
									: setTimeout(function () {
											a.style.opacity = 1;
										}, 100);
						} else if ('top-right' === l.position) {
							a.classList.add('vjs-ov-tp');
							let t = '0',
								e =
									(l.offsetX && (t = c(l.offsetX) ? offsetX : parseInt(l.offsetX) + 'px'),
									l.offsetY &&
										(c(l.offsetY)
											? (a.style.top = l.offsetY)
											: (a.style.top = parseInt(l.offsetY) + 'px')),
									!0);
							(e = l.slide ? l.slide : e)
								? ((a.style.right = '-100%'),
									setTimeout(function () {
										(a.style.right = t), (a.style.opacity = 1);
									}, 100))
								: setTimeout(function () {
										a.style.opacity = 1;
									}, 100);
						} else if ('center-left' === l.position)
							a.classList.add('vjs-ov-lcnt'),
								l.offsetX
									? ((a.style.left = '-100%'),
										setTimeout(function () {
											c(l.offsetX) && (a.style.left = offsetX),
												(a.style.left = parseInt(l.offsetX) + 'px'),
												(a.style.opacity = 1);
										}, 100))
									: setTimeout(function () {
											(a.style.left = 0), (a.style.opacity = 1);
										}, 100);
						else if ('center-right' === l.position)
							a.classList.add('vjs-ov-rcnt'),
								l.offsetX
									? ((a.style.right = '-100%'),
										setTimeout(function () {
											c(l.offsetX) && (a.style.right = offsetX),
												(a.style.right = parseInt(l.offsetX) + 'px'),
												(a.style.opacity = 1);
										}, 100))
									: setTimeout(function () {
											a.style.opacity = 1;
										}, 100);
						else if ('top-center' === l.position) {
							a.classList.add('vjs-top-center');
							let t = '0',
								e =
									(l.offsetY && (c(l.offsetY) && (t = l.offsetY), (t = parseInt(l.offsetY) + 'px')),
									!0);
							(e = l.slide ? l.slide : e)
								? ((a.style.top = '-100%'),
									setTimeout(function () {
										(a.style.top = t), (a.style.opacity = 1);
									}, 100))
								: setTimeout(function () {
										a.style.opacity = 1;
									}, 100);
						} else if ('bottom-left' === l.position) {
							a.classList.add('vjs-ov-bt');
							let t = '0',
								e =
									(l.offsetX && (t = c(l.offsetX) ? l.offsetX : parseInt(l.offsetX) + 'px'),
									l.offsetY &&
										(c(l.offsetY)
											? (a.style.bottom = offsetY)
											: (a.style.bottom = parseInt(l.offsetY) + 'px')),
									!0);
							(e = l.slide ? l.slide : e)
								? ((a.style.left = '-100%'),
									setTimeout(function () {
										(a.style.left = t), (a.style.opacity = 1);
									}, 100))
								: setTimeout(function () {
										a.style.opacity = 1;
									}, 100);
						} else if ('bottom-center' === l.position) {
							a.classList.add('vjs-bottom-center');
							let t = '65px',
								e = (l.offsetY && (t = parseInt(l.offsetY) + 'px'), !0);
							(e = l.slide ? l.slide : e)
								? ((a.style.bottom = '-100%'),
									setTimeout(function () {
										(a.style.bottom = t), (a.style.opacity = 1);
									}, 100))
								: setTimeout(function () {
										a.style.opacity = 1;
									}, 100);
						} else if ('bottom-right' === l.position) {
							a.classList.add('vjs-ov-bt');
							let t = '0',
								e =
									(l.offsetX && (t = c(l.offsetX) ? l.offsetX : parseInt(l.offsetX) + 'px'),
									'65px'),
								o = (l.offsetY && (e = parseInt(l.offsetY) + 'px'), !0);
							(o = l.slide ? l.slide : o)
								? ((a.style.right = '-100%'),
									setTimeout(function () {
										(a.style.bottom = e), (a.style.right = t), (a.style.opacity = 1);
									}, 100))
								: setTimeout(function () {
										a.style.opacity = 1;
									}, 100);
						} else
							'center' === l.position &&
								(a.classList.add('vjs-ov-center'),
								setTimeout(function () {
									a.style.opacity = 1;
								}, 100));
						l.txt && a.classList.add('vjs-ov-txt'),
							l.video && a.classList.add('vjs-ov-vid'),
							p.el_.appendChild(a);
					};
					p.overlay.new = function (t) {
						if (!a()) {
							let e = [];
							u(t) ? (e = t) : (t.txt || t.img || t.video) && (e[0] = t);
							var o = p.el_.querySelectorAll('.vjs-ov');
							if (o)
								for (let t = 0; t < o.length; t++) {
									var i = o[t].getAttribute('data-type'),
										s = o[t].getAttribute('data-pos');
									('img' != i && 'video' != i) || (o[t].parentNode.removeChild(o[t]), (d = !1)),
										'text' == i &&
											e[0].txt &&
											!p.options_.multiOverlay &&
											(e[0].position || (e[0].position = 'top-left'), s == e[0].position) &&
											((o[t].style.opacity = 0), setTimeout(function () {}, 800));
								}
							for (let t = 0; t < e.length; t++) (e[t].start = parseInt(p.liveTime)), n.push(e[t]);
							(n = n.sort(l)), r(e[0]);
						}
					};
				}
			});
		}
	);
});
