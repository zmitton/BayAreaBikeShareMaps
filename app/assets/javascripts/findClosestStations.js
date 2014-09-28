function Route(){
  this.markers = [];
  this.directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true})];
  this.directionsService = new google.maps.DirectionsService();
  this.closestStations = [];
}
// Route.prototype.splitLargeBikeRoutes = function(response){
//   console.log(response);
//   console.log(this);
//   if (response.routes[0].legs[0].duration.value > 1500 && response.nc.travelMode == "BICYCLING") {
//     this.getCheckInStation(response, stations);
//   }

// };

// Route.prototype.getCheckInStation = function(response, stations) {
//   var responseDuration = response.routes[0].legs[0].duration.value;
//   //for each step in the route, check total time as of that step
//   //and see if it falls in the checkintime window
//   var steps = response.routes[0].legs[0].steps;
//   var max = 1500;
//   var min = responseDuration - max;

//   var timeIntoRoute = 0;

//   var stepsLength = steps.length;
//   for(var i = 0; i < stepsLength; i++) {
//     if (timeIntoRoute < max) {
//       timeIntoRoute += steps[i].duration.value;
//       if (timeIntoRoute >= min) {
//         getCoords(steps[i], i, timeIntoRoute, max, min);
//       }
//     }
//   }
//   topThreeStations(coordsCheckInWindow, stations);
// };
