function Route(){
  this.markers = [];
  this.routeStations;
  this.directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, polylineOptions: {
    strokeOpacity: 0}}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, suppressBicyclingLayer: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, polylineOptions: {strokeOpacity: 0}})];
  this.directionsService = new google.maps.DirectionsService();
  this.checkinStations = [];
  this.TARGET_TIME = 25;
  this.MIN_BUFFER = 2.5;
  this.ON_ROUTE_DISTANCE = .001;
  this.closestStations = [];
  this.stationsOnRoute = [];
  this.tripTime = 0;
  this.bikeTime = 0;
  this.bikeDistance = 0;
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
  };
};

Route.prototype.setSummary = function(response) {
  $(".summary").css("display", "inline")
  $("#start_station_intersection").html(this.routeStations.start.intersection);
  $("#end_station_intersection").html(this.routeStations.end.intersection);
  $(".start_station_bikes").html(this.routeStations.start.available_bikes);
  $(".end_station_docks").html(this.routeStations.start.available_docks);
  $("#trip_time").html(this.tripTime += Math.round(response.routes[0].legs[0].duration.value / 60));
  if(response.nc.travelMode == "BICYCLING") {
    $("#biking_time").html(this.bikeTime += Math.round(response.routes[0].legs[0].duration.value / 60));
    $("#biking_distance").html(this.bikeDistance += parseInt((response.routes[0].legs[0].distance.value / 1609.344).toFixed(1)));
  }
}

Route.prototype.maxTargetTime = function(){return this.TARGET_TIME + this.MIN_BUFFER};
Route.prototype.minTargetTime = function(){return this.TARGET_TIME - this.MIN_BUFFER};
Route.prototype.extraTime = function(){return this.maxTargetTime() * (this.numCheckins() + 1) - this.tripTime};
Route.prototype.averageExtraTimeBetweenStops = function(){return this.extraTime()/(this.numCheckins()+1)};
Route.prototype.numCheckins = function(){return Math.floor(((this.tripTime/ this.TARGET_TIME)))};
Route.prototype.midpointOfNextCheckinTime = function(){return this.tripTime/(this.numCheckins() + 1 )};
Route.prototype.idealCheckinStartTime = function(){return this.midpointOfNextCheckinTime() - (this.averageExtraTimeBetweenStops()/2)};
Route.prototype.idealCheckinEndTime = function(){return this.midpointOfNextCheckinTime() + (this.averageExtraTimeBetweenStops()/2)};

Route.prototype.findNextStation = function(){
  var stationsOnRoute = this.stationsOnRoute();
  // loop through the stationsOnRoute IN REVERSE.
  //if any of them are inIdealTime(stationsOnRoute[i][2]). BOOM return that first one you find.
  //else return this.closestStationWithinIdeaTime
}

Route.prototype.stationsOnRoute = function(){
  // var stations = [];
  // var stationsByDistance = this.stationsByDistance();
  //return array of stations within this.ON_ROUTE_DISTANCE
}

Route.prototype.stationsByDistance = function(){
  //for each station run Route.distanceFromPointToRoute
  //return a sorted 2darray of form [[closeststationid, distancefromroute, checkinTime],[nextclosestid, distancefromroute, checkinTime],...]
}

Route.distanceFromPointToRoute = function(station){
 //for each segment
   //Math.closestPointOnSegment
   //var distance between station and segment (pythagor)
   //var checkintime is the distance from step beginpoint to station weighted by the total step time/distance       + step start time
 //reugular answer
 //return[distance,checkinTime]
}

Math.closestPointOnSegment = function(pointX, pointY, lineX1, lineY1, lineX2, lineY2){
 //make a line of purp slope.
 //find the a line that connects the station with the new line purpendicularly.
 //if station is east of the east point or orig line,
 //its outside of scope
 //check the slop of a line made from a station to an endpointa. if its
 //retrns the purp point [3,2]
}

Route.prototype.inIdealTime = function(time){
  //true if ideal time is within idealCheckinStartTime and idealCheckinEndTime
}

Route.prototype.closestStationWithinIdeaTime = function(){
  //var stationsByDistance = this.stationsByDistance();
  //var stationsBycheckintimes = stationsByDistance sorted by checkin times
  // loop through checkin times until
  // return the first one in inIdealRange()
  //else return "route not found"
}

// Route.prototype.findDistanceToStation = function(x,y){
//   //for distancefrompointtoline for each line segment and return the lowest value;
// }


















function logstuff(r){
  console.log("TIME:" + r.tripTime);
  console.log("maxtarget:" + r.maxTargetTime());
  console.log("minTargetTime:" + r.minTargetTime());
  console.log("extraTime" + r.extraTime());
  console.log("averageExtraTimeBetweenStops" + r.averageExtraTimeBetweenStops());
  console.log("numCheckins" + r.numCheckins());
  console.log("midpointOfNextCheckinTime" + r.midpointOfNextCheckinTime());
  console.log("idealCheckinStartTime" + r.idealCheckinStartTime());
  console.log("idealCheckinEndTime" + r.idealCheckinEndTime());
}

function go(){
  r = new Route;
  for (var i =1 ; i < 5 ; i++){
    r.tripTime = i*25 - .01
    logstuff(r);
    r.tripTime = i*25
    logstuff(r);
  }
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
