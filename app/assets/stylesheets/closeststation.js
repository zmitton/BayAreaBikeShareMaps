var getDistance = function(endLat, endLng, startLat, startLng) {
  var x_distance = Math.abs(endLat - startLat);
  var y_distance = Math.abs(endLng - startLng);
  distanceSqrd = Math.pow(x_distance, 2) + Math.pow(y_distance, 2);
  return Math.sqrt(distance_sqrd);
}

var getCoords = function(step, timeIntoRoute) {
  //distance of step and divide it by step.duration.value
  //to get a coord for every minute along the step
  oneMinuteIncrements = step.distance / step.duration.value
  var endLat = step.end_location.k;
  var endLng = step.end_location.B;
  var startLat = step.start_location.k;
  var startLng = step.start_location.B;
  var distance = getDistance(endLat, endLng, startLat, startLng)

};

var getCheckInStation = function(response) {
  var responseDuration = response.routes[0].legs[0].duration.value
  //for each step in the route, check total time as of that step
  //and see if it falls in the checkintime window
  var steps = response.routes[0].legs[0].steps;
  var max = 1500;
  var min = responseDuration - max;

  var timeIntoRoute = 0;

  var coordsCheckInWindow = [];
  var stepsLength = steps.length;
  for(var i = 0; i < length; i++) {
    if (timeIntoRoute < max) {
      timeIntoRoute += steps[i].duration.value;
      if (timeIntoRoute >= min) {
        getCoords(steps[i], timeIntoRoute);
      }
    }
  }
};
