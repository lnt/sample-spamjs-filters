define({
    name: "app.filters",
    extend: "spamjs.view",
    modules: ["jqrouter", "jQuery", "jsutils.file", "jsutils.server", "jsutils.json"]
}).as(function(app, jqrouter, jQuery, fileUtil, server, jsonutils) {


    return {
        _init_: function(config) {
            console.error("config", config);
            return this.$$.loadTemplate(
                this.path("app.filters.html"), {}
            );
        }
    };

});
