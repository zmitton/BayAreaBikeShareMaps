$(document).ready(function() {
  var map;
  var markers = [];
  var zoom = 11;
  var latitude = 41.8896848;
  var longitude = -87.6377502;

  var latlng = new google.maps.LatLng(latitude, longitude);
  var getlatlng = function(lat, lng){
    return new google.maps.LatLng(lat, lng);
  };
  var mapOptions = {
    zoom: zoom,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

  var createDivvyIcon = function(){
    return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|2EB8E6|13|b|12'
  }

  var createLocationIcon = function(location){
    return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.9|0|CCD3D3|13|b|' + location
  }
  var getStations = function() {
    return $.get("/stations");
  }

  var stationsRequest = getStations();

  stationsRequest.done(function(stations) {

    $("#bikes").on("click", function(event) {
      event.preventDefault();
      clearStationMarkers();
      deleteStationMarkers();
      makeBikeMarkers(stations, map);
      setStationsMap(map);
    });

    $("#docks").on("click", function(event) {
      event.preventDefault();
      clearStationMarkers();
      deleteStationMarkers();
      makeDockMarkers(stations, map);
      setStationsMap(map);
    });

    $("#clear").on("click", function(event) {
      event.preventDefault();
      clearStationMarkers();
      deleteStationMarkers();
    });

    var createMarkers = function(response) {
      var marker1 = markerMaker(response.start_location.lat, response.start_location.lng, "Start", createLocationIcon("Start"));
      var marker2 = markerMaker(response.end_location.lat, response.end_location.lng, "End", createLocationIcon("End"));
      var station1 = markerMaker(response.start_station.lat, response.start_station.lng, "Start Station", createDivvyIcon());
      var station2 = markerMaker(response.end_station.lat, response.end_station.lng, "End Station",createDivvyIcon());
    };


    var markerMaker = function(lat, lng, title, icon) {
      var marker =  new google.maps.Marker({
        position: getlatlng(lat, lng),
        icon: icon,
        title: title
      });
      markers.push(marker);
    };

    var clearMarkers = function() {
      setAllMap(null);
    };

    var deleteMarkers = function() {
      clearMarkers();
      markers = [];
    };

    var setAllMap = function(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    };

    var fitBoundsOfMarkers = function() {
      var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }
      map.fitBounds(bounds);
    };

    $(".form").on("submit", function(event) {
      event.preventDefault();
      clearMarkers();
      deleteMarkers();

      request = $.ajax("/search", {"method": "get", "data": $(this).serialize()});
      request.done(function(response) {

        createMarkers(response);
        setAllMap(map);
        fitBoundsOfMarkers();

        clearMarkers();
        deleteMarkers();

        map.setZoom(map.getZoom()-1);
        renderAllDirections(response);
      });
    });

    function renderAllDirections(response){
      var directionsDisplays = [];
      var directionsService = new google.maps.DirectionsService();

      // var map1;
      var startLatLng = new google.maps.LatLng(response.start_location.lat, response.start_location.lng);
      var stationStartLatLng = new google.maps.LatLng(response.start_station.lat, response.start_station.lng);
      var stationEndLatLng = new google.maps.LatLng(response.end_station.lat, response.end_station.lng);
      var endLatLng = new google.maps.LatLng(response.end_location.lat, response.end_location.lng);

      function initialize() {
        directionsDisplays = [
        new google.maps.DirectionsRenderer(
          {preserveViewport: true,
           polylineOptions: {strokeColor: "red"},
           // markerOptions: {icon: createLocationIcon("Start")}
         }),
        new google.maps.DirectionsRenderer(
          {preserveViewport: true,
           markerOptions: {visible: false}
          }),
        new google.maps.DirectionsRenderer({preserveViewport: true})];

        for(var i = 0 ; i < directionsDisplays.length ; i ++){
          directionsDisplays[i].setMap(map);
        }
      }

      function calcRoute() {
        var requests = [
          {
            origin: startLatLng,
            destination: stationStartLatLng,
            travelMode: google.maps.TravelMode["WALKING"]
          },
          {
            origin: stationStartLatLng,
            destination: stationEndLatLng,
            travelMode: google.maps.TravelMode["BICYCLING"]
          },
          {
            origin: stationEndLatLng,
            destination: endLatLng,
            travelMode: google.maps.TravelMode["WALKING"]
          }
        ];


      var displayRouteWrapper = function(index) {
        var i = index;

        return function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplays[index].setDirections(response);
            if (response.nc.travelMode == "BICYCLING") {
              if (response.routes[0].legs[0].duration.value > 1500) {
                getCheckInStation(response, stations);
              }
            }
          }
        };
      };
        for(var j = 0 ; j < requests.length; j++){
          directionsService.route(requests[j], displayRouteWrapper(j));
        }
      }
      initialize();
      calcRoute();
    }
  });

  function makeMarker( position, icon, title ) {
   new google.maps.Marker({
    position: position,
    map: map,
    icon: icon,
    title: title
   });
  }
});

