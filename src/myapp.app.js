define({
    name: "myapp.app",
    extend: "spamjs.view",
    modules: ["jqrouter", "jQuery", "jsutils.file", "UserService", "ResourceUtil", "lazy", "jsutils.cache"]
}).as(function(app, jqrouter, jQuery, fileUtil, UserService, ResourceUtil, lazy, cacheUtil) {

    var HISTORY_CACHE = cacheUtil.instance("__history__");

    return {
        router: jqrouter.map({
            "/olp/boot/*": "openDevSection",
            "/olp/boot/{mod}/*": "openDevSection",
            "?lang=": "langOnChange"
        }),
        events: {
            "header.init .view-olp-header": "header_init",
            "module404": "module404"
        },
        header_init: function() {},
        langOnChange: function(param, value, e) {
            return UserService.switchLang(value);
        },
        globalEvents: {},
        _init_: function() {
            var self = this;
            jqrouter.start();
            _importStyle_("olp/style");
            if (document.location.pathname.startsWith("/olp/boot")) {
                this.openDevSection();
            } else {
                UserService.switchLang(jqrouter.getQueryParam("lang"));
                this.$$.loadTemplate(
                    this.path("olp.app.html"),
                    jQuery.when(UserService.init().fail(function(e) {
                        self.setError(
                            jQuery.extend(e.responseJSON, {
                                status: e.status,
                                statusText: e.statusText
                            })
                        ).show();
                    }), ResourceUtil.initNavs())
                ).done(function() {
                    self.router();
                    jQuery('body').removeClass("loadingPage");

                    module("DataService", function(DataService) {
                        DataService.get("getUniDesk", {}, {
                            _callbacks_: {
                                404: false
                            }
                        }).done(function(resp) {
                            if (resp.url) {
                                jQuery(".chat-button").removeAttr("hidden");
                                window.unidesk.open({
                                    domain: resp.url,
                                    token: resp.token,
                                    data: {
                                        mobile: "",
                                        customerType: resp.productType
                                    },
                                    $container: jQuery(".chat-window"),
                                    $capture: jQuery("#app-main-contianer"),
                                    events: {
                                        "unidesk.box.close": function() {
                                            jQuery("#chat-open-close")[0].checked = false;
                                        },
                                        "unidesk.alert": function(msg) {
                                            jQuery("#chat-open-close").addClass("unidesk_alert");
                                        }
                                    }
                                });
                            }
                        });
                    });

                });
            }
            this.$style = jQuery("<style type='text/css'/>");
            this.$404 = jQuery("<div id='blankScreen'></div>");
            jQuery("body").append(this.$style).append(this.$404).removeClass("loading");
            this.refreshStyle();
        },
        openDevSection: function() {
            var self = this;
            module("spamjs.bootconfig", function(myModule) {
                self.add(myModule.instance({
                    id: "bootconfig",
                    routerBase: "/olp/boot/"
                }));
            });
        },
        setError: function(obj) {
            this.$404.loadTemplate(
                this.path("olp.app.error.html"),
                obj
            );
            return this.$404;
        },
        module404: function(m) {
            var self = this;
            if (m.detail.found === true) {
                this.$404.hide();
            } else {
                this.setError({
                    status: 404,
                    statusText: "Not Found",
                    code: "404",
                    message: "URL " + m.detail.url,
                    details: m.detail.module,
                    goBackUrl: {
                        title: "Go to HOME",
                        href: "/"
                    }
                }).show();
                self.clearLastUrl();
            }
        },
        clearLastUrl: function() {
            HISTORY_CACHE.set("lastUrl", '');
        },
        _routerEvents_: function(e, target, data, params) {
            console.error("_routerEvents_", e, target, data, params);
        },
        getOSName: function getOSName() {
            var appVersion = window.navigator.appVersion;
            var OSName = "unknown-os";
            if (appVersion.indexOf("Win") !== -1) OSName = "windows";
            else if (appVersion.indexOf("Mac") !== -1) OSName = "mac";
            else if (appVersion.indexOf("X11") !== -1) OSName = "unix";
            else if (appVersion.indexOf("Linux") !== -1) OSName = "linux";
            return OSName;
        },
        refreshStyle: window.debounce(function(e) {
            if (this.getOSName() !== "mac") {
                jQuery('body').addClass("os-nomac");
            }
            var self = this;
            fileUtil.loadView(self.path("custom.css"), {
                pathname: document.location.pathname.replace(self.router().appContext, "/")
            }).then(function(OBJ) {
                self.$style.html(OBJ.html.replace(/:jqr-go/g, "[jqr-go='" + OBJ.data.pathname + "']").replace(/:jqr-active/g, "[jqr-active^='" + OBJ.data.pathname + "']"));
            });
        }),
        cacheLastVisits: function() {
            var URL_TO_SAVE = 10,
                recentVisits = HISTORY_CACHE.get("recentVisits") || [],
                visitedAlready = -1;
            recentVisits.map(function(item, index) {
                if (item.url === window.location.href) {
                    visitedAlready = index;
                }
            });
            if (visitedAlready === -1) {
                if (recentVisits.length === URL_TO_SAVE) {
                    recentVisits.shift(1);
                }
            } else {
                recentVisits.splice(visitedAlready, 1);
            }
            recentVisits.push({
                url: window.location.href,
                name: document.title
            });
            HISTORY_CACHE.set("recentVisits", recentVisits);
        },
        _ready_: function() {
            jqrouter.on(lazy.debounce(function(e, target, data, params) {
                if (e.total || true) {
                    HISTORY_CACHE.set("lastUrl", window.location.href);
                    var pageVisits = parseInt(HISTORY_CACHE.get("pageVisits") || 0);
                    HISTORY_CACHE.set("pageVisits", pageVisits + 1);
                    //If you want to save recent visits to localStorage
                    // self.cacheLastVisits();
                }
            }));

            var ERROR = window.console.error;
            window.onerror = function() {
                ERROR.apply(window.console, arguments);
            };
            if (window.console && !bootloader.config().debug) {
                window.console.error = function() {
                    return window.console.warn.apply(window.console, arguments);
                };
            }
            window.GLOBAL = {
                ResourceUtil: ResourceUtil,
                olpApp: this.instance()
            };
            window.GLOBAL.olpApp.addTo(jQuery("body"));
        }
    };

});
