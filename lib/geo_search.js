/*
 * element with id's map_canvas, lat, lng needed
 */
/*
 * googles map api key 
 */
var maps_key = "ABQIAAAATfHumDbW3OmRByfquHd3SRTRERdeAiwZ9EeJWta3L_JZVS0bOBRQeZgr4K0xyVKzUdnnuFl8X9PX0w";

function initMapSearch(latitude, longitude, callback) {
	if(console){
		console.log('initMapSearch(' + latitude + ', ' + longitude + ', ' + callback + ')');
	}
	if (GBrowserIsCompatible()) {
		var map = new GMap2(document.getElementById("map_canvas"), { size: new GSize(300,300) } );
		map.addControl(new GSmallMapControl());
		map.addControl(new GMapTypeControl());

		if(latitude == undefined && longitude == undefined){
			 //hello google ;)
			latitude = 37.4328;
			longitude = -122.077;
		}

		var center = new GLatLng(latitude, longitude);
		map.setCenter(center, 6);
		geocoder = new GClientGeocoder();
		var marker = new GMarker(center, {
			draggable : true
		});
		map.addOverlay(marker);
		document.getElementById("lat").innerHTML = center.lat().toFixed(5);
		document.getElementById("lng").innerHTML = center.lng().toFixed(5);

		GEvent.addListener(marker, "dragend", function() {
			var point = marker.getPoint();
			map.panTo(point);
			document.getElementById("lat").innerHTML = point.lat().toFixed(5);
			document.getElementById("lng").innerHTML = point.lng().toFixed(5);
			
			if(callback && typeof(callback) === 'function'){
				getAdressByLocation(point,callback);
			}
		});

		GEvent.addListener(map, "moveend", function() {
			map.clearOverlays();
			var center = map.getCenter();
			var marker = new GMarker(center, {
				draggable : true
			});
			map.addOverlay(marker);
			
			//clicked(map.center);
			document.getElementById("lat").innerHTML = center.lat().toFixed(5);
			document.getElementById("lng").innerHTML = center.lng().toFixed(5);
			
			if(callback && typeof(callback) === 'function'){
				getAdressByLocation(center,callback);
			}
			GEvent.addListener(marker, "dragend", function() {
				var point = marker.getPoint();
				map.panTo(point);
				document.getElementById("lat").innerHTML = point.lat().toFixed(
						5);
				document.getElementById("lng").innerHTML = point.lng().toFixed(
						5);
				if(callback && typeof(callback) === 'function'){
					getAdressByLocation(point,callback);
				}

			});

		});

	}
	return map;
}

function showAddress(address, callback) {
	var map = new GMap2(document.getElementById("map_canvas"));
	map.addControl(new GSmallMapControl());
	map.addControl(new GMapTypeControl());
	if (geocoder) {
		geocoder.getLatLng(address, function(point) {
			if (!point) {
				alert(address + " not found");
			} else {
				document.getElementById("lat").innerHTML = point.lat().toFixed(
						5);
				document.getElementById("lng").innerHTML = point.lng().toFixed(
						5);
				
				if(callback && typeof(callback) === 'function'){
					getAdressByLocation(point,callback);
				}
				
				map.clearOverlays()
				map.setCenter(point, 6);
				var marker = new GMarker(point, {
					draggable : true
				});
				map.addOverlay(marker);
				
				GEvent.addListener(marker, "dragend", function() {
					var pt = marker.getPoint();
					map.panTo(pt);
					document.getElementById("lat").innerHTML = pt.lat()
							.toFixed(5);
					document.getElementById("lng").innerHTML = pt.lng()
							.toFixed(5);
					if(callback && typeof(callback) === 'function'){
						getAdressByLocation(pt,callback);
					}
				});

				GEvent.addListener(map, "moveend", function() {
					map.clearOverlays();
					var center = map.getCenter();
					var marker = new GMarker(center, {
						draggable : true
					});
					map.addOverlay(marker);
					document.getElementById("lat").innerHTML = center.lat()
							.toFixed(5);
					document.getElementById("lng").innerHTML = center.lng()
							.toFixed(5);
					if(callback && typeof(callback) === 'function'){
						getAdressByLocation(center,callback);
					}

					GEvent.addListener(marker, "dragend", function() {
						var pt = marker.getPoint();
						map.panTo(pt);
						document.getElementById("lat").innerHTML = pt.lat()
								.toFixed(5);
						document.getElementById("lng").innerHTML = pt.lng()
								.toFixed(5);
						if(callback && typeof(callback) === 'function'){
							getAdressByLocation(pt,callback);
						}
					});

				});

			}
		});
	}
}

function getAdressByLocation(latlng,callback) {
    if (latlng) {
      geocoder.getLocations(latlng, function(addresses) {
        if(addresses.Status.code != 200) {
          console.log("reverse geocoder failed to find an address for " + latlng.toUrlValue());
        }
        else {
          address = addresses.Placemark[0];
          myHtml = address.address;
          console.log(myHtml);
          if(callback){
        	  callback(myHtml);
          }
          //map.openInfoWindow(latlng, myHtml);
        }
      });
    }
    
  }