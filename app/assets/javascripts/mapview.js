// function MapView() {
//   this.map = new Map("arg");
// }
Map.prototype.getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.showCurrentLocation);
  }
}
Map.prototype.showCurrentLocation = function(position) {
  $("input[name='start_location']").val("Current location");
  $("input[name='start_latitude']").val(position.coords.latitude);
  $("input[name='start_longitude']").val(position.coords.longitude);
}

// $(document).ready(function() {

//   var map = new Map("arg");
//   var stations = Station.all
//   map.bindEvents();

//   function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showCurrentLocation);
//     }
//   }

//   function showCurrentLocation(position) {
//     $("input[name='start_location']").val("Current location");
//     $("input[name='start_latitude']").val(position.coords.latitude);
//     $("input[name='start_longitude']").val(position.coords.longitude);
//   }

//   getLocation();
// });
