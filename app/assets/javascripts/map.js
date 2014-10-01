function Map(lat,lng) {
  this.stationMarkers = [];
  this.latitude = 41.8896848;
  this.longitude = -87.6377502;
  this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  this.zoom = 12;
  this.map = new google.maps.Map(document.getElementById('map-canvas'),{ zoom: this.zoom, center: this.latlng, mapTypeControl: false, mapTypeId: google.maps.MapTypeId.ROADMAP, scale: 2});
  this.currentLatitude;
  this.currentLongitude;
  this.route = new Route(lat,lng);
};

Map.prototype.fitBoundsOfMarkers = function() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < this.route.bikingLegs.length; i++) {
    bounds.extend(this.route.bikingLegs.marker.marker.getPosition());
  }
  this.map.fitBounds(bounds);
};

Map.prototype.zoomToCurrentLocation = function(event) {
  event.preventDefault();
  this.currentLatitude = $("input[name='start_latitude']").val();
  this.currentLongitude = $("input[name='start_longitude']").val();
  if(this.currentLatitude !== "" && this.currentLongitude !== "") {
    this.map.setCenter(new google.maps.LatLng(this.currentLatitude,this.currentLongitude));
    this.map.setZoom(15);
  }
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
    var $bikeButton = $("#bikes");
    event.preventDefault();
    if ($bikeButton.val() == "Hide Bikes") {
      this.deleteMarkers(this.stationMarkers);
      $bikeButton.val("Bikes");
    } else if ($("#docks").val() == "Hide Docks") {
      $("#docks").val("Docks");
      $bikeButton.val('Hide Bikes');
      this.buttonBinder(event,"Bikes");
    } else {
      $bikeButton.val('Hide Bikes');
      this.buttonBinder(event,"Bikes");
    }
  }.bind(this));

  $("#docks").on("click", function(event) {
    var $dockButton = $("#docks");
    event.preventDefault();
    if ($dockButton.val() == "Hide Docks"){
      this.deleteMarkers(this.stationMarkers);
      $dockButton.val("Docks");
    } else if ($("#bikes").val() == "Hide Bikes") {
      $("#bikes").val("Bikes");
      $dockButton.val("Hide Docks");
      this.buttonBinder(event, "Docks");
    } else {
      $dockButton.val("Hide Docks");
      this.buttonBinder(event, "Docks");
    }
  }.bind(this));

  $(".search-form").on("submit", function(event) {
    event.preventDefault();
    this.clearMarkers();
    this.clearDirections();
    this.route.bikingLegs = []; //reset legs

    // var requests = this.createRequests(getOrigin(), $('#destination').val())
    // this.fetchRoutes(requests);
    request = $.ajax("/search", {"method": "get", "data": $(".search-form").serialize()});
    request.done(function(response){
      this.route = new Route(response.start_location.lat, response.start_location.lng)
      var requests = this.createBaseRequests(response);
      this.fetchBaseRoute(requests);
    }.bind(this));
  }.bind(this));
};

Map.prototype.zoom = function(zoom) {
  zoom = typeof a !== 'undefined' ? zoom : 11;
};

Map.prototype.clearMarkers = function(){
  this.route.startMarker.marker.setMap(null);
  for (var i = 0; i < this.route.bikingLegs.length; i++) {
    this.route.bikingLegs[i].endMarker.marker.setMap(null);
  }
  for (var i = 0; i < this.route.walkingLegs.length; i++) {
    this.route.walkingLegs[i].endMarker.marker.setMap(null);
  }
};

Map.prototype.makeStationMarkers = function(stations, type) {
  for(var i = 0; i <  stations.length; i++) {
    this.makeStationMarker(stations[i], type);
  }
};

Map.prototype.makeStationMarker = function(station, type) {
  if(type == "Bikes"){
      var availables = station.available_bikes;
    }
  else{
    var availables = station.available_docks;
  }
  var lat = parseFloat(station.latitude),
  lng = parseFloat(station.longitude),
  iconColor = Marker.getIconColor(availables),
  icon = Marker.createDivvyIcon(iconColor, availables);
  this.stationMarkers.push(new Marker(lat, lng, station.location, icon));
};

Map.prototype.placeAllMarkers = function(){
  this.route.startMarker.marker.setMap(this.map);
  for (var i = 0; i < this.route.bikingLegs.length; i++) {
    this.route.bikingLegs[i].endMarker.marker.setMap(this.map);
  }
  for (var i = 0; i < this.route.walkingLegs.length; i++) {
    this.route.walkingLegs[i].endMarker.marker.setMap(this.map);
  }
};
// Map.prototype.deleteMarkers = function(){
//   // this.clearMarkers();
// };

Map.prototype.clearDirections = function(){
  for(var i = 0 ; i < this.route.bikingLegs.length ; i ++){
    this.route.bikingLegs[i].directionsDisplay.setMap(null);
  }
  for(var i = 0 ; i < this.route.walkingLegs.length ; i ++){
    this.route.walkingLegs[i].directionsDisplay.setMap(null);
  }
}

