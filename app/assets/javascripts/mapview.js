// function initialize() {
// }
// google.maps.event.addDomListener(window, 'load', initialize);
$(document).ready(function() {
  var map;
  var markers = [];
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

      // setAllMap(map);
      fitBoundsOfMarkers();
      map.setZoom(map.getZoom()-1);
      renderAllDirections(response);
    });
  });
function renderAllDirections(response){
  var directionsDisplays = [];
  var directionsService = new google.maps.DirectionsService();

  // var map1;
  var startLatLng = new google.maps.LatLng(response.start_location.lat, response.start_location.lng);
  var stationStartLatLng = new google.maps.LatLng(response.start_station.lat, response.start_station.lng);
  var stationEndLatLng = new google.maps.LatLng(response.end_station.lat, response.end_station.lng);
  var endLatLng = new google.maps.LatLng(response.end_location.lat, response.end_location.lng);

  // var directionsDisplay2;
  // var directionsService2 = new google.maps.DirectionsService();
  // var map2;
  // var haight2 = new google.maps.LatLng(37.7699298, -121.9469157);
  // var oceanBeach2 = new google.maps.LatLng(37.7683909618184, -121.81089453697205);

  function initialize() {
    directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true}), new google.maps.DirectionsRenderer({preserveViewport: true}), new google.maps.DirectionsRenderer({preserveViewport: true})];
    // var mapOptions = {
    //   zoom: 10,
    //   center: haight1
    // };
    // map1 = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    for(var i = 0 ; i < directionsDisplays.length ; i ++){
      directionsDisplays[i].setMap(map);
    }
  }

  function calcRoute() {
    // var selectedMode = "BICYCLING";
    var requests = [
      {
        origin: startLatLng,
        destination: stationStartLatLng,
        travelMode: google.maps.TravelMode["WALKING"]
      },
      {
        origin: stationStartLatLng,
        destination: stationEndLatLng,
        travelMode: google.maps.TravelMode["BICYCLING"]
      },
      {
        origin: stationEndLatLng,
        destination: endLatLng,
        travelMode: google.maps.TravelMode["WALKING"]
      }
    ];

  var displayRouteWrapper = function(index) {
    var i = index;
    return function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log("from deep inside");
        directionsDisplays[index].setDirections(response);

        var leg = response.routes[ 0 ].legs[ 0 ];
        start = new google.maps.MarkerImage('https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|2EB8E6|13|b|12', new google.maps.Size( 44, 32 ), new google.maps.Point( 0, 0 ), new google.maps.Point( 13, 42 ))
        makeMarker( leg.start_location, start, "BEGIN" );

      }
    }
  }
    for(var j = 0 ; j < requests.length; j++){
      directionsService.route(requests[j], displayRouteWrapper(j));
    }
  }
  initialize();
  calcRoute();

}

function makeMarker( position, icon, title ) {
 new google.maps.Marker({
  position: position,
  map: map,
  icon: icon,
  title: title
 });
}



});







