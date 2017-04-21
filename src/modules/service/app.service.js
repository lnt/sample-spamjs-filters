define({
    name: "app.service",
    modules: ["jsutils.file", "jsutils.json"]
}).as(function (app, fileUtil, jsonutils) {


    var CACHE;
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
    var _keywords = [
        "nature", "politics", "science", "maths", "wild", "social", "sports"
    ];
    var _gender = ["men", "women"];

    dummyJson.formatters({
        "city": function () {
            return _cities[randomInt(0, _cities.length - 1)];
        },
        "gender": function (a, b, c) {
            return _gender[randomInt(0, _gender.length - 1)];
        },
        "keywords": function (a, b, c) {
            return _keywords[randomInt(0, _keywords.length - 1)];
        }
    });

    return {
        getProfiles: function (query) {
            var self = this;
            return fileUtil.get(
                this.path("profiles.res"), query
            ).then(function (resp) {
                CACHE = CACHE || jsonutils.parse(resp, {});
                var ages = (query.age + "").split(",");
                ages[0] = (ages[0] || 18) - 0;
                ages[1] = (ages[1] || 70) - 0;
                var gender = {};
                ((query.gender + "") || "men,women").split(",").map(function (value) {
                    gender[value] = true;
                });
                return CACHE.filter(function (a) {
                    if (a.age <= ages[0] || a.age >= ages[1]) {
                        return false;
                    }
                    if (!gender[a.gender]) {
                        return false;
                    }
                    if (query.keywords) {
                        var keywrods = (query.keywords + "").split(",");
                        for (var i in a.keywords) {
                            if (keywrods.indexOf(a.keywords[i].trim()) > -1) {
                                return true;
                            }
                        }
                        return false;
                    }
                    return true;
                }).sort(function (a, b) {
                    switch (query.sort) {
                        case "popularity" : {
                            return a.popularity < b.popularity ? 1 : -1;
                        }
                        case "cost" : {
                            return a.cost > b.cost ? 1 : -1;
                        }
                        case "age" : {
                            return a.age > b.age ? 1 : -1;
                        }
                            return 0;
                    }
                });
            });
        }
    };

});
