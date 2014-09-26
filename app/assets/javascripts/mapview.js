// function initialize() {
// }
// google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function() {
  var map;
  var markers = [];
  var zoom = 12;
  var zoom = 11;
  var latitude = 41.8896848;
  var longitude = -87.6377502;
  var latlng = new google.maps.LatLng(latitude, longitude);
  var getlatlng = function(lat, lng){
    return new google.maps.LatLng(lat, lng);
  };

  var mapOptions = {
    zoom: zoom,
    center: latlng
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

  var markerMaker = function(lat, lng, title) {
    var marker =  new google.maps.Marker({
      position: getlatlng(lat, lng),
      title: title
    });
    markers.push(marker);
  };

    var clearMarkers = function() {
      setAllMap(null);
    }

    var deleteMarkers = function() {
      clearMarkers();
      markers = [];
    }

    var setAllMap = function(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    };

    var fitBoundsOfMarkers = function() {
      var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
      map.fitBounds(bounds);
    };

  $(".form").on("submit", function(event) {
    event.preventDefault();
    clearMarkers();
    deleteMarkers();

    request = $.ajax("/search", {"method": "get", "data": $(this).serialize()});
    request.done(function(response) {
      var marker1 = markerMaker(response.start_location.lat, response.start_location.lng, "Start");
      var marker2 = markerMaker(response.end_location.lat, response.end_location.lng, "End");
      var station1 = markerMaker(response.start_station.lat, response.start_station.lng, "Start Station");
      var station2 = markerMaker(response.end_station.lat, response.end_station.lng, "End Station");

      setAllMap(map);
      fitBoundsOfMarkers();
      map.setZoom(map.getZoom()-1);
    });
  });
});






  var directionsDisplays = [];
  var directionsService1 = new google.maps.DirectionsService();
  var map1;
  var haight1 = new google.maps.LatLng(37.7699298, -122.4469157);
  var oceanBeach1 = new google.maps.LatLng(37.7683909618184, -122.51089453697205);

  var directionsDisplay2;
  var directionsService2 = new google.maps.DirectionsService();
  var map2;
  var haight2 = new google.maps.LatLng(37.7699298, -121.9469157);
  var oceanBeach2 = new google.maps.LatLng(37.7683909618184, -121.81089453697205);





  function initialize() {
    directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true}), new google.maps.DirectionsRenderer({preserveViewport: true})]
    var mapOptions = {
      zoom: 10,
      center: haight1
    };
    map1 = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    for(var i = 0 ; i < directionsDisplays.length ; i ++){
      directionsDisplays[i].setMap(map1);
    }
  }





  function calcRoute() {
    var selectedMode = "BICYCLING";
    var requests = [
      {
        origin: haight1,
        destination: oceanBeach1,
        travelMode: google.maps.TravelMode[selectedMode]
      },
      {
        origin: haight2,
        destination: oceanBeach2,
        travelMode: google.maps.TravelMode[selectedMode]
      }
    ];

  var displayRouteWrapper = function(index) {
    var i = index;
    return function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplays[index].setDirections(response);
      }
    }
  }
    for(var j = 0 ; j < requests.length; j++){
      console.log("from outside" + j);
      directionsService1.route(requests[j], displayRouteWrapper(j));
    }
  }


