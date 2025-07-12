/**
 * Copyright (c) 2024 The Nuevodevel Team. All rights reserved.
 * Playlist plugin for video.js
 * Version 1.3.0
 */
/* eslint-disable */
import videojs from 'video.js';
// @ts-ignore
var first_play,
	first_item = !0,
	// @ts-ignore
	validSeconds = function (e) {
		return 'number' === typeof e && !isNaN(e) && e >= 0 && e < 1 / 0;
	},
	// @ts-ignore
	reset = function (e) {
		var t = e.playlist.autoadvance_;
		t.timeout && e.clearTimeout(t.timeout);
		t.trigger && e.off('ended', t.trigger);
		t.timeout = null;
		t.trigger = null;
	},
	// @ts-ignore
	setup = function t(r, n) {
		reset(r);
		if (validSeconds(n)) {
			r.playlist.autoadvance_.delay = n;
			r.playlist.autoadvance_.trigger = function () {
				var e = function () {
					return t(r, n);
				};
				r.one('play', e);
				r.playlist.autoadvance_.timeout = r.setTimeout(() => {
					reset(r);
					r.off('play', e);
					r.playlist.next();
				}, 1e3 * n);
			};
			r.one('ended', r.playlist.autoadvance_.trigger);
		} else r.playlist.autoadvance_.delay = null;
	},
	// @ts-ignore
	playItem = function (t, r) {
		var n = !t.paused() || t.ended();
		r.playlistItemId_ && (t.playlist.currentPlaylistItemId_ = r.playlistItemId_);
		if ('function' === typeof t.beforePlaylistChange) {
			var e = t.beforePlaylistChange(r.playlistItemId_, r);
			e && (r = e);
		}
		t.one('playing', function () {
			first_play = !0;
		});
		// Defensive: only call changeSource if it exists, otherwise fallback to src
		if (typeof t.changeSource === 'function') {
			t.changeSource(r);
		} else if (r && r.sources) {
			t.src(r.sources);
		} else if (r && r.src) {
			t.src(r.src);
		}
		// @ts-ignore
		first_play &&
			setTimeout(function () {
				t.trigger('playlist_change', { id: r.playlistItemId_ });
			}, 500);
		if (t.uniquePlaylist && localStorage) {
			e = String('vjs_playlist-' + t.uniquePlaylist);
			localStorage[e] = r.playlistItemId_;
		}
		// @ts-ignore
		!0 === first_play &&
			setTimeout(() => {
				t.play();
			}, 200);
		t.ready(function () {
			t.trigger('playlistitem', r.originalValue || r);
			t.trigger('playlist_newitem', { id: r.playlistItemId_ });
			first_item = first_item && !1;
			if (n) {
				var e = t.play();
				// @ts-ignore
				'undefined' !== typeof e && 'function' === typeof e.then && e.then(null, function (e) {});
			}
			setup(t, t.playlist.autoadvance_.delay);
		});
		return t;
	},
	// @ts-ignore
	isItemObject = function (e) {
		return !!e && 'object' === typeof e;
	},
	// @ts-ignore
	transformPrimitiveItems = function (e) {
		var t,
			// @ts-ignore
			r = [];
		// @ts-ignore
		e.forEach(function (e) {
			isItemObject(e) ? (t = e) : ((t = Object(e)).originalValue = e);
			r.push(t);
		});
		// @ts-ignore
		return r;
	},
	// @ts-ignore
	generatePlaylistItemId = function (e) {
		var t = 1;
		// @ts-ignore
		e.forEach(function (e) {
			e.playlistItemId_ = t++;
		});
	},
	// @ts-ignore
	indexInPlaylistItemIds = function (e, t) {
		for (var r = 0; r < e.length; r++) if (e[r].playlistItemId_ === t) return r;
		return -1;
	},
	// @ts-ignore
	sourceEquals = function (e, t) {
		var r = e,
			n = t;
		'object' === typeof e && (r = e.src);
		'object' === typeof t && (n = t.src);
		/^\/\//.test(r) && (n = n.slice(n.indexOf('//')));
		return (r = /^\/\//.test(n) ? r.slice(r.indexOf('//')) : r) === n;
	},
	// @ts-ignore
	indexInSources = function (e, t) {
		for (var r = 0; r < e.length; r++) {
			var n = e[r].sources;
			if (Array.isArray(n))
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					if (a && sourceEquals(a, t)) return r;
				}
		}
		return -1;
	};
