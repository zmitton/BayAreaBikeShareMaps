function Route(startingLat, startingLng){
  this.directionsService = new google.maps.DirectionsService();
  this.tripTime = 0;
  this.startMarker = new Marker(startingLat, startingLng, "Start", Marker.createLocationIcon("Start"));
  this.nextCheckinStation;
  this.bikingLegs = [];
  this.walkingLegs = [];
  this.bikeTime = 0;
  this.bikeDistance = 0;
  this.walkingLines = [];
}

Route.prototype.setDashedLines = function(response) {
  if (response.nc.travelMode == "WALKING") {
    var lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      strokeOpacity: 1,
      scale: 4,
      strokeColor: '#73B9FF'
    };
    var steps = response.routes[0].legs[0].steps;
    for(var i = 0; i < steps.length; i++) {
      var lineCoordinates = [steps[i].start_location, steps[i].end_location];
      var walkingLine = new google.maps.Polyline({
        path: lineCoordinates,
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
        map: map.map
      });
      this.walkingLines.push(walkingLine);
    }
  };
};

Route.prototype.setSummary = function(response) {
  if ($(window).width() > 480) {
    $('.summary').show();
  } else {
    $('.summary').hide();
  }
  $("#start_station_intersection").html(this.routeStations.start.intersection);
  $("#end_station_intersection").html(this.routeStations.end.intersection);
  $(".start_station_bikes").html(this.routeStations.start.available_bikes);
  $(".end_station_docks").html(this.routeStations.start.available_docks);
  $("#trip_time").html(this.tripTime += Math.round(response.routes[0].bikingLegs[0].duration.value / 60));
  if(response.nc.travelMode == "BICYCLING") {
    $("#biking_time").html(this.bikeTime += Math.round(response.routes[0].bikingLegs[0].duration.value / 60));
    $("#biking_distance").html(this.bikeDistance += parseInt((response.routes[0].bikingLegs[0].distance.value / 1609.344).toFixed(1)));
  }
}

