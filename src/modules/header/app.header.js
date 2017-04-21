define({
    name: "app.header",
    extend: "spamjs.view",
    modules: []
}).as(function(app) {


    return {
        _init_: function(config) {
            return this.$$.loadTemplate(
                this.path("app.header.html"), {}
            );
        }
    };

});
