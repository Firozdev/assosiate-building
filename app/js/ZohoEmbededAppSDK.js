var ZOHO = function() {
    var b, g = {};
    return {
        embeddedApp: {
            on: function(d, b) { g[d] = b },
            init: function() {
                b = new ZSDK;
                var d, k = new Promise(function(b, c) { d = b });
                b.OnLoad(function() { d() });
                for (var c in g) b.getContext().Event.Listen(c, g[c]);
                return k
            }
        },
        CRM: function() {
            function d(a) { a.sdkVersion = "1"; return b.getContext().Event.Trigger("CRM_EVENT", a, !0) }

            function k(a, e, b, c) {
                a = { category: "CREATE", Entity: a, RelatedID: b, APIData: e };
                a.type = c || "RECORD";
                return d(a)
            }

            function c(a, e, b) {
                var c = void 0;
                if ("CONNECTOR" != b) {
                    b = e.url;
                    var f = e.params,
                        c = e.headers,
                        k = e.body,
                        h = e.PARTS,
                        t = e.CONTENT_TYPE;
                    e = e.FILE;
                    if (!b) throw { Message: "Url missing" };
                    if (f) {
                        var p, g = [];
                        for (p in f) g.push(encodeURIComponent(p) + "\x3d" + encodeURIComponent(f[p]));
                        p = g.join("\x26");
                        b += (-1 < b.indexOf("?") ? "\x26" : "?") + p
                    }
                    c = { url: b, Header: c, Body: k, CONTENT_TYPE: t, PARTS: h, FILE: e }
                } else c = e;
                return d({ category: "CONNECTOR", nameSpace: a, data: c })
            }

            function f(a) { $.extend(a, { category: "UI" }); return d(a) }

            function h(a, e) { return d({ category: "CONFIG", type: a, nameSpace: e }) }

            function g(a) {
                var e = { category: "USER" };
                a.ID ? e.ID = a.ID : a.Type && (e.Type = a.Type, a.page && (e.page = a.page), a.per_page && (e.per_page = a.per_page));
                return d(e)
            }

            function l(a) { return d({ category: "META", type: a.type, Entity: a.Entity, Id: a.Id }) }
            return {
                ACTION: { setConfig: function(a) { return d({ category: "ACTION", type: "CUSTOM_ACTION_SAVE_CONFIG", object: a }) }, enableAccountAccess: function(a) { return d({ category: "ACTION", type: "ENABLE_ACCOUNT_ACCESS", object: a }) } },
                FUNCTIONS: {
                    execute: function(a, e) {
                        var b = {};
                        e.auth_type = "oauth";
                        b.data = e;
                        return d({
                            category: "FUNCTIONS_EXECUTE",
                            customFunctionName: a,
                            data: b
                        })
                    }
                },
                CONFIG: { getOrgInfo: function(a) { return h("ORG") }, getCurrentUser: function() { return h("CURRENT_USER") } },
                META: {
                    getFields: function(a) { a.type = "FIELD_LIST"; return l(a) },
                    getModules: function() { return l({ type: "MODULE_LIST" }) },
                    getAssignmentRules: function(a) { a.type = "ASSIGNMENT_RULES"; return l(a) },
                    getLayouts: function(a) {
                        a.id = a.id ? a.id : a.LayoutId;
                        a.type = a.Id ? "LAYOUT" : "LAYOUTS";
                        return l(a)
                    },
                    getRelatedList: function(a) { a.type = "RELATED_LIST"; return l(a) },
                    getCustomViews: function(a) {
                        a.type =
                            a.Id ? "CUSTOM_VIEW" : "CUSTOM_VIEWS";
                        return l(a)
                    }
                },
                API: {
                    addNotes: function(a) { return k(a.Entity, { data: [{ Note_Title: a.Title, Note_Content: a.Content }] }, a.RecordID, "NOTES") },
                    addNotesAttachment: function(a) { return d({ category: "UPDATE", type: "NOTES", Entity: a.Entity, RecordID: a.RecordID, RelatedRecordID: a.RelatedRecordID, APIData: { Files: { FileName: File.Name, FileData: File.Content } } }) },
                    insertRecord: function(a) { return k(a.Entity, a.APIData) },
                    getRecord: function(a) {
                        return d({
                            category: "READ",
                            APIData: {
                                Entity: a.Entity,
                                RecordID: a.RecordID,
                                RelatedList: void 0
                            }
                        })
                    },
                    getAllRecords: function(a) { return d({ category: "READ", APIData: a }) },
                    updateRecord: function(a) { return d({ category: "UPDATE", type: "RECORD", Entity: a.Entity, APIData: a.APIData }) },
                    deleteRecord: function(a) { return d({ category: "DELETE", type: "RECORD", Entity: a.Entity, RecordID: a.RecordID }) },
                    searchRecord: function(a) { return d({ category: "SEARCH", Entity: a.Entity, Type: a.Type, Query: a.Query, page: a.page, per_page: a.per_page }) },
                    getAllUsers: function(a) { return g({ Type: a.Type, page: a.page, per_page: a.per_page }) },
                    getUser: function(a) { return g({ ID: a.ID }) },
                    getRelatedRecords: function(a) { return d({ category: "READ", APIData: a }) },
                    updateRelatedRecords: function(a) { return d({ category: "UPDATE", type: "RELATED_RECORD", Entity: a.Entity, RecordID: a.RecordID, RelatedList: a.RelatedList, RelatedRecordID: a.RelatedRecordID, APIData: a.APIData }) },
                    delinkRelatedRecord: function(a) { return d({ category: "DELETE", type: "RELATED_RECORD", Entity: a.Entity, RecordID: a.RecordID, RelatedList: a.RelatedList, RelatedRecordID: a.RelatedRecordID }) },
                    attachFile: function(a) {
                        var e =
                            a.Entity,
                            b = a.RecordID;
                        a = a.File;
                        a = { FileName: a.Name, FileData: a.Content };
                        return k(e, a, b, "ATTACHMENT")
                    },
                    getAllProfiles: function(a) { return d({ category: "PROFILES", type: "GET_ALL_PROFILES" }) },
                    getProfile: function(a) { return d({ category: "PROFILES", type: "GET_PROFILE", ID: a.ID }) },
                    updateProfile: function(a) { return d({ category: "UPDATE", type: "PROFILE", ID: a.ID, APIData: a.APIData }) },
                    getOrgVariable: function(a) { return h("VARIABLE", a) }
                },
                UI: {
                    Resize: function(a) { a = { action: "RESIZE", data: { width: a.width, height: a.height } }; return f(a) },
                    Dialer: { maximize: function() { return f({ action: { telephony: "MAXIMIZE" } }) }, minimize: function() { return f({ action: { telephony: "MINIMIZE" } }) }, notify: function() { return f({ action: { telephony: "NOTIFY" } }) } },
                    Record: {
                        open: function(a) { a = { action: { record: "OPEN" }, data: { Entity: a.Entity, RecordID: a.RecordID } }; return f(a) },
                        edit: function(a) { a = { action: { record: "EDIT" }, data: { Entity: a.Entity, RecordID: a.RecordID } }; return f(a) },
                        create: function(a) { a = { action: { record: "CREATE" }, data: { Entity: a.Entity, RecordID: a.RecordID } }; return f(a) },
                        populate: function(a) { return f({ action: { record: "POPULATE" }, data: a }) }
                    },
                    Popup: { close: function() { return f({ action: { popup: "CLOSE" } }) }, closeReload: function() { return f({ action: { popup: "CLOSE_RELOAD" } }) } }
                },
                HTTP: { get: function(a) { return c("wget.get", a) }, post: function(a) { return c("wget.post", a) } },
                CONNECTOR: { invokeAPI: function(a, b) { return c(a, b, "CONNECTOR") } },
                CONNECTION: {
                    invoke: function(a, b) {
                        var c = {},
                            f = {};
                        f.url = b.url;
                        f.method = b.method;
                        f.param_type = b.param_type;
                        f.parameters = JSON.stringify(b.parameters);
                        f.headers =
                            JSON.stringify(b.headers);
                        c.data = f;
                        return d({ category: "CRM_CONNECTION", connectionName: a, data: c })
                    }
                }
            }
        }()
    }
}();
var ZSDKUtil = function(b) {
        function g(b) {}

        function d(b) {
            var c = {};
            b = b || window.location.href;
            b.substr(b.indexOf("?") + 1).split("\x26").forEach(function(b, d) {
                var a = b.split("\x3d");
                c[a[0]] = a[1]
            });
            c.hasOwnProperty("serviceOrigin") && (c.serviceOrigin = decodeURIComponent(c.serviceOrigin));
            return c
        }
        var k = d(),
            c;
        g.prototype.Info = function() {
            (b.isDevMode() || b.isLogEnabled()) && window.console.info.apply(null, arguments)
        };
        g.prototype.Error = function() {
            (b.isDevMode() || b.isLogEnabled()) && window.console.error.apply(null,
                arguments)
        };
        b.GetQueryParams = d;
        b.isDevMode = function() { return k && k.isDevMode };
        b.isLogEnabled = function() { return k && k.isLogEnabled };
        b.getLogger = function() { c && c instanceof g || (c = new g); return c };
        b.Sleep = function(b) { for (var c = (new Date).getTime(); c + b > (new Date).getTime();); };
        return b
    }(window.ZSDKUtil || {}),
    ZSDKMessageManager = function(b) {
        function g(a) {
            try { var b = "string" === typeof a.data ? JSON.parse(a.data) : a.data } catch (B) { b = a.data }
            var g = b.type,
                h = b.eventName;
            try {
                var l;
                if (!(l = "SET_CONTEXT" === h)) {
                    var n = a.source,
                        m = a.origin;
                    l = e.isAppRegistered() && q === n && r === m ? !0 : Error("Un-Authorized Message.")
                }
                if (l) switch (g) {
                    case "FRAMEWORK.EVENT":
                        var A = { SET_CONTEXT: d, UPDATE_CONTEXT: k, EVENT_RESPONSE: c, EVENT_RESPONSE_FAILURE: f }[b.eventName];
                        A && "function" === typeof A ? A(a, b) : ZSDKEventManager.NotifyEventListeners(e.AppContext, b.eventName, b.data);
                        break;
                    default:
                        e.MessageInterceptor(a, b)
                }
            } catch (B) { u.Error("[SDK.MessageHandler] \x3d\x3e ", B.stack) }
        }

        function d(a, b) {
            q = window.parent;
            r = e.QueryParams.serviceOrigin;
            e.SetContext(b.data);
            e.ExecuteLoadHandler()
        }

        function k(a, b) {}

        function c(a, b) { h(b.promiseid, !0, b.data) }

        function f(a, b) { h(b.promiseid, !1, b.data) }

        function h(a, b, c) { n.hasOwnProperty(a) && (b ? n[a].resolve(c) : n[a].reject(c), n[a] = void 0, delete n[a]) }

        function w(a) { return new Promise(function(b, c) { n[a] = { resolve: b, reject: c, time: (new Date).getTime() } }) }

        function l(b) {
            "object" === typeof b && (b.appOrigin = encodeURIComponent(a()));
            if (!q) throw Error("Parentwindow reference not found.");
            q.postMessage(b, e.QueryParams.serviceOrigin)
        }

        function a() {
            return window.location.protocol +
                "//" + window.location.host + window.location.pathname
        }
        var e, u = ZSDKUtil.getLogger(),
            v = 100,
            n = {},
            q, r;
        b.Init = function(a, c) {
            if (!a || "object" !== typeof a) throw Error("Invalid Context object passed");
            if (c && "object" !== typeof c) throw Error("Invalid Configuration Passed to MessageManager");
            e = a;
            return g.bind(b)
        };
        b.RegisterApp = function() {
            var b = { type: "SDK.EVENT", eventName: "REGISTER", appOrigin: encodeURIComponent(a()) };
            window.parent.postMessage(b, e.QueryParams.serviceOrigin)
        };
        b.DERegisterApp = function() {
            var a = {
                type: "SDK.EVENT",
                eventName: "DEREGISTER",
                uniqueID: e.getUniqueID()
            };
            l(a)
        };
        b.SendRequest = function(a) {
            if (!a || "object" !== typeof a) throw Error("Invalid Options passed");
            var b;
            b = "Promise" + v++;
            a = { type: "SDK.EVENT", eventName: "HTTP_REQUEST", uniqueID: e.getUniqueID(), time: (new Date).getTime(), promiseid: b, data: a };
            l(a);
            b = w(b);
            return b
        };
        b.TriggerEvent = function(a, b, c) {
            if (!a) throw Error("Invalid Eventname : ", a);
            var d = c ? "Promise" + v++ : void 0;
            a = {
                type: "SDK.EVENT",
                eventName: a,
                uniqueID: e.getUniqueID(),
                time: (new Date).getTime(),
                promiseid: d,
                data: b
            };
            l(a);
            if (c) return w(d)
        };
        return b
    }(window.ZSDKMessageManager || {}),
    ZSDKEventManager = function(b) {
        var g = ZSDKUtil.getLogger(),
            d = {};
        b.AttachEventListener = function(b, c) { "function" === typeof c && (Array.isArray(d[b]) || (d[b] = []), d[b].push(c)) };
        b.NotifyEventListeners = function(b, c, f) {
            var h = c.match(/^\__[A-Za-z_]+\__$/gi);
            Array.isArray(h);
            if ((h = d[c]) && Array.isArray(h))
                for (c = 0; c < h.length; c++) h[c].call(b, f);
            else g.Info("Cannot find EventListeners for Event : ", c)
        };
        b.NotifyInternalEventHandler = function(b, c) {
            var d =
                c.eventName;
            "__APP_INIT__" === d ? (b.SetContext(c.data), b.ExecuteLoadHandler()) : "__APP_CONTEXT_UPDATE__" === d && (b.UpdateContext(c.data), b.ExecuteContextUpdateHandler())
        };
        return b
    }(window.ZSDKEventManager || {});

