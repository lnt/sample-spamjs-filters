define({
    name: "app.filters",
    extend: "spamjs.view",
    modules: ["jqrouter", "jQuery", "jsutils.file", "jsutils.server", "jsutils.json"]
}).as(function(app, jqrouter, jQuery, fileUtil, server, jsonutils) {


    return {
        events: {
            "change .filter_param": "filter_param_change"
        },
        _init_: function(config) {
            console.error("config", config);
            var self = this;
            return this.$$.loadTemplate(
                this.path("app.filters.html"), {}
            ).done(function() {
                self.model(jqrouter.getQueryParams({
                    age: [18, 24],
                    gender: [],
                    search: ""
                }));
            });
        },
        filter_param_change: function() {
            console.error(arguments);
            jqrouter.setQueryParams(this.model());
        }
    };

});
