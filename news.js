function getNews(query) {
    var url, q_url, callback_f;
    
    if (query.length === 0) {
        // General news
        q_url = "http://api.nytimes.com/svc/news/v3/content/all/world/.json?api-key=1f210208b2357d3721c343fb3bf78de7:17:66718702";
        callback_f = "callback1";
    }
    else {
        // Article search
        q_url = "http://api.nytimes.com/svc/search/v1/article?format=json&query=" + query + "&api-key=ffc6cf5f46dcd7158c8dd03d5bbd071a:1:66718702";
        callback_f = "callback2";
    }
    
    url = "http://query.yahooapis.com/v1/public/yql?format=json&callback=" + callback_f + "&q=" + escape("select * from json where url=\"" + q_url + "\";");
    
    var script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}

function makeKeywords(result) {
    var facets = ["des", "org", "per", "geo"];
    var i;
    var keywords = [];
    for(i=0; i<facets.length; i++) {
        if (Array.isArray(result[facets[i]+"_facet"]) && result[facets[i]+"_facet"].length > 0) {
            keywords.push(result[facets[i]+"_facet"].join(" "));
        }
    }
    return keywords.join(" ");
}

function processLocation(s) {
    return s.replace(" (", ", ").replace(")", "");
}

function extractLocation(geo_facet, abstract) {
    var i;
    
    if (typeof geo_facet === "string") {
        return processLocation(geo_facet);
    }
    else {
        // Figure out which one occurs most
        var max_freq = 0;
        var max_location = "";
        for(i=0; i<geo_facet.length; i++) {
            var freq = abstract.split(geo_facet[i]).length;
            if (freq > max_freq) {
                max_freq = freq;
                max_location = geo_facet[i];
            }
        }
        return processLocation(max_location);
    }
}

// Callback to process newswire data
function callback1(data) {
    var results = data.query.results.json.results;
    var ret = [];
    var article;
    
    for(var i=0; i<results.length; i++) {
        if (results[i].geo_facet.length > 0) {
            article = {};
            article.headline = results[i].title;
            article.abstract = results[i].abstract;
            article.location = extractLocation(results[i].geo_facet, results[i].abstract);
            article.url = results[i].url;
            article.keywords = makeKeywords(results[i]);
            article.thumbnail = "images/new-york-times-logo.jpg";
            if (results[i].multimedia.length > 0) {
                article.thumbnail = results[i].multimedia[0].url;
            }
            article.picture = "";
            
            ret.push(article);
        }
    }
      
    populateMap(ret);
}

// Callback to process search data
function callback2(data) {
    var results = data.query.results.json.results;
    var ret = [];
    var article;
    
    for(var i=0; i<results.length; i++) {
        var bodyp = results[i].body.split("&mdash;");
        if (bodyp.length > 1) {
            article = {};
            article.headline = results[i].title;
            article.abstract = results[i].body + "...";
            article.location = bodyp[0];
            article.url = results[i].url;
            article.keywords = ""; //TODO
            article.thumbnail = "images/new-york-times-logo.jpg";
            article.picture = ""; //TODO
            
            ret.push(article);
        }
    }
    
    populateMap(ret);
}
