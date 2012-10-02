var countries = ['afghanistan', 'aland islands', 'albania', 'algeria', 'american samoa', 'andorra', 'angola', 'anguilla', 'antarctica', 'antigua and barbuda', 'argentina', 'armenia', 'aruba', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benin', 'bermuda', 'bhutan', 'bolivia, plurinational state of', 'bonaire, sint eustatius and saba', 'bosnia and herzegovina', 'botswana', 'bouvet island', 'brazil', 'british indian ocean territory', 'brunei darussalam', 'bulgaria', 'burkina faso', 'burundi', 'cambodia', 'cameroon', 'canada', 'cape verde', 'cayman islands', 'central african republic', 'chad', 'chile', 'china', 'christmas island', 'cocos (keeling) islands', 'colombia', 'comoros', 'congo', 'congo, the democratic republic of the', 'cook islands', 'costa rica', "cote d'ivoire", 'croatia', 'cuba', 'curacao', 'cyprus', 'czech republic', 'denmark', 'djibouti', 'dominica', 'dominican republic', 'ecuador', 'egypt', 'el salvador', 'equatorial guinea', 'eritrea', 'estonia', 'ethiopia', 'falkland islands (malvinas)', 'faroe islands', 'fiji', 'finland', 'france', 'french guiana', 'french polynesia', 'french southern territories', 'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'gibraltar', 'greece', 'greenland', 'grenada', 'guadeloupe', 'guam', 'guatemala', 'guernsey', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'heard island and mcdonald islands', 'holy see (vatican city state)', 'honduras', 'hong kong', 'hungary', 'iceland', 'india', 'indonesia', 'iran, islamic republic of', 'iraq', 'ireland', 'isle of man', 'israel', 'italy', 'jamaica', 'japan', 'jersey', 'jordan', 'kazakhstan', 'kenya', 'kiribati', "korea, democratic people's republic of", 'korea, republic of', 'kuwait', 'kyrgyzstan', "lao people's democratic republic", 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'macao', 'macedonia, the former yugoslav republic of', 'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'marshall islands', 'martinique', 'mauritania', 'mauritius', 'mayotte', 'mexico', 'micronesia, federated states of', 'moldova, republic of', 'monaco', 'mongolia', 'montenegro', 'montserrat', 'morocco', 'mozambique', 'myanmar', 'namibia', 'nauru', 'nepal', 'netherlands', 'new caledonia', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'niue', 'norfolk island', 'northern mariana islands', 'norway', 'oman', 'pakistan', 'palau', 'palestinian territory, occupied', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'pitcairn', 'poland', 'portugal', 'puerto rico', 'qatar', 'reunion', 'romania', 'russian federation', 'rwanda', 'saint barthelemy', 'saint helena, ascension and tristan da cunha', 'saint kitts and nevis', 'saint lucia', 'saint martin (french part)', 'saint pierre and miquelon', 'saint vincent and the grenadines', 'samoa', 'san marino', 'sao tome and principe', 'saudi arabia', 'senegal', 'serbia', 'seychelles', 'sierra leone', 'singapore', 'sint maarten (dutch part)', 'slovakia', 'slovenia', 'solomon islands', 'somalia', 'south africa', 'south georgia and the south sandwich islands', 'south sudan', 'spain', 'sri lanka', 'sudan', 'suriname', 'svalbard and jan mayen', 'swaziland', 'sweden', 'switzerland', 'syrian arab republic', 'taiwan, province of china', 'tajikistan', 'tanzania, united republic of', 'thailand', 'timor-leste', 'togo', 'tokelau', 'tonga', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 'turks and caicos islands', 'tuvalu', 'uganda', 'ukraine', 'united arab emirates', 'united kingdom', 'united states', 'united states minor outlying islands', 'uruguay', 'uzbekistan', 'vanuatu', 'venezuela, bolivarian republic of', 'vietnam', 'virgin islands, british', 'virgin islands, u.s.', 'wallis and futuna', 'western sahara', 'yemen', 'zambia', 'zimbabwe'];

function getNews(query) {
    var i;
    var urls = [], q_urls = [];
    
    if (query.length === 0) {
        // General news
        q_urls.push({q: "http://api.nytimes.com/svc/news/v3/content/all/world/.json?api-key=1f210208b2357d3721c343fb3bf78de7:17:66718702", callback: "callback1"});
    }
    else {
        // Article search
        urls.push("http://content.guardianapis.com/search?q=" + query + "&section=world&show-fields=thumbnail,body&format=json&api-key=g9tgx9ttmsnbskgq7g3k5pwt&callback=callback3");
        
        q_urls.push({q: "http://api.nytimes.com/svc/search/v1/article?format=json&query=" + query + "&api-key=ffc6cf5f46dcd7158c8dd03d5bbd071a:1:66718702", callback: "callback2"});
    }
    
    for(i=0; i<q_urls.length; i++) {
        urls.push("http://query.yahooapis.com/v1/public/yql?format=json&callback=" + q_urls[i].callback + "&q=" + escape("select * from json where url=\"" + q_urls[i].q + "\";"));
    }
    
    for(i=0; i<urls.length; i++) {
        var script = document.createElement("script");
        script.src = urls[i];
        document.body.appendChild(script);
    }
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
            article.thumbnail = {url: "images/new-york-times-logo.jpg", width: 200/3, height: 157/3};
            if (results[i].multimedia.length > 0) {
                article.thumbnail = {url: results[i].multimedia[0].url, 
                                     width: results[i].multimedia[0].width, 
                                     height: results[i].multimedia[0].height};
            }
/***********************
****** nicky edit start***
************************/
            /*
            else{
                
                console.log("jabajaba"+article.keywords+"hihi"+article.headline);
                getMissingPic(article.headline);
                article.thumbnail=window.missingPic; 
                console.log(window.missingPic+"cheetah"+ article.thumbnail); 
                

            }
            */




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
            article.thumbnail = {url: "images/new-york-times-logo.jpg", width: 200/3, height: 157/3};
            article.picture = ""; //TODO
            
            ret.push(article);
        }
    }
    
    populateMap(ret);
}

