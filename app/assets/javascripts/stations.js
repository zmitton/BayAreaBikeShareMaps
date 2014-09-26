var stationMarkers = [];

var makeBikeMarkers = function(stations, map) {
  var length = stations.length
  for(var i = 0; i < length; i++) {
    var lat = parseFloat(stations[i].latitude),
    lng = parseFloat(stations[i].longitude),
    availBikes = stations[i].available_bikes,
    iconColor = getIconColor(availBikes),
    icon = createDivvyIcon(iconColor, availBikes);
    markerMaker(lat, lng, icon, map);
  }
};

var makeDockMarkers = function(stations, map) {
  var length = stations.length
  for(var i = 0; i < length; i++) {
    var lat = parseFloat(stations[i].latitude),
    lng = parseFloat(stations[i].longitude),
    availDocks = stations[i].available_docks,
    iconColor = getIconColor(availDocks),
    icon = createDivvyIcon(iconColor, availDocks);
    markerMaker(lat, lng, icon, map);
  }
};

var getlatlng = function(lat, lng){
    return new google.maps.LatLng(lat, lng);
  };

var markerMaker = function(lat, lng, icon, map) {
  var marker =  new google.maps.Marker({
    position: getlatlng(lat, lng),
    icon: icon,
  });
  stationMarkers.push(marker);
};

var getIconColor = function(number) {
  var color;
  if (number > 5) {
    color = "66FF33";
  }
  else if (number > 0) {
    color = "FFD119";
  }
  else if (number === 0) {
    color = "FF3333";
  }
  return color;
};

var createDivvyIcon = function(color, number){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|' + color + '|13|b|' + number;
};


var setStationsMap = function(map) {
  var length = stationMarkers.length
  for (var i = 0; i < length; i++) {
    stationMarkers[i].setMap(map);
  }
};

var clearStationMarkers = function() {
  setStationsMap(null);
};

var deleteStationMarkers = function() {
  clearStationMarkers();
  stationMarkers = [];
};

$(document).ready(function() {
  // var zoom = 11;
  // var latitude = 41.8896848;
  // var longitude = -87.6377502;
  // var latlng = new google.maps.LatLng(latitude, longitude);
  // var mapOptions = {
  //   zoom: zoom,
  //   center: latlng
  // };
  // map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);


  // $("#bikes").on("click", function(event) {
  //   event.preventDefault();

  //   request = $.ajax("/stations", {"method": "get"});
  //   request.done(function(response) {

  //     makeBikeMarkers(response);
  //     setAllMap(map);

  //   });

  // });

});