Map.prototype.placeAllDirections = function(){
  for(var i = 0 ; i < this.route.bikingLegs.length ; i ++){
    this.route.bikingLegs[i].directionsDisplay.setMap(null);
    this.route.bikingLegs[i].directionsDisplay.setDirections(this.route.bikingLegs[i].response);
    this.route.bikingLegs[i].directionsDisplay.setMap(this.map);
  }
  for(var i = 0 ; i < this.route.walkingLegs.length ; i ++){
    this.route.walkingLegs[i].directionsDisplay.setMap(null);
    this.route.walkingLegs[i].directionsDisplay.setDirections(this.route.walkingLegs[i].response);
    this.route.walkingLegs[i].directionsDisplay.setMap(this.map);
  }
};

Map.prototype.createBaseRequests = function(response) {
  return [{
    origin: new google.maps.LatLng(response.start_location.lat, response.start_location.lng),
    destination: new google.maps.LatLng(response.start_station.lat, response.start_station.lng),
    travelMode: google.maps.TravelMode["WALKING"]
  },
  {
    origin:new google.maps.LatLng(response.start_station.lat, response.start_station.lng),
    destination: new google.maps.LatLng(response.end_station.lat, response.end_station.lng),
    travelMode: google.maps.TravelMode["BICYCLING"]
  },
  {
    origin:  new google.maps.LatLng(response.end_station.lat, response.end_station.lng),
    destination:  new google.maps.LatLng(response.end_location.lat, response.end_location.lng),
    travelMode: google.maps.TravelMode["WALKING"]
  }];
};

Map.prototype.createSubsequentRequests = function() {
  var length = this.route.bikingLegs.length;
  if(length <= 1){var lastStation = this.route.walkingLegs[0].endMarker.marker.position}
  else{          var lastStation = this.route.bikingLegs[length-2].endMarker.marker.position;};
  var checkIn =  new google.maps.LatLng(this.route.nextCheckinStation.latitude, this.route.nextCheckinStation.longitude)//just found
  var dropOff = this.route.bikingLegs[length-1].endMarker.marker.position;
  this.route.bikingLegs.shift();
  return [{
    origin: lastStation,
    destination: checkIn,
    travelMode: google.maps.TravelMode["BICYCLING"]
  },
  {
    origin: checkIn,
    destination: dropOff,
    travelMode: google.maps.TravelMode["BICYCLING"]
  }];
};

Map.prototype.fetchBaseRoute = function(requests){
  var displayRouteWrapper = function(index) {
    var i = index;
    return function(response, status){
      if (status == google.maps.DirectionsStatus.OK){
        if ( index == 1 ){
          this.route.bikingLegs.push(new Leg(response, {"markerTitle": "DropOff"}));
        }
        else if( index == 0 ){this.route.walkingLegs.unshift(new Leg(response, {"walking": true, "markerTitle": "Pickup"}))}
        else if( index == 2 ){this.route.walkingLegs.push( new Leg(response, {"walking": true, "markerTitle": "End"}))};

        if(this.route.walkingLegs.length >= 2 && this.route.bikingLegs.length >=1){this.handleBikeRoute();}
      }
    }.bind(this);
  }.bind(this);
  for(var j = 0 ; j < requests.length; j++){
    this.route.directionsService.route(requests[j], displayRouteWrapper(j));
  }
};

Map.prototype.fetchSubsequentRoute = function(requests){
  var displayRouteWrapper = function(index, length) {
    var l = length;
    var i = index;
    return function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        if ( index == 0 ){
          this.route.bikingLegs.splice(l,0,new Leg(response, {}));
        }
        else if( index == 1 ){
          this.route.bikingLegs.push(new Leg(response, {"markerTitle": "DropOff"}));
        };
        if(this.route.bikingLegs.length == l+2){
          this.handleBikeRoute();
        }
      }
    }.bind(this);
  }.bind(this);
  for(var j = 0 ; j < requests.length; j++){
    this.route.directionsService.route(requests[j], displayRouteWrapper(j, this.route.bikingLegs.length));
  }
};


Map.prototype.handleBikeRoute = function(){
  var nextCheckinStation;
  var nextCheckinStationId;
  var legIndex = this.route.bikingLegs.length-1;
  if (this.route.bikingLegs[legIndex].tripTime >= this.route.bikingLegs[legIndex].TARGET_TIME ){
    nextCheckinStationId = this.route.bikingLegs[legIndex].findNextCheckinStation(legIndex);
    nextCheckinStation = Station.find(nextCheckinStationId);
    this.route.nextCheckinStation = nextCheckinStation;

    console.log("findNextCheckinStation found");
    console.log(nextCheckinStation);
    // makeTempMarker(nextCheckinStation.latitude, nextCheckinStation.longitude, nextCheckinStation.name)

    var requests = this.createSubsequentRequests();
    this.fetchSubsequentRoute(requests);
  }
  else{ //routes done.. base case.. display everything
    this.placeAllMarkers();
    this.placeAllDirections();
    //change name of last marker;
  }
};

Map.prototype.getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.showCurrentLocation);
  }
};

Map.prototype.showCurrentLocation = function(position) {
  $("input[name='start_location']").val("Current location");
  $("input[name='start_latitude']").val(position.coords.latitude);
  $("input[name='start_longitude']").val(position.coords.longitude);
};
