(() => {
    var path = require('path');
    var t = {
            155: t => {
                var e, n, r = t.exports = {};

                function o() {
                    throw new Error("setTimeout has not been defined")
                }

                function i() {
                    throw new Error("clearTimeout has not been defined")
                }

                function s(t) {
                    if (e === setTimeout) return setTimeout(t, 0);
                    if ((e === o || !e) && setTimeout) return e = setTimeout, setTimeout(t, 0);
                    try {
                        return e(t, 0)
                    } catch (n) {
                        try {
                            return e.call(null, t, 0)
                        } catch (n) {
                            return e.call(this, t, 0)
                        }
                    }
                }! function() {
                    try {
                        e = "function" == typeof setTimeout ? setTimeout : o
                    } catch (t) {
                        e = o
                    }
                    try {
                        n = "function" == typeof clearTimeout ? clearTimeout : i
                    } catch (t) {
                        n = i
                    }
                }();
                var c, u = [],
                    l = !1,
                    a = -1;

                function f() {
                    l && c && (l = !1, c.length ? u = c.concat(u) : a = -1, u.length && h())
                }

                function h() {
                    if (!l) {
                        var t = s(f);
                        l = !0;
                        for (var e = u.length; e;) {
                            for (c = u, u = []; ++a < e;) c && c[a].run();
                            a = -1, e = u.length
                        }
                        c = null, l = !1,
                            function(t) {
                                if (n === clearTimeout) return clearTimeout(t);
                                if ((n === i || !n) && clearTimeout) return n = clearTimeout, clearTimeout(t);
                                try {
                                    return n(t)
                                } catch (e) {
                                    try {
                                        return n.call(null, t)
                                    } catch (e) {
                                        return n.call(this, t)
                                    }
                                }
                            }(t)
                    }
                }

                function d(t, e) {
                    this.fun = t, this.array = e
                }

                function w() {}
                r.nextTick = function(t) {
                    var e = new Array(arguments.length - 1);
                    if (arguments.length > 1)
                        for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                    u.push(new d(t, e)), 1 !== u.length || l || s(h)
                }, d.prototype.run = function() {
                    this.fun.apply(null, this.array)
                }, r.title = "browser", r.browser = !0, r.env = {}, r.argv = [], r.version = "", r.versions = {}, r.on = w, r.addListener = w, r.once = w, r.off = w, r.removeListener = w, r.removeAllListeners = w, r.emit = w, r.prependListener = w, r.prependOnceListener = w, r.listeners = function(t) {
                    return []
                }, r.binding = function(t) {
                    throw new Error("process.binding is not supported")
                }, r.cwd = function() {
                    return "/"
                }, r.chdir = function(t) {
                    throw new Error("process.chdir is not supported")
                }, r.umask = function() {
                    return 0
                }
            },
            298: t => {
                "use strict";
                t.exports = require("electron")
            },
            997: t => {
                "use strict";
                t.exports = path
            }
        },
        e = {};

    function n(r) {
        var o = e[r];
        if (void 0 !== o) return o.exports;
        var i = e[r] = {
            exports: {}
        };
        return t[r](i, i.exports, n), i.exports
    }(() => {
        var t = n(155);
        const {
            app: e,
            BrowserWindow: r,
            ipcMain: o
        } = n(298);
        n(997);
        class i {
            constructor(t, e, n, r, o) {
                this.lang = t, this.time = e, this.exam = n, this.ex_font = r, this.file_path = o
            }
        }
        let s;

        function c() {
            s = new r({
                width: 1800,
                height: 1800,
                webPreferences: {
                    nodeIntegration: !0,
                    contextIsolation: !1
                }
            }), s.loadFile("index.html"), s.webContents.openDevTools(), o.on("selection-renderer", ((t, e, n, o, s, c) => {
                let u = new i(e, n, o, s, c);
                testWindow = new r({
                    width: 1800,
                    height: 1800,
                    webPreferences: {
                        nodeIntegration: !0,
                        contextIsolation: !1
                    }
                }), testWindow.loadFile("testscr.html"), testWindow.webContents.on("did-finish-load", (() => {
                    testWindow.webContents.send("load-page", u)
                }))
            })), s.on("closed", (function() {
                s = null
            }))
        }
        e.on("ready", c), e.on("window-all-closed", (function() {
            "darwin" !== t.platform && e.quit()
        })), e.on("activate", (function() {
            null === s && c()
        })), o.on("test_result", ((t, e, n, r, o) => {
            console.log("answer: ", e, "\n Wrong: ", n, "\nWrong Count: ", r, "\nright count: ", o)
        }))
    })()
})();