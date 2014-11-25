function Marker(lat, lng, title, icon){
  this.marker = new google.maps.Marker({
    position: this.getlatlng(lat, lng),
    icon: icon,
    title: title
  });
}
Marker.createDivvyIcon = function(color, label){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|' + color + '|13|b|' + label;
};

Marker.createLocationIcon = function(label){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.9|0|CCD3D3|13|b|' + label;
};

Marker.getIconColor = function(number) {
  var color;
  if (number > 5) {
    color = "CCFF99";
  }
  else if (number > 0) {
    color = "FFFF66";
  }
  else if (number === 0) {
    color = "DE5959";
  }
  return color;
};

Marker.prototype.getlatlng = function(lat, lng){
  return new google.maps.LatLng(lat, lng);
};

function makeTempMarker(lat, lng, value){
  if (value == null ){value = 1;}
  var icon = Marker.createLocationIcon(value)
  var marker = new Marker(lat, lng, "", icon);
  marker.marker.setMap(window.map.map);
}

function makeHolidivvyMarker(lat, lng, label){
  var icon = 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.8|0|FF0000|10|_|' + label;
  return new Marker(lat, lng, "", icon);
  marker.marker.setMap(window.holidivvymap.map);
}
