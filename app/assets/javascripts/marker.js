function Marker(lat, lng, title, icon){
  this.marker = new google.maps.Marker({
    position: this.getlatlng(lat, lng),
    icon: icon,
    title: title
  });
}
Marker.createDivvyIcon = function(){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|2EB8E6|13|b|12'  
}

Marker.createLocationIcon = function(){
  return 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.9|0|CCD3D3|13|b|' + location
}
Marker.prototype.getlatlng = function(lat, lng){
  return new google.maps.LatLng(lat, lng);
};

