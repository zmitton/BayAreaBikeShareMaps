function Leg(googleLegObject){
  this.googleLegObject = googleLegObject;
  this.steps = [];
  this.tripTime = googleLegObject.duration.value;
  this.TARGET_TIME = 1500;
  this.MIN_BUFFER = 150;
  this.ON_ROUTE_DISTANCE = 0.005; // change to .001 longitude
  this.closestStations = [];
  this.stationsOnRoute = [];
  this.timeIntoRoute = 0;
  for(var i = 0 ; i < googleLegObject.steps.length; i++){
    currentStep = new Step(googleLegObject.steps[i]);
    this.steps.push(currentStep);
    currentStep.startTime = this.timeIntoRoute;
    currentStep.endTime = this.timeIntoRoute + currentStep.duration;
    this.timeIntoRoute += currentStep.duration;
  }
}

Leg.prototype.addStepsFromResponse = function(response){
  //loops through and adds all the steps to this leg
}

Leg.prototype.maxTargetTime = function(){return this.TARGET_TIME + this.MIN_BUFFER};
Leg.prototype.minTargetTime = function(){return this.TARGET_TIME - this.MIN_BUFFER};
Leg.prototype.extraTime = function(){return this.maxTargetTime() * (this.numCheckins() + 1) - this.tripTime};
Leg.prototype.averageExtraTimeBetweenStops = function(){return this.extraTime()/(this.numCheckins()+1)};
Leg.prototype.numCheckins = function(){return Math.floor(((this.tripTime/ this.TARGET_TIME)))};
Leg.prototype.midpointOfNextCheckinTime = function(){return this.tripTime/(this.numCheckins() + 1 )};
Leg.prototype.idealCheckinStartTime = function(){return this.midpointOfNextCheckinTime() - (this.averageExtraTimeBetweenStops()/2)};
Leg.prototype.idealCheckinEndTime = function(){return this.midpointOfNextCheckinTime() + (this.averageExtraTimeBetweenStops()/2)};

Leg.prototype.findNextCheckinStation = function(leg_index){
  var leg_index = 2; //hard coded the bike route for now
  var stationsOnRoute = this.findStationsOnRoute(leg_index);
  debugger;
  stationsOnRoute = stationsOnLeg.sort(function(a,b){return parseFloat(b[2]) - parseFloat(b[2])}); //2 is check-in time // decendingorder
  for (var i = 0 ; i < stationsOnLeg.length ; i++ ){
    if(stationsOnRoute[i][1] <= this.idealCheckinEndTime() && stationsOnRoute[i][1] >= this.idealCheckinStartTime() ){
      return stationsOnRoute[i][0]; //returns stationId
    }
  }
  return this.closestStationWithinIdeaTime(leg_index);
}

Leg.prototype.findStationsOnRoute = function(leg_index){
  var stations = [];
  var stationsByDistance = this.stationsByDistance(leg_index);
  for (var i = 0 ; i < stationsByDistance.length ; i++ ){
    if(stationsByDistance[i][1] <= this.ON_ROUTE_DISTANCE){
      stations.push(stationsByDistance[i]);
    }
  }
  return stations
}

Leg.prototype.stationsByDistance = function(leg_index){
  var stations = [];
  for (var i = 0 ; i < window.bikeStations.length ; i++ ){
    stations.push(this.shortestDistanceFromStationToRoute(window.bikeStations[i]));
  }
  stations = stations.sort(function(a,b){return parseFloat(a[1]) - parseFloat(b[1])}); // 1 is distance from route //assendingoreder
  return stations //2darray of form [[closeststationid, distancefromroute, checkinTime],[nextclosestid, distancefromroute, checkinTime],...]
}

Leg.prototype.shortestDistanceFromStationToRoute = function(station){
  var shortestSoFar = 10000;
  for (var i = 0 ; i < this.steps.length ; i++ ){
    var point = Leg.closestPointOnStep(this.steps[i], station.longitude, station.latitude);
    var distance = Math.sqrt(Math.pow((point[0] - station.longitude), 2) + Math.pow((point[1] - station.latitude), 2));
    if(distance < shortestSoFar){
      shortestSoFar = distance;
      var step = this.steps[i];
    }
  }
  debugger;
  var checkinTime = ((Math.sqrt(Math.pow((step.x1 - station.longitude), 2) + Math.pow((step.y1 - station.latitude), 2)))/distance)*step.duration;
  return [distance, checkinTime + step.startTime]
}

Leg.closestPointOnStep = function(step, x1, y1){
  var distance;
  var perpLineM = (1.0/(step.m())) * (-1);
  var perpLineB = y1 - (perpLineM * x1);
  // debugger;
  var xintersect = (step.b() - perpLineB)/(perpLineM - step.m())
  var yintersect = step.m() * xintersect + step.b();
  if(yintersect > step.northPoint()[1]){
    return step.northPoint()
  }
  else if(yintersect <= step.southPoint()[1]){
    return step.southPoint() //[x,y]
  }
  else{
    return [xintersect, yintersect]
  }
};

Leg.prototype.inIdealTime = function(time){
  return (time > this.idealCheckinStartTime && time < this.idealCheckinEndTime)
  //true if ideal time is within idealCheckinStartTime and idealCheckinEndTime
}

Leg.prototype.closestStationWithinIdeaTime = function(leg_index){

  var stationsByDistance = this.stationsByDistance(leg_index);
  var stationsBycheckintimes = stationsByDistance.sort(function(a,b){return parseFloat(a[2]) - parseFloat(b[2])});// sorted by checkin times
  for (var i = 0 ; i < stationsBycheckintimes.length ; i++ ){
    if(inIdealTime(stationsBycheckintimes[i][2])){
      return stationsBycheckintimes[i][0] //returns the id
    }
  }
  return "route not found" // return the first one in inIdealRange() //else return "route not found"
}


