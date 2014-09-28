function Map() {
  this.markers = [];
  this.stationMarkers = [];
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
Map.prototype.addMarker = function(lat, lng, title, icon, markers) {
  markers.push(new Marker(lat, lng, title, icon));
};
Map.prototype.bindEvents = function() {
  $("#bikes").on("click", function(event) {
    event.preventDefault();
    this.deleteMarkers(this.stationMarkers);

    request = $.ajax("/stations", {"method": "get"});
    request.done(function(response) {

      this.makeStationMarkers(response, "bikes");
      this.placeAllMarkers(this.stationMarkers);
      // setStationsMap(this.map)
    }.bind(this));
  }.bind(this));
  $("#docks").on("click", function(event) {
    event.preventDefault();
    this.deleteMarkers(this.stationMarkers);


    request = $.ajax("/stations", {"method": "get"});
    request.done(function(response) {
      this.makeStationMarkers(response, "docks");
      this.placeAllMarkers(this.stationMarkers);
      // setStationsMap(this.map)
    }.bind(this));
  }.bind(this));
  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    this.deleteMarkers(this.markers);

    request = $.ajax("/search", {"method": "get", "data": $(".search-form").serialize()});
    request.done(function(response) {

      this.addMarker(response.start_location.lat, response.start_location.lng, "Start", Marker.createLocationIcon("Start"), this.markers);
      // this.makeStationMarker(response.start_station, "bikes")
      // this.makeStationMarker(response.end_station, "docks")
      this.addMarker(response.start_station.lat, response.start_station.lng, "Start Station", Marker.createDivvyIcon("2EB8E6", "Pick up"), this.markers);
      this.addMarker(response.end_station.lat, response.end_station.lng, "End Station", Marker.createDivvyIcon("2EB8E6", "Drop off"), this.markers);
      this.addMarker(response.end_location.lat, response.end_location.lng, "End", Marker.createLocationIcon("End"), this.markers);
      this.placeAllMarkers(this.markers);

      this.fitBoundsOfMarkers();
      this.map.setZoom(this.map.getZoom());
      this.renderAllDirections(response);
    }.bind(this));
  }.bind(this));
};
Map.prototype.zoom = function(zoom) {
  zoom = typeof a !== 'undefined' ? zoom : 11;
};

Map.prototype.clearMarkers = function(markers){
  for (var i = 0; i < markers.length; i++) {
    markers[i].marker.setMap(null);
  }

};

Map.prototype.makeStationMarkers = function(stations, type) {
  for(var i = 0; i <  stations.length; i++) {
    this.makeStationMarker(stations[i], type)
  }
};

Map.prototype.makeStationMarker = function(station, type) {
  if(type == "bikes"){
      var availables = station.available_bikes
    }
  else{
    var availables = station.available_docks;
  }
  var lat = parseFloat(station.latitude),
  lng = parseFloat(station.longitude),
  iconColor = Marker.getIconColor(availables),
  icon = Marker.createDivvyIcon(iconColor, availables);
  this.stationMarkers.push(new Marker(lat, lng, "available" + type, icon));
}

Map.prototype.placeAllMarkers = function(markers){
  for (var i = 0; i < markers.length; i++) {
    markers[i].marker.setMap(this.map);
  }
};
Map.prototype.deleteMarkers = function(markers){
  this.clearMarkers(markers);
  markers.splice(0, markers.length)
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
        this.directionsDisplays[index].setPanel(document.getElementById('directions-panel-' + index));
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

