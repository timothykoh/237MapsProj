function Map(){
	this.mapDisplay;
}

Map.prototype.infoBox = new InfoBox({	
	content: ""
	,closeBoxURL: ""
	,pixelOffset: new google.maps.Size(-170,-160)
});
var map = new Map();

window.onload = function(){
	var mapOptions = {
		center: new google.maps.LatLng(40.44350370, -79.94157059999),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map.mapDisplay = new google.maps.Map(document.getElementById("mainMap"), mapOptions);
}


function addMarker(){
	var lat = document.getElementById("lat").value;
	var lng = document.getElementById("lng").value;
	if (lat === "" || isNaN(lat)){
		document.getElementById("errorMsg").innerHTML = "key in a proper lattitude";
	}
	else if(lng === "" || isNaN(lng)){
		document.getElementById("errorMsg").innerHTML = "key in a proper longitude";
	}
	else{
		document.getElementById("errorMsg").innerHTML = "adding marker..";
		var latLng = new google.maps.LatLng(lat, lng);
		var imgWidth = 100;
		var imgHeight = 50;
		var img = new google.maps.MarkerImage(document.getElementById("imgURL").value, //url
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
			headline: document.getElementById("newsHeadline").value,
			content: document.getElementById("newsContent").value,
			url: document.getElementById("linkURL").value,
			title: document.getElementById("locationName").value
		});

		google.maps.event.addListener(marker, 'mouseover', function() {
    		map.infoBox.open(map.mapDisplay, marker);
    		
    		var headline = document.createElement("h1");
    		headline.innerHTML = this.headline;
    		var content = document.createElement("h2");
    		content.innerHTML = this.content;

    		var infoBoxContent = document.createElement("div");
    		infoBoxContent.appendChild(headline);
    		infoBoxContent.appendChild(content);

    		map.infoBox.setContent(infoBoxContent);
    		
		});

		google.maps.event.addListener(marker, 'click', function(){
			window.location.href = this.url;
		});


	}
		
}

