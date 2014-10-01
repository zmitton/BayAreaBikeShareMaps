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
    bounds.extend(this.route.bikingLegs[i].endMarker.marker.getPosition());
  }
  for (var i = 0; i < this.route.walkingLegs.length; i++) {
    bounds.extend(this.route.walkingLegs[i].endMarker.marker.getPosition());
  }
  this.map.fitBounds(bounds);
};$("input[name='start_latitude']")


Map.prototype.zoomToCurrentLocation = function() {
  this.currentLatitude = $("input[name='start_latitude']").val();
  this.currentLongitude = $("input[name='start_longitude']").val();
  if(this.currentLatitude !== "" && this.currentLongitude !== "") {
    this.map.setCenter(new google.maps.LatLng(this.currentLatitude,this.currentLongitude));
    this.map.setZoom(15);
  }
};



Map.prototype.buttonBinder = function(event, type) {
  event.preventDefault();
  this.deleteStationMarkers();

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
      this.placeAllStationMarkers(this.stationMarkers);
    }.bind(this));
  } else {
    currentStationData = window.bikeStations;
    this.makeStationMarkers(currentStationData, type);
    this.placeAllStationMarkers(this.stationMarkers);
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
      this.deleteStationMarkers();
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
      this.deleteStationMarkers();
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
    this.clearRouteMarkers();
    this.clearDirections();
    this.route.bikingLegs = []; //reset legs
    this.route.walkingLegs = [];
    this.route.routeStations = [];

    this.deleteWalkingLines(this.route.walkingLines);
    // this.deleteMarkers(this.route.markers);
    // this.route.legs = []; //reset legs
    request = $.ajax("/search", {"method": "get", "data": $(".search-form").serialize()});
    request.done(function(response){
      this.route = new Route(response.start_location.lat, response.start_location.lng)
      this.route.routeStations = [response.start_station_object, response.end_station_object];
      var requests = this.createBaseRequests(response);
      this.fetchBaseRoute(requests);
    }.bind(this));
  }.bind(this));
};


Map.prototype.zoom = function(zoom) {
  zoom = typeof a !== 'undefined' ? zoom : 11;
};

Map.prototype.clearRouteMarkers = function(){
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
  else {
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

Map.prototype.placeAllStationMarkers = function(){
  for (var i = 0; i < this.stationMarkers.length; i++) {
    this.stationMarkers[i].marker.setMap(this.map);
  }
};

Map.prototype.deleteStationMarkers = function(){
  for (var i = 0; i < this.stationMarkers.length; i++) {
    this.stationMarkers[i].marker.setMap(null);
  }
  this.stationMarkers.splice(0, this.stationMarkers.length)
};

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
Map.prototype.deleteWalkingLines = function(walkingLines){
  for (var i = 0; i < walkingLines.length; i++) {
    walkingLines[i].setMap(null);
  }
  walkingLines.splice(0, walkingLines.length)
};

Map.prototype.initialize = function(){
  for(var i = 0 ; i < this.route.directionsDisplays.length ; i ++){
    this.route.directionsDisplays[i].setMap(this.map);
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
  this.route.bikingLegs.pop();
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
          this.route.bikingLegs.push(new Leg(response, {"markerTitle": "Drop-Off"}));
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
          this.route.bikingLegs.push(new Leg(response, {"markerTitle": "Drop-Off"}));
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
}

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
    this.route.markers.splice(-2,0, new Marker(checkInStation.latitude, checkInStation.longitude, "Check-In", Marker.createLocationIcon("Check-In")));
    this.route.directionsDisplays.splice(-1,0, new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, suppressBicyclingLayer: true}));
    this.route.directionsDisplays[this.route.directionsDisplays.length-2].setMap(this.map);
};

// Map.prototype.calcSecondaryRoute = function(){
//   var request = {origin: this.route.markers[this.route.markers.length-2].marker.position,
//                  destination: this.route.markers[this.route.markers.length-1].marker.position,
//                  travelMode: google.maps.TravelMode["BICYCLING"]
//                 }
//   var displaySecondaryRouteHandler = function(response) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       var length = this.route.directionsDisplays.length;
//       this.handleRoute(response);
//       this.route.directionsDisplays[length-2].setDirections(response);
//       $('directions-panel-' + length-1).id = 'directions-panel-' + length;
//       $('<div id="directions-panel-' + length + '"></div>');
//       this.route.directionsDisplays[length-2].setPanel(document.getElementById('directions-panel-' + length-2));
//       this.route.legs.push(response.routes[0].legs[0]);
//     }
//   }
// };


