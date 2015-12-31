(function(l) {
    "object" === typeof exports && "undefined" !== typeof module ? module.exports = l() : "function" === typeof define && define.amd ? define([], l) : ("undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : this).SmartBanner = l()
})(function() {
    return function d(g, f, e) {
        function b(c, m) {
            if (!f[c]) {
                if (!g[c]) {
                    var k = "function" == typeof require && require;
                    if (!m && k) return k(c, !0);
                    if (a) return a(c, !0);
                    k = Error("Cannot find module '" + c + "'");
                    throw k.code = "MODULE_NOT_FOUND", k;
                }
                k = f[c] = {
                    exports: {}
                };
                g[c][0].call(k.exports, function(a) {
                    var e = g[c][1][a];
                    return b(e ? e : a)
                }, k, k.exports, d, g, f, e)
            }
            return f[c].exports
        }
        for (var a = "function" == typeof require && require, c = 0; c < e.length; c++) b(e[c]);
        return b
    }({
        1: [function(d, g, f) {
            var e = d("xtend/mutable"),
                b = d("component-query"),
                a = d("get-doc"),
                c = a && a.documentElement,
                h = d("cookie-cutter"),
                m = {
                    ios: {
                        appMeta: "apple-itunes-app",
                        iconRels: ["apple-touch-icon-precomposed", "apple-touch-icon"],
                        getStoreLink: function() {
                            return "https://itunes.apple.com/" + this.options.appStoreLanguage +
                                "/app/id" + this.appId
                        }
                    },
                    android: {
                        appMeta: "google-play-app",
                        iconRels: ["android-touch-icon", "apple-touch-icon-precomposed", "apple-touch-icon"],
                        getStoreLink: function() {
                            return "http://play.google.com/store/apps/details?id=" + this.appId
                        }
                    },
                    windows: {
                        appMeta: "msApplication-ID",
                        iconRels: ["windows-touch-icon", "apple-touch-icon-precomposed", "apple-touch-icon"],
                        getStoreLink: function() {
                            return "http://www.windowsphone.com/s?appid=" + this.appId
                        }
                    }
                };
            d = function(b) {
                var a = navigator.userAgent;
                this.options = e({}, {
                    daysHidden: 15,
                    daysReminder: 90,
                    appStoreLanguage: "us",
                    button: "OPEN",
                    store: {
                        ios: "On the App Store",
                        android: "In Google Play",
                        windows: "In the Windows Store"
                    },
                    price: {
                        ios: "FREE",
                        android: "FREE",
                        windows: "FREE"
                    },
                    force: !1
                }, b || {});
                this.options.force ? this.type = this.options.force : null != a.match(/Windows Phone/i) && null !== a.match(/Touch/i) ? this.type = "windows" : null !== a.match(/iPad|iPhone|iPod/i) ? null !== a.match(/Safari/i) && (null !== a.match(/CriOS/i) || 6 > Number(a.substr(a.indexOf("OS ") + 3, 3).replace("_", "."))) && (this.type = "ios") : null !==
                a.match(/Android/i) && (this.type = "android");
                !this.type || navigator.standalone || h.get("smartbanner-closed") || h.get("smartbanner-installed") || (e(this, m[this.type]), this.parseAppId() && (this.create(), this.show()))
            };
            d.prototype = {
                constructor: d,
                create: function() {
                    for (var c = this.getStoreLink(), e = this.options.price[this.type] + " - " + this.options.store[this.type], d, f = 0; f < this.iconRels.length; f++) {
                        var g = b('link[rel="' + this.iconRels[f] + '"]');
                        if (g) {
                            d = g.getAttribute("href");
                            break
                        }
                    }
                    var h = a.createElement("div");
                    h.className =
                        "smartbanner smartbanner-" + this.type;
                    h.innerHTML = '<div class="smartbanner-container"><a href="javascript:void(0);" class="smartbanner-close">&times;</a><span class="smartbanner-icon" style="background-image: url(' + d + ')"></span><div class="smartbanner-info"><div class="smartbanner-title">' + this.options.title + "</div><div>" + this.options.author + "</div><span>" + e + '</span></div><a href="' + c + '" class="smartbanner-button"><span class="smartbanner-button-text">' + this.options.button + "</span></a></div>";
                    a.body ?
                        a.body.appendChild(h) : a && a.addEventListener("DOMContentLoaded", function() {
                        a.body.appendChild(h)
                    });
                    b(".smartbanner-button", h).addEventListener("click", this.install.bind(this), !1);
                    b(".smartbanner-close", h).addEventListener("click", this.close.bind(this), !1)
                },
                hide: function() {
                    c.classList.remove("smartbanner-show")
                },
                show: function() {
                    c.classList.add("smartbanner-show")
                },
                close: function() {
                    this.hide();
                    h.set("smartbanner-closed", "true", {
                        path: "/",
                        expires: +new Date + 864E5 * this.options.daysHidden
                    })
                },
                install: function() {
                    this.hide();
                    h.set("smartbanner-installed", "true", {
                        path: "/",
                        expires: +new Date + 864E5 * this.options.daysReminder
                    })
                },
                parseAppId: function() {
                    var a = b('meta[name="' + this.appMeta + '"]');
                    if (a) return this.appId = "windows" === this.type ? a.getAttribute("content") : /app-id=([^\s,]+)/.exec(a.getAttribute("content"))[1]
                }
            };
            g.exports = d
        }, {
            "component-query": 2,
            "cookie-cutter": 3,
            "get-doc": 4,
            "xtend/mutable": 6
        }],
        2: [function(d, g, f) {
            function e(b, a) {
                return a.querySelector(b)
            }
            f = g.exports = function(b, a) {
                a = a || document;
                return e(b, a)
            };
            f.all = function(b,
                             a) {
                a = a || document;
                return a.querySelectorAll(b)
            };
            f.engine = function(b) {
                if (!b.one) throw Error(".one callback required");
                if (!b.all) throw Error(".all callback required");
                e = b.one;
                f.all = b.all;
                return f
            }
        }, {}],
        3: [function(d, g, f) {
            f = g.exports = function(e) {
                e || (e = {});
                "string" === typeof e && (e = {
                    cookie: e
                });
                void 0 === e.cookie && (e.cookie = "");
                return {
                    get: function(b) {
                        for (var a = e.cookie.split(/;\s*/), c = 0; c < a.length; c++) {
                            var d = a[c].split("=");
                            if (unescape(d[0]) === b) return unescape(d[1])
                        }
                    },
                    set: function(b, a, c) {
                        c || (c = {});
                        b = escape(b) +
                            "=" + escape(a);
                        c.expires && (b += "; expires=" + c.expires);
                        c.path && (b += "; path=" + escape(c.path));
                        return e.cookie = b
                    }
                }
            };
            "undefined" !== typeof document && (d = f(document), f.get = d.get, f.set = d.set)
        }, {}],
        4: [function(d, g, f) {
            d = d("has-dom");
            g.exports = d() ? document : null
        }, {
            "has-dom": 5
        }],
        5: [function(d, g, f) {
            g.exports = function() {
                return "undefined" !== typeof window && "undefined" !== typeof document && "function" === typeof document.createElement
            }
        }, {}],
        6: [function(d, g, f) {
            g.exports = function(d) {
                for (var b = 1; b < arguments.length; b++) {
                    var a =
                            arguments[b],
                        c;
                    for (c in a) a.hasOwnProperty(c) && (d[c] = a[c])
                }
                return d
            }
        }, {}]
    }, {}, [1])(1)
});