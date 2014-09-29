function Map() {
  this.stationMarkers = [];
  this.latitude = 41.8896848;
  this.longitude = -87.6377502;
  this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  this.zoom = 12;
  this.map = new google.maps.Map(document.getElementById('map-canvas'),{ zoom: this.zoom, center: this.latlng, mapTypeControl: false, scrollwheel: false, mapTypeId: google.maps.MapTypeId.ROADMAP, scale: 2});
  this.currentLatitude;
  this.currentLongitude;
  this.route = new Route;
}



Map.prototype.fitBoundsOfMarkers = function() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < this.route.markers.length; i++) {
    bounds.extend(this.route.markers[i].marker.getPosition());
  }
  this.map.fitBounds(bounds);
};

Map.prototype.zoomToCurrentLocation = function(event) {
  event.preventDefault;
  this.currentLatitude = $("input[name='start_latitude']").val();
  this.currentLongitude = $("input[name='start_longitude']").val();
  if(this.currentLatitude != "" && this.currentLongitude != "") {
    this.map.setCenter(new google.maps.LatLng(this.currentLatitude,this.currentLongitude));
    this.map.setZoom(15);
  }
}

Map.prototype.addMarker = function(lat, lng, title, icon, markers) {
  markers.push(new Marker(lat, lng, title, icon));
};


Map.prototype.buttonBinder = function(event, type) {
  event.preventDefault();
  this.deleteMarkers(this.stationMarkers);

  request = $.ajax("/stations", {"method": "get"});
  request.done(function(response) {
    this.makeStationMarkers(response, type);
    this.placeAllMarkers(this.stationMarkers);
    // var mc = new MarkerClusterer(this.map, this.stationMarkers, {gridSize: 50, maxZoom: 15 });
    // setStationsMap(this.map)
  }.bind(this));
};

Map.prototype.bindEvents = function() {
  $(".zoom_to_current").on("click", function() {
    this.zoomToCurrentLocation(event);
  }.bind(this));

  $("#bikes").on("click", function(event) {
    this.buttonBinder(event,"Bikes");
  }.bind(this));

  $("#docks").on("click", function(event) {
    this.buttonBinder(event, "Docks");
  }.bind(this));
  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    this.deleteMarkers(this.route.markers);

    request = $.ajax("/search", {"method": "get", "data": $(".search-form").serialize()});
    request.done(function(response) {
      this.route.routeStations = {start: response.start_station_object, end: response.end_station_object}
      this.addMarker(response.start_location.lat, response.start_location.lng, "Start", Marker.createLocationIcon("Start"), this.route.markers);
      // this.makeStationMarker(response.start_station, "bikes")
      // this.makeStationMarker(response.end_station, "docks")
      this.addMarker(response.start_station.lat, response.start_station.lng, "Start Station", Marker.createDivvyIcon("2EB8E6", "Pick up"), this.route.markers);
      this.addMarker(response.end_station.lat, response.end_station.lng, "End Station", Marker.createDivvyIcon("2EB8E6", "Drop off"), this.route.markers);
      this.addMarker(response.end_location.lat, response.end_location.lng, "End", Marker.createLocationIcon("End"), this.route.markers);
      this.placeAllMarkers(this.route.markers);

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
  if(type == "Bikes"){
      var availables = station.available_bikes
    }
  else{
    var availables = station.available_docks;
  }
  var lat = parseFloat(station.latitude),
  lng = parseFloat(station.longitude),
  iconColor = Marker.getIconColor(availables),
  icon = Marker.createDivvyIcon(iconColor, availables);
  this.stationMarkers.push(new Marker(lat, lng, station.location, icon));
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
  for(var i = 0 ; i < this.route.directionsDisplays.length ; i ++){
    this.route.directionsDisplays[i].setMap(this.map);
  }
};

Map.prototype.requests = function() {
  return [{
    origin: this.route.markers[0].marker.position,
    destination: this.route.markers[1].marker.position,
    travelMode: google.maps.TravelMode["WALKING"]
  },
  {
    origin: this.route.markers[1].marker.position,
    destination: this.route.markers[2].marker.position,
    travelMode: google.maps.TravelMode["BICYCLING"]
  },
  {
    origin: this.route.markers[2].marker.position,
    destination: this.route.markers[3].marker.position,
    travelMode: google.maps.TravelMode["WALKING"]
  }];
};

Map.prototype.calcRoute = function(){
  var requests = this.requests();
  var displayRouteWrapper = function(index) {
    var i = index;
    return function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {

        this.handleRoute(response);
        this.route.setSummary(response)
        this.route.directionsDisplays[index].setDirections(response);
        this.route.directionsDisplays[index].setPanel(document.getElementById('directions-panel-' + index));
        this.route.setDashedLines(response, this.map);
      }
    }.bind(this);
  }.bind(this);
  for(var j = 0 ; j < requests.length; j++){
    this.route.directionsService.route(requests[j], displayRouteWrapper(j));
  }
};


Map.prototype.renderAllDirections = function(response){
  this.initialize();
  this.calcRoute();
};

Map.prototype.handleRoute = function(response){
  // this.route.splitLargeBikeRoutes();
};

