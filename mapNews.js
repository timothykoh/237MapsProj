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
		var maker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: document.getElementById("locationName").value
		});
	}
		
}