
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
	
	var cats = ["World", "Business", "Sports", "Arts"];
	var i;
	for(i=0; i<cats.length; i++) {
	    document.getElementById("cat"+cats[i]).onclick = function() {
	        var catname = this.id.substr(3, this.id.length-3).toLowerCase();
	        getNews("", catname);
	    }
    }
}

/*
// Deprecated because news.js calls addMarker directly
function addNewsToMap(news) {
	//determine the lat and lng of the news event, then add marker
	var geocoder = new google.maps.Geocoder();  
	geocoder.geocode( { 'address': news.location}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	    geoLocation = results[0].geometry.location;
	   	addMarker(news, geoLocation);
	  } 
	  else {
	    alert("Geocode was not successful for the following reason: " + status);
	  }
	});
}
*/

function addMarker(news, geoLocation){	
	var lat = geoLocation.Xa;
	var lng = geoLocation.Ya;
	var latLng = new google.maps.LatLng(lat, lng);
	var imgWidth = news.thumbnail.width;
	var imgHeight = news.thumbnail.height;
	var img = new google.maps.MarkerImage(news.thumbnail.url, //url
											new google.maps.Size(imgWidth,imgHeight), //size
											new google.maps.Point(0,0) //origin - position of image;
											/*new google.maps.Point(imgWidth/2,imgHeight/2) //anchor
											new google.maps.Size(imgWidth, imgHeight)*/); //scaled size
											// Ben: commenting out these properties fixes the image scaling display bug
											// location isn't as precise, but more important that it works :)
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
////////////////////////////* nicky adding social widget when marker is added*/////////////////
		console.log(lat+lng+'addmarker nicky');
		getSearch(this.headline);                       //calling social media widget function
		

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

/*
function populateMap(newsDataArray){
	for (var i = 0; i <= newsDataArray.length; i++){
		addNewsToMap(newsDataArray[i]);
	}	
}
*/

document.getElementById("displayNews").onclick = function(){
	getNews(document.getElementById("searchTerm").value, "world");
}