var coordsCheckInWindow = [];

var getDistance = function(endLat, endLng, startLat, startLng) {
  var xDistance = Math.abs(endLat - startLat);
  var yDistance = Math.abs(endLng - startLng);
  distanceSqrd = Math.pow(xDistance, 2) + Math.pow(yDistance, 2);
  return Math.sqrt(distanceSqrd);
};

var getCoords = function(step, i, stepEndTime, max, min) {
  var endLat = step.end_location.k;
  var endLng = step.end_location.B;
  var startLat = step.start_location.k;
  var startLng = step.start_location.B;
  var distance = getDistance(endLat, endLng, startLat, startLng);

  var stepMinutes = step.duration.value / 60;
  var xDistance = endLat - startLat;
  var yDistance = endLng - startLng;
  var xDistancePerMinute = xDistance / stepMinutes;
  var yDistancePerMinute = yDistance / stepMinutes;
  var startMinuteOfStep = stepEndTime - stepMinutes;
  var x = startLat;
  var y = startLng;
  for(var minute = startMinuteOfStep; minute < stepEndTime; minute++) {
    x += xDistancePerMinute;
    y += yDistancePerMinute;
    if (minute > min && minute < max) {
      // console.log(i);
      // console.log(min);
      // console.log(max);
      // console.log(minute);
      coordsCheckInWindow.push({lat: x, lng: y});
    }
  }
};
var getPossibleCheckInStations = function(coordsCheckInWindow, stations) {
  var length = coordsCheckInWindow.length;
  console.log(length);
  for(var i = 0; i < length; i++) {
    num_stations = stations.length;
    findClosestStation(coordsCheckInWindow[i], stations);
  }
};

var possibleCheckInStations = [];

var getUniqueStations = function() {
  // console.log(possibleCheckInStations)
}

var checkInStation;

var topThreeStations = function(coordsCheckInWindow, stations) {
  getPossibleCheckInStations(coordsCheckInWindow, stations);
  var shortestDistance = possibleCheckInStations[0].distance
  var length = possibleCheckInStations.length;
  var checkInStation = possibleCheckInStations[0];
  for(var i = 0; i < length; i++) {
    if(possibleCheckInStations[i].distance < shortestDistance) {
      shortestDistance == possibleCheckInStations[i].distance;
      checkInStation == possibleCheckInStations[i];
    }
    //define shorestdistance with the first station in the array
    // for each station in the array
    // check if it's distance is smaller than the shortestDistance
      // if it is shorter, it becomes the new shortestDistance
      //else if it is longer, move on to the next station in the array
  }
};
console.log(checkInStation);


var findClosestStation = function(windowCoords, stations) {
  closestStation = {station: stations[0], distance: getDistance(windowCoords.lat, windowCoords.lng, stations[0].latitude, stations[0].longitude)};

  for(var i = 0; i < num_stations; i++) {
    var distanceToStation = getDistance(windowCoords.lat, windowCoords.lng, stations[i].latitude, stations[i].longitude);
    if (distanceToStation < closestStation.distance) {
      closestStation = {station: stations[i], distance: getDistance(windowCoords.lat, windowCoords.lng, stations[i].latitude, stations[i].longitude)};
    }
  };
  possibleCheckInStations.push(closestStation);
};

var getCheckInStation = function(response, stations) {
  var responseDuration = response.routes[0].legs[0].duration.value / 60;
  //for each step in the route, check total time as of that step
  //and see if it falls in the checkintime window
  var steps = response.routes[0].legs[0].steps;
  var max = 1500 / 60;
  var min = responseDuration - max;

  var timeIntoRoute = 0;

  var stepsLength = steps.length;
  for(var i = 0; i < stepsLength; i++) {
    if (timeIntoRoute < max) {
      timeIntoRoute += steps[i].duration.value / 60;
      if (timeIntoRoute >= min) {
        getCoords(steps[i], i, timeIntoRoute, max, min);
      }
    }
  }
  topThreeStations(coordsCheckInWindow, stations);
};