// @ts-ignore
function factory(n, e, t) {
	void 0 === t && (t = 0);
	if (n.uniquePlaylist) {
		var r = String('vjs_playlist-' + n.uniquePlaylist);
		// @ts-ignore
		localStorage && localStorage.getItem(r) && (t = Number(localStorage.getItem(r) - 1));
	}
	// @ts-ignore
	var i = null,
		a = !1,
		// @ts-ignore
		l = (n.playlist = function (e, t) {
			void 0 === t && (t = 0);
			if (Array.isArray(e)) {
				// @ts-ignore
				var r = Array.isArray(i) ? i.slice() : null,
					// @ts-ignore
					e = e.slice();
				// @ts-ignore
				(i = e.slice()).filter(function (e) {
					return isItemObject(e);
				}).length !== i.length && (i = transformPrimitiveItems(i));
				generatePlaylistItemId(i);
				a = !1;
				// @ts-ignore
				-1 !== t && l.currentItem(t);
				r &&
					n.setTimeout(() => {
						n.trigger('playlistchange');
					}, 0);
			}
			// @ts-ignore
			return (
				i
					// @ts-ignore
					.map(function (e) {
						return e.originalValue || e;
					})
					.slice()
			);
		});
	n.on('loadstart', () => {
		// @ts-ignore
		-1 === l.currentItem() && reset(n);
	});
	// @ts-ignore
	l.currentIndex_ = -1;
	// @ts-ignore
	l.player_ = n;
	// @ts-ignore
	l.autoadvance_ = {};
	// @ts-ignore
	l.repeat_ = !1;
	// @ts-ignore
	l.currentPlaylistItemId_ = null;
	// @ts-ignore
	l.currentItem = function (e) {
		if (!a) {
			// @ts-ignore
			'undefined' === l.currentIndex_ && (l.currentIndex_ = 0);
			// @ts-ignore
			if ('number' === typeof e && l.currentIndex_ !== e && e >= 0 && e < i.length) {
				// @ts-ignore
				l.currentIndex_ = e;
				// @ts-ignore
				playItem(l.player_, i[l.currentIndex_]);
			} else {
				// @ts-ignore
				e = l.player_.currentSrc() || '';
				// @ts-ignore
				if (l.currentPlaylistItemId_) {
					// @ts-ignore
					var t = indexInPlaylistItemIds(i, l.currentPlaylistItemId_),
						// @ts-ignore
						r = i[t];
					if (r && Array.isArray(r.sources) && indexInSources([r], e) > -1)
						// @ts-ignore
						return (l.currentIndex_ = t), l.currentIndex_;
					// @ts-ignore
					l.currentPlaylistItemId_ = null;
				}
				// @ts-ignore
				l.currentIndex_ = l.indexOf(e);
			}
		}
		// @ts-ignore
		return l.currentIndex_;
	};
	// @ts-ignore
	l.contains = function (e) {
		// @ts-ignore
		return -1 !== l.indexOf(e);
	};
	// @ts-ignore
	l.indexOf = function (e) {
		// @ts-ignore
		if ('string' === typeof e) return indexInSources(i, e);
		for (var t = Array.isArray(e) ? e : e.sources, r = 0; r < t.length; r++) {
			var n = t[r];
			// @ts-ignore
			if ('string' === typeof n) return indexInSources(i, n);
			// @ts-ignore
			if (n.src) return indexInSources(i, n.src);
		}
		return -1;
	};
	// @ts-ignore
	l.remove = function (e) {
		if ('number' === typeof e && e < i.length) {
			n.removeFromPlaylist(e);
			// @ts-ignore
			i.splice(e, 1);
		}
	};
	// @ts-ignore
	l.insert = function (e) {
		if ('undefined' !== typeof e.src || 'undefined' !== typeof e.sources) {
			i.push(e);
			n.addToPlaylist(e);
		}
	};
	// @ts-ignore
	l.insertAfter = function (e, t) {
		if ((e.src, 'number' === typeof t) && t <= i.length && t > -1) {
			n.addToPlaylist(e, 'after', t);
			// @ts-ignore
			i.splice(t + 1, 0, e);
		}
	};
	// @ts-ignore
	l.insertBefore = function (e, t) {
		if ((e.src, 'number' === typeof t) && t < i.length && t > -1) {
			n.addToPlaylist(e, 'before', t);
			// @ts-ignore
			i.splice(t, 0, e);
		}
	};
	// @ts-ignore
	l.currentIndex = function () {
		// @ts-ignore
		return l.currentItem();
	};
	// @ts-ignore
	l.lastIndex = function () {
		return i.length - 1;
	};
	// @ts-ignore
	l.nextIndex = function () {
		var e,
			// @ts-ignore
			t = l.currentItem();
		// @ts-ignore
		return -1 === t ? -1 : ((e = l.lastIndex()), l.repeat_ && t === e ? 0 : Math.min(t + 1, e));
	};
	// @ts-ignore
	l.previousIndex = function () {
		// @ts-ignore
		var e = l.currentItem();
		// @ts-ignore
		return -1 === e ? -1 : l.repeat_ && 0 === e ? l.lastIndex() : Math.max(e - 1, 0);
	};
	// @ts-ignore
	l.first = function () {
		if (!a) {
			// @ts-ignore
			var e = l.currentItem(0);
			// @ts-ignore
			if (i.length) return i[e].originalValue || i[e];
			// @ts-ignore
			l.currentIndex_ = -1;
		}
	};
	// @ts-ignore
	l.last = function () {
		if (!a) {
			// @ts-ignore
			var e = l.currentItem(l.lastIndex());
			// @ts-ignore
			if (i.length) return i[e].originalValue || i[e];
			// @ts-ignore
			l.currentIndex_ = -1;
		}
	};
	// @ts-ignore
	l.next = function (e) {
		var t;
		// @ts-ignore
		return !a && (t = l.nextIndex()) !== l.currentIndex_
			? // @ts-ignore
				((t = l.currentItem(t)), i[t].originalValue || i[t])
			: void 0;
	};
	// @ts-ignore
	l.new = function (e) {
		i = e;
		n.newPlaylist(i);
	};
	// @ts-ignore
	l.previous = function () {
		var e;
		// @ts-ignore
		return !a && (e = l.previousIndex()) !== l.currentIndex_
			? // @ts-ignore
				((e = l.currentItem(e)), i[e].originalValue || i[e])
			: void 0;
	};
	// @ts-ignore
	l.autoadvance = function (e) {
		// @ts-ignore
		setup(l.player_, e);
	};
	// @ts-ignore
	l.repeat = function (e) {
		// @ts-ignore
		if (void 0 === e) return l.repeat_;
		// @ts-ignore
		if ('boolean' === typeof e) return (l.repeat_ = !!e), l.repeat_;
	};
	// @ts-ignore
	l.list = function () {
		// @ts-ignore
		return i;
	};
	// @ts-ignore
	l.sort = function (e) {
		// @ts-ignore
		i.length && i.sort(e);
	};
	Array.isArray(e) ? l(e.slice(), t) : (i = []);
	return l;
}
var registerPlugin = videojs.registerPlugin || videojs.plugin,
	// @ts-ignore
	plugin = function (e, t) {
		// @ts-ignore
		this.ready(function () {
			// @ts-ignore
			this.playlist = factory(this, e, t);
			// @ts-ignore
			this.playlist.autoadvance(0);
			// @ts-ignore
			this.trigger('playlistready');
		});
	};
registerPlugin('playlist', plugin);
export default plugin;
