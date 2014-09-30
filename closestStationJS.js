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
    })

  })

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
          // console.log("from deep inside");
          directionsDisplays[index].setDirections(response);

        if (response.routes[0].legs[0].duration.value > 1500) {

          var getCheckInStation = function(response) {
            var responseDuration = response.routes[0].legs[0].duration.value / 60
            //for each step in the route, check total time as of that step
            //and see if it falls in the checkintime window
            var steps = response.routes[0].legs[0].steps;
            var max = 1500 / 60;
            var min = responseDuration - max;

            var timeIntoRoute = 0;

            // var coordsCheckInWindow = [];

            var stepsLength = steps.length;
            for(var i = 0; i < stepsLength; i++) {
              if (timeIntoRoute < max) {
                timeIntoRoute += steps[i].duration.value;
                if (timeIntoRoute >= min) {
                  getCoords(steps[i], timeIntoRoute, max, min);
                }
              }
            }
          };
          var getDistance = function(endLat, endLng, startLat, startLng) {
            var xDistance = Math.abs(endLat - startLat);
            var yDistance = Math.abs(endLng - startLng);
            distanceSqrd = Math.pow(xDistance, 2) + Math.pow(yDistance, 2);
            return Math.sqrt(distanceSqrd);
          }
          var coordsCheckInWindow = [];
          var getCoords = function(step, timeIntoRoute, max, min) {
            //distance of step and divide it by step.duration.value
            //to get a coord for every minute along the step
            var endLat = step.end_location.k;
            var endLng = step.end_location.B;
            var startLat = step.start_location.k;
            var startLng = step.start_location.B;
            var distance = getDistance(endLat, endLng, startLat, startLng)
            var stepMinutes = step.duration.value/60
            var xDistance = endLat - startLat;
            var yDistance = endLng - startLng;
            var xDistancePerMinute = xDistance / stepMinutes
            var yDistancePerMinute = yDistance / stepMinutes
            //loop through each minute of the step.
            //if minute < min, don't do anything
            //if minute > max, don't do anything
            //get coordinates of step at that minute and put in an array
            var startMinuteOfStep = (timeIntoRoute) - stepMinutes;
            // var oneMinuteIncrements = distance / stepMinutes
            var x = startLat;
            var y = startLng;
            for(var minute = startMinuteOfStep; minute < timeIntoRoute; minute++) {
              x += xDistancePerMinute;
              y += yDistancePerMinute;

              if (minute > min && minute < max) {
                coordsCheckInWindow.push([x, y]);
              }
            }

          }
          getCheckInStation(response);
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
