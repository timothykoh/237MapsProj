var countries = ['afghanistan', 'aland islands', 'albania', 'algeria', 'american samoa', 'andorra', 'angola', 'anguilla', 'antarctica', 'antigua and barbuda', 'argentina', 'armenia', 'aruba', 'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benin', 'bermuda', 'bhutan', 'bolivia', 'bonaire', 'bosnia', 'botswana', 'bouvet island', 'brazil', 'british indian ocean territory', 'brunei darussalam', 'bulgaria', 'burkina faso', 'burundi', 'cambodia', 'cameroon', 'canada', 'cape verde', 'cayman islands', 'central african republic', 'chad', 'chile', 'china', 'christmas island', 'cocos islands', 'colombia', 'comoros', 'congo', 'congo', 'cook islands', 'costa rica', "cote d'ivoire", 'croatia', 'cuba', 'curacao', 'cyprus', 'czech republic', 'denmark', 'djibouti', 'dominica', 'dominican republic', 'ecuador', 'egypt', 'el salvador', 'equatorial guinea', 'eritrea', 'estonia', 'ethiopia', 'falkland islands', 'faroe islands', 'fiji', 'finland', 'france', 'french guiana', 'french polynesia', 'french southern territories', 'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'gibraltar', 'greece', 'greenland', 'grenada', 'guadeloupe', 'guam', 'guatemala', 'guernsey', 'guinea', 'guinea-bissau', 'guyana', 'haiti', 'heard island and mcdonald islands', 'vatican city', 'honduras', 'hong kong', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'isle of man', 'israel', 'italy', 'jamaica', 'japan', 'jersey', 'jordan', 'kazakhstan', 'kenya', 'kiribati', "north korea", 'south korea', 'kuwait', 'kyrgyzstan', "laos", 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'macao', 'macedonia', 'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'marshall islands', 'martinique', 'mauritania', 'mauritius', 'mayotte', 'mexico', 'micronesia', 'moldova', 'monaco', 'mongolia', 'montenegro', 'montserrat', 'morocco', 'mozambique', 'myanmar', 'namibia', 'nauru', 'nepal', 'netherlands', 'new caledonia', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'niue', 'norfolk island', 'northern mariana islands', 'norway', 'oman', 'pakistan', 'palau', 'palestinian territories', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'pitcairn', 'poland', 'portugal', 'puerto rico', 'qatar', 'reunion', 'romania', 'russia', 'rwanda', 'saint barthelemy', 'saint helena', 'saint kitts and nevis', 'saint lucia', 'saint martin', 'saint pierre and miquelon', 'saint vincent and the grenadines', 'samoa', 'san marino', 'sao tome and principe', 'saudi arabia', 'senegal', 'serbia', 'seychelles', 'sierra leone', 'singapore', 'sint maarten', 'slovakia', 'slovenia', 'solomon islands', 'somalia', 'south africa', 'south georgia', 'south sudan', 'spain', 'sri lanka', 'sudan', 'suriname', 'svalbard and jan mayen', 'swaziland', 'sweden', 'switzerland', 'syria', 'taiwan', 'tajikistan', 'tanzania', 'thailand', 'timor leste', 'togo', 'tokelau', 'tonga', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 'turks and caicos islands', 'tuvalu', 'uganda', 'ukraine', 'united arab emirates', 'united kingdom', 'england', 'london', 'united states', 'new york', 'washington', 'puerto rico', 'uruguay', 'uzbekistan', 'vanuatu', 'venezuela', 'vietnam', 'virgin islands', 'wallis and futuna', 'western sahara', 'yemen', 'zambia', 'zimbabwe', 'paris', 'berlin', 'tokyo', 'seoul', 'pyongyang', 'beijing', 'california', 'los angeles', 'san francisco', 'baghdad', 'tehran', 'toronto', 'islamabad', 'aleppo', 'damascus', 'jerusalem', 'tel aviv', 'gaza strip', 'beirut', 'cairo'];

