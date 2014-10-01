describe("Map", function() {
  var map;

  beforeEach(function() {
    map = new Map;
    map.route = new Route;

    startStation = { Station id: 30301, station_id: 5, name: "State St & Harrison St", available_docks: 7, total_docks: 19, latitude: #<BigDecimal:7fa878c533c0,'0.4187395806 29E2',27(27)>, longitude: #<BigDecimal:7fa878c52e70,'-0.8762773948 589999E2',27(27)>, status_value: "In Service", status_key: 1, available_bikes: 11, intersection: "State St & Harrison St", intersection_2: "", city: "", postal_code: "", location: "620 S. State St.", altitude: nil, test_station: false, last_communication_time: nil, landmark: "030" }

    endStation = { Station id: 30302, station_id: 13, name: "Wilton Ave & Diversey Pkwy", available_docks: 6, total_docks: 19, latitude: #<BigDecimal:7fa878cf82f8,'0.4193250008E2',18(27)>, longitude: #<BigDecimal:7fa878cf8028,'-0.8765268082E2',18(27)>, status_value: "In Service", status_key: 1, available_bikes: 13, intersection: "Wilton Ave & Diversey Pkwy", intersection_2: "", city: "Chicago", postal_code: "", location: "2790 N.Wilton Ave", altitude: nil, test_station: false, last_communication_time: nil, landmark: "066" }

    start_location = { lat: 41.8896848, lng: -87.6377502 }
    end_location = { lat: 41.95742, lng: -87.65271 }

    station_objects = { startStation, endStation }

    var response = { start_location, end_location, startStation, endStation, station_objects };

  });

  describe("createRoute", function() {
    it("should create a route based on a start and end station", function() {
      expect(map.createRoute(response)).
    });


  });

  // describe("addMarker", function(){
  //   it("should increment markers when called", function() {
  //     map.addMarker().to
  //     expect(map.route.markers).toEqual(0);
  //   });
  // });
});