Map.prototype.handleBikeRoute = function(){
  var nextCheckinStation;
  var nextCheckinStationId;
  var legIndex = this.route.bikingLegs.length-1;
  if (this.route.bikingLegs[legIndex].tripTime >= this.route.bikingLegs[legIndex].TARGET_TIME ){
    nextCheckinStationId = this.route.bikingLegs[legIndex].findNextCheckinStation(legIndex);
    nextCheckinStation = Station.find(nextCheckinStationId);
    this.route.nextCheckinStation = nextCheckinStation;
    this.route.routeStations.splice(this.route.routeStations.length-1,0, nextCheckinStation);
    console.log("findNextCheckinStation found");
    console.log(nextCheckinStation);
    // makeTempMarker(nextCheckinStation.latitude, nextCheckinStation.longitude, nextCheckinStation.name)

    var requests = this.createSubsequentRequests();
    this.fetchSubsequentRoute(requests);
  }
  else{ //routes done.. base case.. display everything RENDER DIRECTIONS
    this.placeAllMarkers();
    this.fitBoundsOfMarkers();
    this.map.setZoom(this.map.getZoom());
    this.placeAllDirections();
    for(var i = 0 ; i < this.route.walkingLegs.length ; i++){
      this.route.setDashedLines(this.route.walkingLegs[i].response);
    }
    this.parseAndRenderDirections();
    this.setSummary();
  }
};
Map.prototype.parseAndRenderDirections = function(){
  var i = 0 ;
  var j = 0 ;
  var directionContainer = $('.directions-panel-container');
  directionContainer.empty();
  var $div = $('<div class="directions-panel-leg-container"></div>');
  $div.attr("id",'directions-panel-' + i);
  directionContainer.append($div);
  this.route.walkingLegs[i].directionsDisplay.setPanel(document.getElementById('directions-panel-' + i));
  i++;
  for(j ; j < this.route.bikingLegs.length ; j++){
    $div = $('<div  class="directions-panel-leg-container"></div>');
    $div.attr("id",'directions-panel-' + (i + j));
    directionContainer.append($div);
    this.route.bikingLegs[j].directionsDisplay.setPanel(document.getElementById('directions-panel-' + (j + i)));
  }
  $div = $('<div class="directions-panel-leg-container"></div>');
  directionContainer.append($div);
  $div.attr("id",'directions-panel-' + (i + j));
  this.route.walkingLegs[i].directionsDisplay.setPanel(document.getElementById('directions-panel-' + (i + j)));
}


Map.prototype.setSummary = function(response) {
  if ($(window).width() > 480) {
    $('.summary').show();
  } else {
    $('.summary').hide();
  }
  $('.summary').empty();
  var numStations = this.route.routeStations.length;
  var summaryContainer = $(".summary")

  var tripTime = 0;
  var bikingTime = 0;
  var bikingDistance = 0;
  var leg;
  for(var i = 0; i < this.route.bikingLegs.length; i++) {
    leg = this.route.bikingLegs[i].response.routes[0].legs[0];
    bikingTime += (leg.duration.value / 60)
    bikingDistance += (leg.distance.value / 1609.344)
  }
  for(var i = 0; i < this.route.walkingLegs.length; i++) {
    tripTime += (this.route.walkingLegs[i].response.routes[0].legs[0].duration.value/60)
  }

  $tripTimeDiv = '<div class="trip_time"> Total Trip: <span id="trip_time">'+ parseInt(tripTime) +' </span> min</div>'
  $bikingDiv = '<div class="biking"><span id="bike"><i class="fa fa-bicycle"></span></i> <span id="biking_time">'+ parseInt(bikingTime)+'</span> min <span id="biking_distance">'+bikingDistance.toFixed(1)+'</span> miles </div>'
  summaryContainer.append($tripTimeDiv);
  summaryContainer.append($bikingDiv);

  var $startDiv = $('<div class="station_summary">Pickup: <span class="station_intersection">'+ this.route.routeStations[0].intersection +'</span> <span class="station_data"><span class="availables">'+ this.route.routeStations[0].available_docks +'</span> bikes</span></div>')
  summaryContainer.append($startDiv);
  for(var i = 1; i < (numStations - 1); i++) {
    var $div = $('<div class="station_summary">Check-In: <span class="station_intersection">'+ this.route.routeStations[i].intersection +'</span> <span class="station_data"><span class="availables">'+ this.route.routeStations[i].available_docks +'</span> docks</span></div>')
    summaryContainer.append($div);
  }
  var $endDiv = $('<div class="station_summary">Drop-Off: <span class="station_intersection">'+ this.route.routeStations[numStations -1].intersection +'</span> <span class="station_data"><span class="availables">'+ this.route.routeStations[numStations -1].available_docks +'</span> docks</span></div>')


  summaryContainer.append($endDiv);

}

Map.prototype.getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.showCurrentLocation);
  }
};

Map.prototype.showCurrentLocation = function(position) {
  $("input[name='start_location']").val("Current location");
  $("input[name='start_latitude']").val(position.coords.latitude);
  $("input[name='start_longitude']").val(position.coords.longitude);
  this.map.zoomToCurrentLocation();
  var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var shellCircle = new google.maps.Circle({
      map: this.map.map,
      fillColor: '#3db7e4',
      fillOpacity: 1,
      center: userLatLng,
      strokeColor: '#3db7e4',
      strokeOpacity: .4
  });
  shellCircle.setRadius(20);
}




