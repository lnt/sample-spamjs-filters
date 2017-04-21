define({
    name: "app.profiles",
    extend: "spamjs.view",
    modules: ["jqrouter", "jQuery", "jsutils.file", "jsutils.server", "jsutils.json", "lazy", "app.service"]
}).as(function(app, jqrouter, jQuery, fileUtil, server, jsonutils, lazy, service) {


    return {
        router: jqrouter.map({
            "?age": "onQueryChange",
            "?gender": "onQueryChange",
            "?search": "onQueryChange",
            "?view": "onViewChange"
        }),
        _init_: function(config) {
            var self = this;
            self.onQueryChange().done(function() {
                self.router();
            });
        },
        onQueryChange: lazy.debounce(function() {
            //Load JSON from Server and apply filter;
            console.error("search", {});
            return this.$$.loadTemplate(
                this.path("app.profiles.html"),
                service.getProfiles(jqrouter.getQueryParams()).done(function(resp){
                    console.error("onQueryChange",resp)
                })
            );
        }, 500)
    };

});
