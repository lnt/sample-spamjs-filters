define({
    name: "app.filters",
    extend: "spamjs.view",
    modules: ["jqrouter", "jQuery", "jsutils.file", "jsutils.server", "jsutils.json"]
}).as(function(app, jqrouter, jQuery, fileUtil, server, jsonutils) {


    return {
        events: {
            //"change .filter_param": "filter_param_change",
            "click .search" : "filter_param_change"
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
                    keywords: [],
                    search : ""
                }));
                self.fix_keywords();
            });
        },
        filter_param_change: function() {
            console.error(arguments);
            jqrouter.setQueryParams(this.model());
        },
        fix_keywords : function(){
            var self = this;
            self.model().keywords = (self.model().keywords + "").split(",").filter(function(keyword){
                return !!keyword;
            });
            return self.model().keywords;
        },
        keyword_add : function(){
            if(this.model().search){
                console.error("sss",this.model().keywords)
                this.fix_keywords();
                this.model().keywords.push(this.model().search);
            }
        },
        keyword_delete : function(a,b,c){
            var toRemove = b.getAttribute("keyword");
            this.model().keywords = this.fix_keywords().filter(function(keyword){
                return toRemove !== keyword;
            });
        }
    };

});
