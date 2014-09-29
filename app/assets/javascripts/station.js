function Station() {
  this.something = "something";
}
Station.fetchAllLiveData = function(){
  request = $.ajax("http://www.divvybikes.com/stations/json", {"method": "get"});
    request.done(function(response) {
      console.log(response);
    });
};
Station.fetchAll = function(){
  request = $.ajax("/stations", {"method": "get"});
    request.done(function(response) {
      Station.parse_server_response(response);
      // console.log(response);
    });
};

Station.find = function(id){
  for (var i = 0 ; i < window.bikeStations.length ; i++ ){
    if(window.bikeStations[i].id == id){
      return window.bikeStations[i];
    }
  }
};