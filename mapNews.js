
function Map(){
	this.mapDisplay;
	this.currentMarkerPos;
}

Map.prototype.infoBox = new InfoBox({	
	content: ""
	,closeBoxURL: ""
	,pixelOffset: new google.maps.Size(-170,-160)
	,boxClass: "newsBox"
});

Map.prototype.twitBox = new InfoBox({
	content: ""
	,closeBoxURL: ""
	,pixelOffset: new google.maps.Size(70,-20)
	,boxClass: "twitBox"
})


var map = new Map();

window.onload = function(){
	var mapOptions = {
		center: new google.maps.LatLng(30,0 ),
		zoom: 2,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map.mapDisplay = new google.maps.Map(document.getElementById("mainMap"), mapOptions);
}


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


function addMarker(news, geoLocation){	
	var lat = geoLocation.Xa;
	var lng = geoLocation.Ya;
	var latLng = new google.maps.LatLng(lat, lng);
	var imgWidth = 50;
	var imgHeight = 50;
	var img = new google.maps.MarkerImage(news.thumbnail, //url
											new google.maps.Size(imgWidth,imgHeight), //size
											new google.maps.Point(0,0), //origin - position of image;
											new google.maps.Point(imgWidth/2,imgHeight/2), //anchor
											new google.maps.Size(imgWidth, imgHeight)); //scaled size
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
		title: "random"
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
		var content = document.createElement("h2");
		content.innerHTML = this.content;

		var infoBoxContent = document.createElement("div");
		infoBoxContent.appendChild(headline);
		infoBoxContent.appendChild(content);

		map.infoBox.setContent(infoBoxContent);
		

		//create twitter infobox
		map.twitBox.open(map.mapDisplay, marker);

		var twitterIcon = document.createElement("img");
		twitterIcon.src = "twitterIcon.gif";
		twitterIcon.height = "50";
		twitterIcon.width = "50";

		//twitter Feeds are hidden until user mouses over
		var twitterFeeds = document.createElement("div");
		twitterFeeds.className = "twitterFeedsHidden";

		//create a twitter wrapper to store the twitter icon img tag and tweets
		var twitterWrapper = document.createElement("div");
		twitterWrapper.id = "twitterWrapperShown";
		twitterWrapper.appendChild(twitterIcon);
		twitterWrapper.appendChild(twitterFeeds);

		map.twitBox.setContent(twitterWrapper);

		//create event for mouse over on twit box
		$(twitterWrapper).mouseenter(function(){
			twitterFeeds.className = "twitterFeedsRevealed";
		});
		$(twitterWrapper).mouseleave(function(){
			twitterFeeds.className = "twitterFeedsHidden";
		});
	});

	google.maps.event.addListener(marker, 'click', function(){
		window.location.href = this.url;
	});


}


function populateMap(newsDataArray){
	for (var i = 0; i <= 10; i++){
		addNewsToMap(newsDataArray[i]);
	}	
}


getNews("");


