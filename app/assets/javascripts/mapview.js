var map;

function initialize() {
  var zoom = 11
  var latitude = 41.8896848
  var longitude = -87.6377502

  var mapOptions = {
    zoom: zoom,
    center: new google.maps.LatLng(latitude, longitude)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
