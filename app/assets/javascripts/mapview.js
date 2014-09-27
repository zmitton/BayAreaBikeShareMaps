$(document).ready(function() {
  var map = new Map("arg");
  map.bindEvents();

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCurrentLocation);
    }
  }

  function showCurrentLocation(position) {
    $("input[name='start_location']").val("Current location");
    $("input[name='start_latitude']").val(position.coords.latitude)
    $("input[name='start_longitude']").val(position.coords.longitude)
  }

  getLocation();
});
