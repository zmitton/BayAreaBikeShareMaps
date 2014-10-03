function Route(startingLat, startingLng){
  this.directionsService = new google.maps.DirectionsService();
  this.startMarker = new Marker(startingLat, startingLng, "Start", Marker.createLocationIcon("Start"));
  this.nextCheckinStation;
  this.bikingLegs = [];
  this.walkingLegs = [];
  this.walkingLines = [];
  this.routeStations = [];
}

Route.prototype.setDashedLines = function(response) {
  if (response.oc.travelMode == "WALKING") {
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

