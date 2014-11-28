function HoliDivvyMap(lat,lng) {
  this.latitude = 41.8896848;
  this.longitude = -87.6377502;
  this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  this.zoom = 12;
  this.map = new google.maps.Map(document.getElementById('map-canvas'),{ zoom: this.zoom, center: this.latlng, mapTypeControl: false, mapTypeId: google.maps.MapTypeId.ROADMAP, scale: 2});
  this.markers = [];
}

function getHolidivvyFromInstagram() {
  var divvyMap = holidivvymap.map;
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: "https://api.instagram.com/v1/tags/holidivvy/media/recent?client_id=560d622071e542b0a9bb9413df447fd6",
    success: function(response) {
      handleInstagrams(response.data, divvyMap) 
    }
  });
}

function handleInstagrams(instagrams, divvyMap) {
  var unixDate,
      dateObject,
      dateString,
      infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < instagrams.length; i++) {
    var unixDate = instagrams[i].created_time
    if(unixDate > 1413738096) {
      if(instagrams[i].location) {
        dateObject = new Date(unixDate*1000)
        dateString = (dateObject.getUTCMonth()+1) + "/" + dateObject.getDate();
        setMarkers(infowindow, instagrams[i], dateString, divvyMap);
      }
    };
  }
}


function setMarkers(infowindow, instagram, dateString, map) {
  lat = instagram.location.latitude
  lng = instagram.location.longitude
  var contentString = createContentString(instagram)
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map,
      icon: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.8|0|FF0000|10|_|' + dateString
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });
}

function createContentString(instagram) {
  var userName = instagram.user.username;
  var logo = '<img src="http://4.bp.blogspot.com/-BjUAshY1TTs/UYNzmJIEq8I/AAAAAAAAZco/oggG2vRTlUg/s1600/Instragram+logo+2013.png">';
  var logoPhoto = '<img src="https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-xpa1/t39.2365-6/851582_417171855069447_55288290_n.png">';
  var image = '<img src="'+ instagram.images.thumbnail.url +'">';
  var caption = '<p>' + instagram.caption.text + '</p>';
  var contentString = '<div class="infowindow"><div class="infowindow-header"><div class="user">' + logoPhoto +'<div class="username">'+userName +'</div></div></div><div class="infowindow-body">' + image + '</div><div class="infowindow-caption"' +caption +'</div></div>';
  return contentString;
}


Divvy: { var access_token="249341315.560d622.84f82de11ff74b328845eac12e6a771c"; var search="834818114134263326_31615560"}
