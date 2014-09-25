// function initialize() {
// }
// google.maps.event.addDomListener(window, 'load', initialize);



// function initialize() {
//   getlatlng();
//   getMarker();
//   renderMap();
// }



$(document).ready(function() {
  var map;
  var zoom = 11
  var latitude = 41.8896848
  var longitude = -87.6377502
  var latlng = new google.maps.LatLng(latitude, longitude);

  var getlatlng = function(lat, lng){
    return new google.maps.LatLng(lat, lng);
  };

  var mapOptions = {
    zoom: zoom,
    center: latlng
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  var markerMaker = function(lat, lng, title) {
    return new google.maps.Marker({
      position: getlatlng(lat, lng),
      map: map,
      title: title
    });
  }

  var fitBoundsOfMarkers = function(start, end) {
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
  }

  $(".form").on("submit", function(event) {
    event.preventDefault();
    var markers = [];
    request = $.ajax("/search", {"method": "get", "data": $(this).serialize()})
    request.done(function(response) {

      s_latitude = response.start_location.lat
      s_longitude = response.start_location.lng

      e_latitude = response.end_location.lat
      e_longitude = response.end_location.lng

      var marker1 = markerMaker(s_latitude, s_longitude, "Start");
      var marker2 = markerMaker(e_latitude, e_longitude, "End");
      debugger;
      fitBoundsOfMarkers(getlatlng(s_latitude, s_longitude),getlatlng(e_latitude, e_longitude)); // eventually create loop to extend bounds for all markers
    });

  });

})
