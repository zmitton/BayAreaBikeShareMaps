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
      console.log(response);
      return response;
    });
};

Station.find = function(id){
  for (var i = 0 ; i < window.bikeStations.length ; i++ ){
    if(window.bikeStations[i].station_id == id){
      return window.bikeStations[i];
    }
  }
};


Station.findBy = function(id){
  for (var i = 0 ; i < window.bikeStations.length ; i++ ){
    if(window.bikeStations[i].station_id == id){
      return window.bikeStations[i];
    }
  }
};