// Callback for Guardian
function callback3(data) {
    var results = data.response.results;
    var ret = [];
    var article;
    
    for(var i=0; i<results.length; i++) {
        var bodyhtml = results[i].fields.body;
        var maxfreq = 0;
        var maxcountry = "";
        for(var j=0; j<countries.length; j++) {
            parts = bodyhtml.split(countries[j]);
            var freq = parts.length;
            if (freq > maxfreq) {
                maxcountry = countries[j];
                maxfreq = freq;
            }
        }
        
        if (maxfreq > 0) {
            article = {};
            article.headline = results[i].webTitle;
            var sentences = bodyhtml.replace(/<(?:.|\n)*?>/gm, " ").split(".");
            var bodytext = "";
            for(var j=0; j<sentences.length; j++) {
                bodytext += sentences[j] + ".";
                if (bodytext.length > 200) break;
            }
            article.abstract = bodytext + "...";
            article.location = maxcountry;
            article.url = results[i].webUrl;
            var idparts = results[i].id.split("/");
            var idtitle = idparts[idparts.length-1].replace("-", " ");
            article.keywords = idtitle;
            article.thumbnail = {url: "images/guardian-logo.jpg", width: 200/3, height: 35/3};
            if (results[i].fields.thumbnail) {
                article.thumbnail = {url: results[i].fields.thumbnail, width: 140/2, height: 84/2};
            }
            article.picture = ""; //TODO
            
            ret.push(article);
        }
    }
    
    populateMap(ret);
}



//////////////////////////////////////*****************nickys trial method to get missing pics*//////////////////

/*
google.load('search', '1');

window.missingPic='heyyou'

function searchComplete(searcher) {
  // Check that we got results
  if (searcher.results && searcher.results.length > 0) {
   

    // Loop through our results, printing them to the page.
    var results = searcher.results;
      var result = results[0];
    console.log(result.tbUrl+'searchomplete happening');

    window.missingPic= result.tbUrl;
    console.log(window.missingPic+'heybaby');
    }
  }


function getMissingPic(searchterm) {
    console.log('getMissingPic searching')
  // Our ImageSearch instance.
  var imageSearch = new google.search.ImageSearch();

  // Restrict to extra large images only
  imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,
                             google.search.ImageSearch.IMAGESIZE_MEDIUM);

  // Here we set a callback so that anytime a search is executed, it will call
  // the searchComplete function and pass it our ImageSearch searcher.
  // When a search completes, our ImageSearch object is automatically
  // populated with the results.
  imageSearch.setSearchCompleteCallback(this, searchComplete, [imageSearch]);

  // Find me a beautiful car.
  imageSearch.execute(searchterm);
}
*/
