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


  Station.findDistancesFrom = function(lat, lng){
    stationDistances = []
    for(var i  = 0 ; i < window.bikeStations.length ; i++){
      if (bikeStations[i].available_bikes > 0){
        var tempArr = [bikeStations[i].station_id];
        var x_distance = Math.abs(bikeStations[i].latitude - lat)
        var y_distance = Math.abs(bikeStations[i].longitude - lng)
        var distance_sqrd = Math.pow(x_distance, 2) + Math.pow(y_distance, 2)
        var distance = Math.sqrt(distance_sqrd);
        tempArr.push(distance);
        stationDistances.push(tempArr);
      }
    }
    return stationDistances.sort(function(a,b){return parseFloat(a[1]) - parseFloat(b[1])});
  }

  Station.findClosestTo = function(lat, lng){
    return this.find(this.findDistancesFrom(lat, lng)[0][0]);
  }
