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

Marker.prototype.getlatlng = function(lat, lng){
  return new google.maps.LatLng(lat, lng);
};


