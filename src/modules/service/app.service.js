define({
    name: "app.service",
    modules: ["jqrouter", "jQuery", "jsutils.file", "jsutils.server", "jsutils.json"]
}).as(function (app, jqrouter, jQuery, fileUtil, server, jsonutils) {

    var randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var _cities = [
        "Gardendale", "June Lake", "Needles", "Hicksville", "Irvington", "Allendale", "Purchase", "Lawrence", "Richland Center",
        "Roscoe", "Sun Prairie", "Fort Atkinson", "Ripon", "Horicon", "Sturgeon Bay", "Fox Lake", "Duluth", "Superior", "Melrose",
        "Connelly Springs", "Valdese", "Drexel", "Belton", "Piedmont", "Hampstead", "Roan Mountain", "Woodruff", "Inman", "Boiling Springs",
        "Chesnee", "Dayton", "Evensville", "Trezevant", "Huntingdon", "Bluff City", "Lenoir City", "Bristol", "McMinnville", "Paris", "Chatsworth",
        "Summerville", "Trion", "Newbern", "Folsom", "Ponchatoula", "Tickfaw", "Springfield", "Russellville", "Sparta", "Monroe",
        "Altamont", "Selmer", "Bells", "Trenton", "Ider", "Whitwell", "Bell Buckle", "Franklin", "Oakwood", "Kill Devil Hills", "Walland",
        "Stewartville", "Northfield", "Pine Island", "Albert Lea", "Lakeville", "Faribault", "Mondovi", "Fairfax", "Mankato", "Byron",
        "Brownsdale", "Beloit", "Palmyra", "Genoa City", "Fontana", "Darien", "Waterloo", "Clinton", "New Holstein", "Stoughton", "Lodi",
        "Baraboo", "Deerfield", "Oregon", "Rhinelander", "Lake Mills", "Evansville", "Edgerton", "Elkhorn", "Delavan", "Bulverde", "McConnelsville",
        "Coolville", "Jackson", "Wellston", "West Point"
    ];

    dummyJson.formatters({
        "city": function () {
            return _cities[randomInt(0, _cities.length - 1)];
        },
        "gender": function (a,b,c) {
            var list = (a||"men,women").split(",");
            return list[randomInt(0, list.length - 1)];
        }
    });

    return {
        getProfiles: function (query) {
            return fileUtil.get(
                this.path("profiles.json"), query
            ).then(function (resp) {
                var age_start = (query.age.split(",")[0] || 18) - 0;
                var age_end = (query.age.split(",")[1] || 70) - 0,
                    _query = {
                        age_start: age_start,
                        age_end: age_end,
                        results: (age_end - age_start),
                        gender : query.gender
                    };
                return jsonutils.parse(resp, _query);
            });
        }
    };

});
