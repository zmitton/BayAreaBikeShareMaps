function Map() {
  this.markers = [];
  this.latitude = 41.8896848;
  this.longitude = -87.6377502;
  this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  this.zoom = 11
  this.map = new google.maps.Map(document.getElementById('map-canvas'),{ zoom: this.zoom, center: this.latlng });
}
Map.prototype.fitBoundsOfMarkers = function() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < this.markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }
  this.map.fitBounds(bounds);
};
Map.prototype.addMarker = function(lat, lng, title, icon) {
  this.markers.push(new Marker(lat, lng, title, icon));
};
Map.prototype.bindEvents = function() {
  $("#bikes").on("click", function(event) {
    event.preventDefault();
    clearStationMarkers();
    deleteStationMarkers();

    request = $.ajax("/stations", {"method": "get"});
    request.done(function(response) {

      makeBikeMarkers(response, map);
      setStationsMap(map);
    });
  });
  $("#docks").on("click", function(event) {
    event.preventDefault();
    clearStationMarkers();
    deleteStationMarkers();

    request = $.ajax("/stations", {"method": "get"});
    request.done(function(response) {

      makeDockMarkers(response, map);
      setStationsMap(map);
    });
  }); 
  $(".form").on("submit", function(event) {
    event.preventDefault();
    this.clearMarkers();
    this.deleteMarkers();

    request = $.ajax("/search", {"method": "get", "data": $(this).serialize()});
    request.done(function(response) {

      var marker1 = markerMaker(response.start_location.lat, response.start_location.lng, "Start", Marker.createLocationIcon("Start"));
      var marker2 = markerMaker(response.end_location.lat, response.end_location.lng, "End", Marker.createLocationIcon("End"));
      var station1 = markerMaker(response.start_station.lat, response.start_station.lng, "Start Station", Marker.createDivvyIcon());
      var station2 = markerMaker(response.end_station.lat, response.end_station.lng, "End Station", Marker.createDivvyIcon());
      this.placeAllMarkers(this.map);

      // setAllMap(map);
      this.fitBoundsOfMarkers();
      this.map.setZoom(this.map.getZoom()-1);
      this.renderAllDirections(response);
    }.bind(this));
  }.bind(this));   
}
Map.prototype.zoom = function(zoom) {
  zoom = typeof a !== 'undefined' ? zoom : 11;
  //actually call the zooming function here
}

Map.prototype.getlatlng = function(lat, lng){
  return new google.maps.LatLng(lat, lng);
};
Map.prototype.clearMarkers = function(){
  this.placeAllMarkers(null);
}
Map.prototype.placeAllMarkers = function(){
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(this.map);
  }
};
Map.prototype.deleteMarkers = function(){
  this.clearMarkers();
  this.markers = [];
};











