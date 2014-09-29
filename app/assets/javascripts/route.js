function Route(){
  this.markers = [];
  this.directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, polylineOptions: {strokeOpacity: 0}}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, suppressBicyclingLayer: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, polylineOptions: {strokeOpacity: 0}})];
  this.directionsService = new google.maps.DirectionsService();
  this.reponses = [];
  this.legs = [];
  this.checkinStations = [];

}

Route.prototype.setDashedLines = function(response, map) {
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
      var line = new google.maps.Polyline({
        path: lineCoordinates,
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
        map: map
      });
    }
  }
};
