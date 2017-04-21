define({
    name: "app.profiles",
    extend: "spamjs.view",
    modules: ["jqrouter", "lazy", "app.service"]
}).as(function (app, jqrouter, lazy, service) {


    return {
        events: {
            "change .filter_param": "onViewChange"
        },
        router: jqrouter.map({
            "?age": "onQueryChange",
            "?gender": "onQueryChange",
            "?keywords": "onQueryChange",
            //"?view": "onViewChange",
            //"?sort": "onViewChange"
        }),
        _init_: function (config) {
            var self = this;
            this.$$.loadTemplate(this.path("app.profiles.html"), {}).done(function () {
                self.router();
                self.model({
                    view: jqrouter.getQueryParam("view") || "grid",
                    sort: jqrouter.getQueryParam("sort") || "popularity"
                });
                self.onQueryChange();
            });
        },
        onQueryChange: lazy.debounce(function () {
            var self = this;
            //Load JSON from Server and apply filter;
            return this.$$.find("#results").loadTemplate(
                this.path("app.profiles.results.html"),
                service.getProfiles(jqrouter.getQueryParams()).then(function (resp) {
                    return {
                        rows: resp,
                        islist: (self.model().view == "list")
                    };
                })
            );
        }, 500),
        onViewChange: lazy.debounce(function () {
            jqrouter.setQueryParam("view", this.model().view);
            jqrouter.setQueryParam("sort", this.model().sort);
            this.onQueryChange();
        })
    };

});
