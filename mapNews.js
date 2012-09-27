var map;

window.onload = function(){
	var mapOptions = {
		center: new google.maps.LatLng(40.44350370, -79.94157059999),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("mainMap"), mapOptions);
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
												new google.maps.Point(0,0), //anchor
												new google.maps.Size(imgWidth, imgHeight)); //scaled size
		//define clickable region
		var shape = {
			coord: [0,0 , imgWidth,0 , imgWidth,imgHeight, 0,imgHeight],
			type: 'poly'
		};

		var marker = new google.maps.Marker({
			position: latLng,
			map: map,
			icon: img,
			shape: shape,
			url: document.getElementById("linkURL").value,
			title: document.getElementById("locationName").value
		});

		google.maps.event.addListener(marker, 'click', function() {
    		window.location.href = this.url;
		});
	}
		
}

