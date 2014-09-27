function Map() {
  this.markers = [];
  this.latitude = 41.8896848;
  this.longitude = -87.6377502;
  this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  this.zoom = 11;
  this.map = new google.maps.Map(document.getElementById('map-canvas'),{ zoom: this.zoom, center: this.latlng });
  this.directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true})];
  this.directionsService = new google.maps.DirectionsService();
}
Map.prototype.fitBoundsOfMarkers = function() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < this.markers.length; i++) {
    bounds.extend(this.markers[i].marker.getPosition());
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
  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    this.deleteMarkers();

    request = $.ajax("/search", {"method": "get", "data": $(".search-form").serialize()});
    request.done(function(response) {

      this.addMarker(response.start_location.lat, response.start_location.lng, "Start", Marker.createLocationIcon("Start"));
      this.addMarker(response.start_station.lat, response.start_station.lng, "Start Station", Marker.createDivvyIcon("Pick up"));
      this.addMarker(response.end_station.lat, response.end_station.lng, "End Station", Marker.createDivvyIcon("Drop off"));
      this.addMarker(response.end_location.lat, response.end_location.lng, "End", Marker.createLocationIcon("End"));
      this.placeAllMarkers(this.map);

      this.fitBoundsOfMarkers();
      this.map.setZoom(this.map.getZoom()-1);
      this.renderAllDirections(response);
    }.bind(this));
  }.bind(this));
};
Map.prototype.zoom = function(zoom) {
  zoom = typeof a !== 'undefined' ? zoom : 11;
};

Map.prototype.clearMarkers = function(){
  this.placeAllMarkers(null);

};
Map.prototype.placeAllMarkers = function(map){
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].marker.setMap(map);
  }
};
Map.prototype.deleteMarkers = function(){
  this.clearMarkers();
  this.markers = [];
};

Map.prototype.initialize = function(){
  for(var i = 0 ; i < this.directionsDisplays.length ; i ++){
    this.directionsDisplays[i].setMap(this.map);
  }
};

Map.prototype.requests = function() {
  return [{
    origin: this.markers[0].marker.position,
    destination: this.markers[1].marker.position,
    travelMode: google.maps.TravelMode["WALKING"]
  },
  {
    origin: this.markers[1].marker.position,
    destination: this.markers[2].marker.position,
    travelMode: google.maps.TravelMode["BICYCLING"]
  },
  {
    origin: this.markers[2].marker.position,
    destination: this.markers[3].marker.position,
    travelMode: google.maps.TravelMode["WALKING"]
  }];
};

Map.prototype.calcRoute = function(){
  var requests = this.requests();
  var displayRouteWrapper = function(index) {
    var i = index;
    return function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsDisplays[index].setDirections(response);
      }
    }.bind(this);
  }.bind(this);
  for(var j = 0 ; j < requests.length; j++){
    this.directionsService.route(requests[j], displayRouteWrapper(j));
  }
};

Map.prototype.renderAllDirections = function(response){
  this.initialize();
  this.calcRoute();
};

