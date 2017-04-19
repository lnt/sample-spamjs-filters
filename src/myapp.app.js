define({
    name: "myapp.app",
    extend: "spamjs.view",
    modules: ["jqrouter", "jQuery", "jsutils.file"]
}).as(function(app, jqrouter, jQuery, fileUtil) {

    return {
        router: jqrouter.map({
            "/app/boot/*": "openDevSection",
            "/app/search": "openHome"
        }),
        _init_: function(config) {
            var self = this;
            jqrouter.start();
            _importStyle_("myapp/style");
            this.$$.loadTemplate(
                this.path("myapp.app.html")
            ).done(function() {
                self.router().defaultRoute(config.options.defaultUrl);
            });
        },
        openHome: function(e, name, query) {
            this.$$.find("#main").append('<spamjs-view module="app.search"></spamjs-view>');
        },
        openDevSection: function() {
            var self = this;
            module("spamjs.bootconfig", function(myModule) {
                self.add(myModule.instance({
                    id: "bootconfig",
                    routerBase: "/app/boot/"
                }));
            });
        },
        openModule: function(myModuleName, options) {
            var self = this;
            bootloader.module404 = function(_moduleName) {
                if (myModuleName === _moduleName) {
                    self.module404(myModuleName);
                }
            };
            module([myModuleName], function(myModule) {
                self.add(myModule.instance({
                    id: "main",
                    options: options
                }));
            });
        },
        module404: function(myModuleName) {
            this.$$.html(myModuleName + " not found");
        },
        _routerEvents_: function(e, target, data, params) {
            console.error("_routerEvents_", e, target, data, params);
        },
        _ready_: function() {
            //this.instance({options: {"module": "rudrax.home"}}).addTo(jQuery("body"));
        }
    };

});
