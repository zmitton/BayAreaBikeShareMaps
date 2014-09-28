function Station() {
  this.something = "something";
}
Station.fetch_all_live_data = function(){
  request = $.ajax("http://www.divvybikes.com/stations/json", {"method": "get"});
    request.done(function(response) {
      console.log(response);
    });
};
Station.all = function(){
  request = $.ajax("/stations", {"method": "get"});
    request.done(function(response) {
      Station.parse_server_response(response);
      // console.log(response);
    });
};

