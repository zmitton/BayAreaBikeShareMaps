function Marker(lat, lng, title, icon){
  this.marker = new google.maps.Marker({
    position: this.getlatlng(lat, lng),
    icon: icon,
    title: title
  });
}
Marker.createDivvyIcon = function(label){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|2EB8E6|13|b|' + label;
};

Marker.createLocationIcon = function(label){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.9|0|CCD3D3|13|b|' + label;
};
Marker.prototype.getlatlng = function(lat, lng){
  return new google.maps.LatLng(lat, lng);
};

