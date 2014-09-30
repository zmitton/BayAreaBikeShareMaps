function Leg(googleLegObject){
  this.googleLegObject = googleLegObject;
  this.steps = [];
  this.tripTime = googleLegObject.duration.value;
  this.TARGET_TIME = 1500;
  this.MIN_BUFFER = 150;
  this.ON_Leg_DISTANCE = 0.001; // change to .001 longitude
  this.closestStations = [];
  this.stationsOnLeg = [];
  this.timeIntoLeg = 0;
  for(var i = 0 ; i < googleLegObject.steps.length; i++){
    var currentStep = new Step(googleLegObject.steps[i]);
    this.steps.push(currentStep);
    currentStep.startTime = this.timeIntoLeg;
    currentStep.endTime = this.timeIntoLeg + currentStep.duration;
    this.timeIntoLeg += currentStep.duration;
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
  var leg_index = 2; //hard coded the bike Leg for now
  var stationsOnLeg = this.findStationsOnLeg(leg_index);
  stationsOnLeg = stationsOnLeg.sort(function(a,b){return parseFloat(b[2]) - parseFloat(b[2])}); //2 is check-in time // decendingorder
  // for (var i = 0 ; i < stationsOnLeg.length ; i++ ){
  //   makeTempMarker(Station.find(stationsOnLeg[i][0]).latitude, Station.find(stationsOnLeg[i][0]).longitude, Math.round(stationsOnLeg[i][1] * 10));
  //   // console.log(this.idealCheckinEndTime());
  //   // console.log(this.idealCheckinStartTime());
  // }
  for (var i = 0 ; i < stationsOnLeg.length ; i++ ){
    if( this.inIdealTime(stationsOnLeg[i][2]) ){
      // return stationsOnLeg[i][0]; //returns stationId
    }
  }
  return this.closestStationWithinIdealTime(leg_index);
}

Leg.prototype.findStationsOnLeg = function(leg_index){
  var stations = [];
  var stationsByDistance = this.stationsByDistance(leg_index);
  for (var i = 0 ; i < stationsByDistance.length ; i++ ){
    if(stationsByDistance[i][1] <= this.ON_Leg_DISTANCE){
      stations.push(stationsByDistance[i]);
    }
  }
  return stations
}

Leg.prototype.stationsByDistance = function(leg_index){
  var stations = [];
  for (var i = 0 ; i < window.bikeStations.length ; i++ ){
    stations.push(this.shortestDistanceFromStationToLeg(window.bikeStations[i]));
  }
  // debugger;
  stations = stations.sort(function(a,b){return parseFloat(a[1]) - parseFloat(b[1])}); // 1 is distance from Leg //assendingoreder
  // for (var i = 0 ; i < 25 ; i++ ){
  //   makeTempMarker(Station.find(stations[i][0]).latitude, Station.find(stations[i][0]).longitude, i);
  // }
  return stations //2darray of form [[closeststationid, distancefromLeg, checkinTime],[nextclosestid, distancefromLeg, checkinTime],...]
}

Leg.prototype.shortestDistanceFromStationToLeg = function(station){
  var shortestSoFar = 10000;
  for (var i = 0 ; i < this.steps.length ; i++ ){
    var point = Leg.closestPointOnStep(this.steps[i], station.longitude, station.latitude);
    var distance = Math.sqrt(Math.pow((point[0] - station.longitude), 2) + Math.pow((point[1] - station.latitude), 2));
    if(distance < shortestSoFar){
      shortestSoFar = distance;
      var step = this.steps[i];
    }
  }
  var stationToBeginningOfStepXSqrd = Math.pow((step.x1 - station.longitude), 2);
  var stationToBeginningOfStepYSqrd = Math.pow((step.y1 - station.latitude), 2);
  var stationToBeginningOfStep = Math.sqrt(stationToBeginningOfStepXSqrd + stationToBeginningOfStepYSqrd);
  var stepDistance = Math.sqrt(Math.pow((step.x1 - step.x2), 2) + Math.pow((step.y1 - step.y2), 2));

  // debugger;

  var checkinTime = (step.duration * stationToBeginningOfStep)/stepDistance;
  return [station.station_id, shortestSoFar, checkinTime + step.startTime]
}

Leg.closestPointOnStep = function(step, x1, y1){
  var distance;
  var perpLineM = (1.0/(step.m())) * (-1);
  var perpLineB = y1 - (perpLineM * x1);
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
  return (time <= this.idealCheckinEndTime() && time >= this.idealCheckinStartTime())
}

Leg.prototype.closestStationWithinIdealTime = function(leg_index){

  var stationsByDistance = this.stationsByDistance(leg_index);
  var stationsBycheckintimes = stationsByDistance//.sort(function(a,b){return parseFloat(a[2]) - parseFloat(b[2])});// sorted by checkin times
  for (var i = 0 ; i < stationsBycheckintimes.length ; i++ ){
    if(this.inIdealTime(stationsBycheckintimes[i][2])){
      return stationsBycheckintimes[i][0] //returns the id
    }
  }
  return "Leg not found" // return the first one in inIdealRange() //else return "Leg not found"
}


