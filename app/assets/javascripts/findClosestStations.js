function Route(){
  this.markers = [];
  this.directionsDisplays = [new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, polylineOptions: {
    strokeOpacity: 0}}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, suppressBicyclingLayer: true}), new google.maps.DirectionsRenderer({preserveViewport: true, suppressMarkers: true, polylineOptions: {strokeOpacity: 0}})];
  this.directionsService = new google.maps.DirectionsService();
  this.reponses = [];
  this.legs = [];
  this.checkinStations = [];
  this.TARGET_TIME = 25;
  this.MIN_BUFFER = 2.5;
  this.ON_ROUTE_DISTANCE = .001;
  this.closestStations = [];
  this.stationsOnRoute = [];
  this.tripTime;
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

Route.prototype.maxTargetTime = function(){return this.TARGET_TIME + this.MIN_BUFFER};
Route.prototype.minTargetTime = function(){return this.TARGET_TIME - this.MIN_BUFFER};
Route.prototype.extraTime = function(){return this.maxTargetTime() * (this.numCheckins() + 1) - this.tripTime};
Route.prototype.averageExtraTimeBetweenStops = function(){return this.extraTime()/(this.numCheckins()+1)};
Route.prototype.numCheckins = function(){return Math.floor(((this.tripTime/ this.TARGET_TIME)))};
Route.prototype.midpointOfNextCheckinTime = function(){return this.tripTime/(this.numCheckins() + 1 )};
Route.prototype.idealCheckinStartTime = function(){return this.midpointOfNextCheckinTime() - (this.averageExtraTimeBetweenStops()/2)};
Route.prototype.idealCheckinEndTime = function(){return this.midpointOfNextCheckinTime() + (this.averageExtraTimeBetweenStops()/2)};

Route.prototype.findNextStation = function(leg_index){
  var leg_index = 2 //hard coded the bike route for now
  var stationsOnRoute = this.stationsOnRoute(leg_index);
  stationsOnRoute = stationsOnRoute.sort(function(a,b){return parseFloat(b[2]) - parseFloat(b[2])}); //2 is check-in time // decendingorder
  for (var i = 0 ; i < stationsOnRoute.length ; i++ ){
    if(stationsOnRoute[i][1] <= this.idealCheckinEndTime() && stationsOnRoute[i][1] >= this.idealCheckinStartTime() ){
      return stationsOnRoute[i][0]; //returns stationId 
    }
  }   
  return this.closestStationWithinIdeaTime(leg_index);
}

Route.prototype.stationsOnRoute = function(leg_index){
  var stations = [];
  var stationsByDistance = this.stationsByDistance(leg_index);
  for (var i = 0 ; i < stationsByDistance.length ; i++ ){
    if(stationsByDistance[i][1] <= this.ON_ROUTE_DISTANCE){
      stations.push(stationsByDistance[i]);
    }
  }  
  return stations
}

Route.prototype.stationsByDistance = function(leg_index){
  var stations = [];
  for (var i = 0 ; i < window.bikeStations.length ; i++ ){
    stations.push(Route.shortestDistanceFromPointToRoute(window.bikeStations[i]), leg_index);
  }
  stations = stations.sort(function(a,b){return parseFloat(a[1]) - parseFloat(b[1])}); // 1 is distance from route //assendingoreder
  return stations //2darray of form [[closeststationid, distancefromroute, checkinTime],[nextclosestid, distancefromroute, checkinTime],...]
}

Route.shortestDistanceFromPointToRoute = function(station, leg_index){
  var shortestSoFar;
  for (var i = 0 ; i < this.legs[leg_index].steps.length ; i++ ){
    var step = this.legs[leg_index].steps[i];
    var point = Route.closestPointOnStep(step, station.longitude, station.latitude);
    var distance = Math.sqrt(Math.pow((point[0] - station.longitude)) + Math.pow((point[1] - station.latitude)));
    if(distance < shortestSoFar){
      shortestSoFar = distance; 
    }
  }
  var checkinTime = ((Math.sqrt(Math.pow((step.x1 - station.longitude)) + Math.pow((step.y1 - station.latitude))))/distance)*step.durration();
  return [distance,checkinTime]
}

Route.closestPointOnStep = function(step, x1, y1){
 var distance;
 var purpLineM = (1.0/(step.m())) * (-1);
 var purpLineB = y1 - (purpLineM * x1);
 var xintersect = (step.b() - purpLineB)/(purpLineM - step.m())
 var yintersect = step.m() * xintersect + step.b();
 if(yintersect > step.northPoint()[1]){
  // distance = step.shortestDistanceToAnEnd(xintersect, yintersect);
  return step.northPoint()
 }
 else if(yintersect <= step.southPoint()[1]){
  // distance = step.shortestDistanceToAnEnd(xintersect, yintersect);
  return step.southPoint() //[x,y]
 }
 else{

 }
 //if station is east of the east point of orig line, 
 //its outside of scope 
 //check the slop of a line made from a station to an endpointa. if its 
 //retrns the purp point [3,2]
}

Route.prototype.inIdealTime = function(time){
  return (time > this.idealCheckinStartTime && time < this.idealCheckinEndTime)
  //true if ideal time is within idealCheckinStartTime and idealCheckinEndTime
}

Route.prototype.closestStationWithinIdeaTime = function(leg_index){

  var stationsByDistance = this.stationsByDistance(leg_index);
  var stationsBycheckintimes = stationsByDistance.sort(function(a,b){return parseFloat(a[2]) - parseFloat(b[2])});// sorted by checkin times
  for (var i = 0 ; i < stationsBycheckintimes.length ; i++ ){
    if(inIdealTime(stationsBycheckintimes[i][2])){
      return stationsBycheckintimes[i][0] //returns the id
    }
  }
  return "route not found" // return the first one in inIdealRange() //else return "route not found"
}

// // Route.prototype.findDistanceToStation = function(x,y){
// //   //for distancefrompointtoline for each line segment and return the lowest value;
// // }


















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
