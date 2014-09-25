var map;

function initialize() {
// if user input lat long, then latitude = input and longitude = input,
// otherwise lat and long equal defaults
  var zoom = 11
  var latitude = 41.8896848
  var longitude = -87.6377502

  var latlng = new google.maps.LatLng(latitude, longitude)

  var mapOptions = {
    zoom: zoom,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);


  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: 'Dev Bootcamp'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);



$(document).ready(function() {

  $(".form").on("submit", function(event) {
    event.preventDefault();
    request = $.ajax("/search", {"method": "get", "data": $(this).serialize() })
    request.done(function(response) {

      s_latitude = response.start_location.lat
      s_longitude = response.start_location.lng

      e_latitude = response.end_location.lat
      e_longitude = response.end_location.lng

    start_latlng = new google.maps.LatLng(s_latitude, s_longitude)
    end_latlng = new google.maps.LatLng(e_latitude, e_longitude)

    })
  });

})
