/*
Benjamin Choi (bengyenc)
Timothy Koh (tkoh1)
Nicky Ong (junyouo)
*/

function Map(){
    this.mapDisplay;
    this.currentMarkerPos;
}

Map.prototype.infoBox = new InfoBox({    
    content: ""
    ,closeBoxURL: ""
    ,pixelOffset: new google.maps.Size(-150,-280)
    ,boxClass: "newsBox"
});

var map = new Map();

window.onload = function(){
    var mapOptions = {
        center: new google.maps.LatLng(0,0),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };
    map.mapDisplay = new google.maps.Map(document.getElementById("mainMap"), mapOptions);
    
    var cats = ["World", "Business", "Science", "Sports", "Arts"];
    var i;
    for(i=0; i<cats.length; i++) {
        document.getElementById("cat"+cats[i]).onclick = function() {
            var catname = this.id.substr(3, this.id.length-3).toLowerCase();
            getNews("", catname);
        }
    }
}

var geoLocationsList = [];


function editorAddgeoLocation(lat,lng,news){
    var headline=news.headline;
    var locationTuple= [lat,lng,headline];
    
    for (var i = 0; i < geoLocationsList.length; i++) {
        if (geoLocationsList[i][2]===headline){
            return 2;
        }

        else if (geoLocationsList[i][0] === locationTuple[0] ) {
            //change tuple;
            lat=lat+4;
            lng=lng+4;
        }
    }

    geoLocationsList.push(locationTuple);

    var latlng=new google.maps.LatLng(lat, lng);
    return latlng;
}


function addMarker(news, geoLocation){    
    var lat = geoLocation.Xa;
    var lng = geoLocation.Ya;

    var latLng= editorAddgeoLocation(lat,lng,news);
    if (latLng===2){
        return
    }
    //var latLng = new google.maps.LatLng(lat, lng);
    var imgWidth = news.thumbnail.width;
    var imgHeight = news.thumbnail.height;
    var img = new google.maps.MarkerImage(news.thumbnail.url, //url
                                            new google.maps.Size(imgWidth,imgHeight), //size
                                            new google.maps.Point(0,0)); //anchor
    //define clickable region
    var shape = {
        coord: [0,0 , imgWidth,0 , imgWidth,imgHeight, 0,imgHeight],
        type: 'poly'
    };

    var marker = new google.maps.Marker({
        position: latLng,
        map: map.mapDisplay,
        icon: img,
        shape: shape,
        headline: news.headline,
        content: news.abstract,
        url: news.url,
        title: news.url,
        animation: google.maps.Animation.BOUNCE,
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
        //do not run the function if this marker is already display infoboxes from previous mouseover
        if (this.position === map.currentMarkerPos)
            return;
        else
            map.currentMarkerPos = this.position;

        //create news infobox
        map.infoBox.open(map.mapDisplay, marker);
        
        var headline = document.createElement("h1");
        headline.innerHTML = this.headline;
        
        if (this.keywords) {
            console.log(this.keywords);
            getSearch(this.keywords);
        }
        else {
            getSearch(this.headline); //calling social media widget function
        }

        var content = document.createElement("div");
        content.setAttribute("class", "abstract");
        content.innerHTML = this.content;

        var infoBoxContent = document.createElement("div");
        infoBoxContent.setAttribute("class", "newsBoxContent");
        infoBoxContent.appendChild(headline);
        infoBoxContent.appendChild(content);

        map.infoBox.setContent(infoBoxContent);
        
    });

    google.maps.event.addListener(marker, 'click', function(){
        window.open(this.url);
    });

    setTimeout(function(){ marker.setAnimation(null); }, 750);
}

function populateMap(){
    getNews(document.getElementById("searchTerm").value, "world");
}