var article_queue = [];

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
        
        q_urls.push({q: "http://api.nytimes.com/svc/search/v1/article?format=json&query=" + query + "&fields=title,des_facet,per_facet,geo_facet,org_facet,body,url,small_image,small_image_url,small_image_height,small_image_width&api-key=ffc6cf5f46dcd7158c8dd03d5bbd071a:1:66718702", callback: "callback2"});
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

function preview(fulltext) {
    var sentences = fulltext.split(".");
    var preview_text = "";
    for(var j=0; j<sentences.length; j++) {
        preview_text += sentences[j] + ".";
        if (preview_text.length > 200) break;
    }
    return preview_text;
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

function detectCountry(bodytext) {
    var bodytextl = bodytext.toLowerCase();
    var maxfreq = 0;
    var maxcountry = "";
    for(var j=0; j<countries.length; j++) {
        parts = bodytextl.split(countries[j]);
        var freq = parts.length;
        if (freq > maxfreq) {
            maxcountry = countries[j];
            maxfreq = freq;
        }
    }
    return {country: maxcountry, freq: maxfreq};
}

// Callback to process newswire data
function callback1(data) {
    var results = data.query.results.json.results;
    var ret = [];
    var article;
    
    for(var i=0; i<results.length; i++) {
        if (results[i].geo_facet.length > 0 && results[i].multimedia.length > 0) {
            article = {};
            article.headline = results[i].title;
            article.abstract = results[i].abstract;
            article.location = extractLocation(results[i].geo_facet, results[i].abstract);
            article.url = results[i].url;
            article.keywords = makeKeywords(results[i]);
            article.thumbnail = {url: results[i].multimedia[0].url, 
                                 width: results[i].multimedia[0].width, 
                                 height: results[i].multimedia[0].height};
            article.picture = "";
            
            ret.push(article);
        }
    }
      
    locateAndPopulate(ret);
}

// Callback to process search data
function callback2(data) {
    var results = data.query.results.json.results;
    var ret = [];
    var article;
    
    for(var i=0; i<results.length; i++) {
        var bodyp = results[i].body.split("&mdash;");
        if (bodyp.length > 1 && results[i].small_image) {
            article = {};
            article.headline = results[i].title;
            article.abstract = preview(bodyp[1]) + "...";
            var country_info = detectCountry(bodyp[1]);
            if (country_info.freq >= 3) {
                // Use country
                article.location = country_info.country;
            }
            else {
                // Use reporting location
                article.location = bodyp[0];
            }
            article.url = results[i].url;
            article.keywords = makeKeywords(results[i]);
            article.thumbnail = {url: results[i].small_image_url,
                                 width: results[i].small_image_width,
                                 height: results[i].small_image_height};
            article.picture = "";
            
            ret.push(article);
        }
    }
    
    locateAndPopulate(ret);
}

// Callback for Guardian
function callback3(data) {
    var results = data.response.results;
    var ret = [];
    var article;
    
    for(var i=0; i<results.length; i++) {
        if (results[i].fields.body) {
            var bodytext = results[i].fields.body.replace(/<(?:.|\n)*?>/gm, " ");
            var country_info = detectCountry(bodytext);
            
            if (maxfreq > 0 && results[i].fields.thumbnail) {
                article = {};
                article.headline = results[i].webTitle;
                article.abstract = preview(bodytext) + "...";
                article.location = country_info.country;
                article.url = results[i].webUrl;
                var idparts = results[i].id.split("/");
                var idtitle = idparts[idparts.length-1].replace("-", " ");
                article.keywords = idtitle;
                article.thumbnail = {url: results[i].fields.thumbnail, width: 140/2, height: 84/2};
                article.picture = "";
                
                ret.push(article);
            }
        }
    }
    
    locateAndPopulate(ret);
}

function locateAndPopulate(articles) {
    article_queue = article_queue.concat(articles);
}

function clearArticleQueue() {
    if (article_queue.length > 0) {
        var top_article = article_queue.shift();
        
        var geocoder = new google.maps.Geocoder();  
        geocoder.geocode({'address': top_article.location}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var geoLocation = results[0].geometry.location;
                addMarker(top_article, geoLocation);
            }
            else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}

setInterval(clearArticleQueue, 500);

//////////////////////////////////////*****************nickys trial method to get missing pics*//////////////////
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
