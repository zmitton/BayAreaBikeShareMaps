function Map() {
  this.stationMarkers = [];
  this.latitude = 41.8896848;
  this.longitude = -87.6377502;
  this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  this.zoom = 12;
  this.map = new google.maps.Map(document.getElementById('map-canvas'),{ zoom: this.zoom, center: this.latlng, mapTypeControl: false, mapTypeId: google.maps.MapTypeId.ROADMAP, scale: 2});
  this.currentLatitude;
  this.currentLongitude;
  this.route = new Route;
};

Map.prototype.fitBoundsOfMarkers = function() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < this.route.markers.length; i++) {
    bounds.extend(this.route.markers[i].marker.getPosition());
  }
  this.map.fitBounds(bounds);
};

Map.prototype.zoomToCurrentLocation = function() {
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

  now = new Date();
  stationUpdateTime = new Date(window.bikeStations[0].updated_at);
  differenceInMilliseconds = now - stationUpdateTime;
  differenceInMinutes = Math.round(((differenceInMilliseconds % 86400000) % 3600000) / 60000);

  if ( differenceInMinutes > 1 ) { // it is out of date
    console.log("data is old");

    var stationsRequest = Station.fetchAll();

    stationsRequest.done(function(response) {
      window.bikeStations = response;
      this.makeStationMarkers(response, type);
      this.placeAllMarkers(this.stationMarkers);
    }.bind(this));
  } else {
    currentStationData = window.bikeStations;
    this.makeStationMarkers(currentStationData, type);
    this.placeAllMarkers(this.stationMarkers);
  }
};

Map.prototype.bindEvents = function() {
  $(".zoom_to_current").on("click", function() {
    event.preventDefault;
    this.zoomToCurrentLocation();
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
    this.deleteMarkers(this.route.markers);
    this.route.tripTime = 0;
    this.route.bikeTime = 0;
    this.route.bikeDistance = 0;
    this.route.legs = []; //reset legs
    request = $.ajax("/search", {"method": "get", "data": $(".search-form").serialize()});
    request.done(this.createRoute.bind(this));
  }.bind(this));
};

// Map.prototype.renderRoute = function(markers, zoom, response) {
//   this.placeAllMarkers(markers);
//   this.fitBoundsOfMarkers();
//   this.map.setZoom(zoom);
//   this.renderPrimaryDirections(response);
// };

Map.prototype.createRoute = function(response) {
  this.route.routeStations = {start: response.start_station_object, end: response.end_station_object}
  this.addMarker(response.start_location.lat, response.start_location.lng, "Start", Marker.createLocationIcon("Start"), this.route.markers);
  this.addMarker(response.start_station.lat, response.start_station.lng, "Pick-up Station", Marker.createDivvyIcon("2EB8E6", "Pick up"), this.route.markers);
  this.addMarker(response.end_station.lat, response.end_station.lng, "Drop-off Station", Marker.createDivvyIcon("2EB8E6", "Drop off"), this.route.markers);
  this.addMarker(response.end_location.lat, response.end_location.lng, "Destination", Marker.createLocationIcon("End"), this.route.markers);

  // this.renderRoute(this.route.markers, this.map.getZoom(), response);

  this.placeAllMarkers(this.route.markers);
  this.fitBoundsOfMarkers();
  this.map.setZoom(this.map.getZoom());
  this.renderPrimaryDirections(response);
}

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
      var availables = station.available_bikes;
    }
  else {
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
        this.handleRoute(response, index);
        this.route.setSummary(response);
        this.route.directionsDisplays[index].setDirections(response);
        this.route.directionsDisplays[index].setPanel(document.getElementById('directions-panel-' + index));
        if ($('#directions-panel-1').html() === "") {
          $('#directions-panel-1').prepend('Pickup: ' + this.route.routeStations.start.intersection);
        }
        if ($('#directions-panel-2').html() === "") {
          $('#directions-panel-2').prepend('Drop-off: ' + this.route. routeStations.end.intersection);
        }
        this.route.setDashedLines(response, this.map);
      }
    }.bind(this);
  }.bind(this);
  for(var j = 0 ; j < requests.length; j++){
    this.route.directionsService.route(requests[j], displayRouteWrapper(j));
  }
};

Map.prototype.renderPrimaryDirections = function(response){
  this.initialize();
  this.calcRoute();
};

Map.prototype.renderSecondaryDirections = function(response){
  this.initializeSecondary();
  this.calcSecondaryRoute();
};

Map.prototype.initializeSecondary = function(){
    var checkInStation = this.route.checkInStations[this.route.checkInStations.length -1];
    this.route.markers.splice(-2,0, new Marker(checkInStation.latitude, checkInStation.longitude, "checkin", Marker.createLocationIcon("checkin")));
    this.route.directionsDisplays.splice(-1,0, new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, suppressBicyclingLayer: true}));
    this.route.directionsDisplays[this.route.directionsDisplays.length-2].setMap(this.map);
};

Map.prototype.calcSecondaryRoute = function(){
  var request = {origin: this.route.markers[this.route.markers.length-2].marker.position,
                 destination: this.route.markers[this.route.markers.length-1].marker.position,
                 travelMode: google.maps.TravelMode["BICYCLING"]
                }
  var displaySecondaryRouteHandler = function(response) {
    if (status == google.maps.DirectionsStatus.OK) {
      var length = this.route.directionsDisplays.length;
      this.handleRoute(response);
      this.route.directionsDisplays[length-2].setDirections(response);
      $('directions-panel-' + length-1).id = 'directions-panel-' + length;
      $('<div id="directions-panel-' + length + '"></div>');
      this.route.directionsDisplays[length-2].setPanel(document.getElementById('directions-panel-' + length-2));
      this.route.legs.push(response.routes[0].legs[0]);
    }
  }
  this.route.directionsService.route(request, displaySecondaryRouteHandler);
};


Map.prototype.handleRoute = function(response, index){
  var nextCheckinStation;
  var nextCheckinStationId;
  // if(index == 0){this.route.legs.unshift(new Leg(response.routes[0].legs[0]));}
  // else if(index == 2){this.route.legs.push(new Leg(response.routes[0].legs[0]));}
  // else
    if(index == 1){
    var legIndex = this.route.legs.length;
    this.route.legs.splice(1,0, new Leg(response.routes[0].legs[0]));
    if (this.route.legs[legIndex].tripTime >= this.route.legs[legIndex].TARGET_TIME ){
      nextCheckinStationId = this.route.legs[legIndex].findNextCheckinStation(legIndex);
      nextCheckinStation = Station.find(nextCheckinStationId)
      this.route.checkInStations.push(nextCheckinStation);
      console.log("findNextCheckinStation found");
      console.log(nextCheckinStation);
      // makeTempMarker(nextCheckinStation.latitude, nextCheckinStation.longitude, nextCheckinStation.name)
      // this.deleteMarkers(this.route.markers); //untested
      this.renderSecondaryDirections();
    }
  }
};

Map.prototype.getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.showCurrentLocation);
  }
}

Map.prototype.showCurrentLocation = function(position) {
  $("input[name='start_location']").val("Current location");
  $("input[name='start_latitude']").val(position.coords.latitude);
  $("input[name='start_longitude']").val(position.coords.longitude);
  this.map.zoomToCurrentLocation();

  var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  var shellCircle = new google.maps.Circle({
      map: this.map.map,
      fillColor: '#73B9FF',
      fillOpacity: 1,
      center: userLatLng,
      strokeColor: '#000000'
  });

      shellCircle.setRadius(20);

}