function ZSDK() {
    function b() { "function" !== typeof n ? x.Error("No OnLoad Handler provided to execute.") : C ? x.Error("OnLoad event already triggered.") : (n.call(m, m), C = !0) }

    function g() { q.call(m, m) }

    function d() { return z }

    function k(a, b, c) { return ZSDKMessageManager.TriggerEvent(a, b, c) }

    function c(a) {
        x.Info("Setting AppContext data");
        var b = a && a.model || {};
        isDevMode && a.locale && a.localeResource && 0 === Object.keys(a.localeResource).length && a.localeResource.constructor === Object && a.locale && l(a.locale);
        if ("undefined" !==
            typeof ZSDKModelManager) {
            for (var c in b) ZSDKModelManager.AddModel(c, b[c]);
            m.Model = ZSDKModelManager.GetModelStore()
        }
        p = a.uniqueID;
        r = a.connectors;
        x.Info("App Connectors ", r);
        z = !0
    }

    function f() { return p }

    function h(a) {}

    function w() { return r }

    function l(b) {
        a("/app-translations/" + b + ".json", function(a) {
            y = JSON.parse(a);
            v()
        })
    }

    function a(a, b) {
        var c = new XMLHttpRequest;
        c.open("GET", a, !1);
        c.onreadystatechange = function() { 4 == c.readyState && "200" == c.status && b(c.responseText) };
        c.send(null)
    }

    function e(a, b, c) {
        for (var d =
                ""; d != a;) d = a, a = a.replace(b, c);
        return a
    }

    function u(a, b) {
        b = b.replace(/\[(\w+)\]/g, ".$1");
        b = b.replace(/^\./, "");
        for (var c = b.split("."), d = 0, e = c.length; d < e; ++d) {
            var f = c[d];
            if (f in a) a = a[f];
            else return
        }
        return a
    }

    function v() {
        var a = document.querySelectorAll("[data-i18n]"),
            b;
        for (b in a)
            if (a.hasOwnProperty(b)) {
                var c = u(y, a[b].getAttribute("data-i18n"));
                if (!c) return !1;
                if (a[b].hasAttribute("data-options")) {
                    var d = JSON.parse(JSON.stringify(eval("(" + a[b].getAttribute("data-options") + ")"))),
                        f = Object.keys(d),
                        g;
                    for (g in f) c =
                        e(c, "${" + f[g] + "}", d[f[g]])
                }
                a[b].innerHTML = c
            }
    }
    var n, q, r, t, p, y = {},
        x = ZSDKUtil.getLogger(),
        z = !1,
        C = !1;
    this.isContextReady = !1;
    this.HelperContext = {};
    this.isDevMode = !1;
    this.getContext = function() { return m };
    var m = { Model: {}, Event: {} };
    m.Event.Listen = function(a, b) { ZSDKEventManager.AttachEventListener(a, b) };
    m.Event.Trigger = k;
    m.GetRequest = function(a) { return ZSDKMessageManager.SendRequest(a) };
    m.QueryParams = t;
    m.Translate = function(a, b) {
        var c = "";
        a && (c = u(y, a));
        if (!c) return !1;
        if (b) {
            var d = JSON.parse(JSON.stringify(eval(b))),
                f = Object.keys(d);
            for (a in f) c = e(c, "${" + f[a] + "}", d[f[a]])
        }
        return c
    };
    this.OnLoad = function(a) {
        if ("function" !== typeof a) throw Error("Invalid Function value is passed");
        n = a;
        z && b()
    };
    this.OnUnLoad = function(a) {};
    this.OnContextUpdate = function(a) { q = a };
    (function() {
        t = ZSDKUtil.GetQueryParams();
        isDevMode = !!t.isDevMode;
        var a = {};
        a.isDevMode = isDevMode;
        a.ExecuteLoadHandler = b;
        a.SetContext = c;
        a.UpdateContext = h;
        a.QueryParams = t;
        a.GetConnectors = w;
        a.TriggerEvent = k;
        a.ExecuteContextUpdateHandler = g;
        a.getUniqueID = f;
        a.isAppRegistered =
            d;
        var e = ZSDKMessageManager.Init(a);
        window.addEventListener("message", e);
        window.addEventListener("unload", function() { ZSDKMessageManager.DERegisterApp() });
        "undefined" !== typeof ZSDKModelManager && ZSDKModelManager.Init(a);
        ZSDKMessageManager.RegisterApp()
    })()
};