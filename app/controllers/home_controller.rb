class HomeController < ApplicationController
respond_to :json

  def index
    @stations = Station.all
    @start_location = ""
    @end_location = ""
  end

  def search
    if params[:start_location] != "Current location"
      @start_location = "#{params[:start_location]} Chicago, IL"
      @start_location_coords = GoogleApi.get_coordinates_from_address(@start_location)
    else params[:start_latitude] != "" && params[:start_longitude] != ""
      @start_location_coords = {"lat" => params[:start_latitude].to_d, "lng" => params[:start_longitude].to_d}
    end
    @end_location = "#{params[:end_location]} Chicago, IL"
    @end_location_coords = GoogleApi.get_coordinates_from_address(@end_location)

    # Finds three closest stations to start and end
    three_closest_start = Station.find_three(@start_location_coords["lat"], @start_location_coords["lng"], @end_location_coords["lat"], @end_location_coords["lng"], "bikes")
    three_closest_end = Station.find_three(@end_location_coords["lat"], @end_location_coords["lng"], @start_location_coords["lat"], @start_location_coords["lng"], "docks")
    # Uses Google Directions Matrix to find the total time from start to end points and returns an array of hashes sorted from shortest time to longest
    optimal_start_and_end = GoogleApi.get_optimal_route(three_closest_start, three_closest_end, @start_location_coords, @end_location_coords)
    # Finds the station object for the first start station returned by the above array, which has the shortest route time
    @closest_start_station = Station.find(optimal_start_and_end[0][:start_station])
    @closest_end_station = Station.find(optimal_start_and_end[0][:end_station])
    # Returns a hash of the latitude and longitude of the start and end stations
    @closest_start_coords = Station.get_coords_of_station(@closest_start_station)
    @closest_end_coords = Station.get_coords_of_station(@closest_end_station)


    #Original methodology that finds closest stations to start and end.
    # @closest_start_station = Station.find_closest_to(@start_location_coords["lat"], @start_location_coords["lng"])
    # @closest_start_coords = Station.get_coords_of_station(@closest_start_station)

    # @closest_end_station = Station.find_closest_to(@end_location_coords["lat"], @end_location_coords["lng"])
    # @closest_end_coords = Station.get_coords_of_station(@closest_end_station)


    @stations = [@closest_start_station, @closest_end_station]

    coords_hash = {start_location: @start_location_coords, end_location: @end_location_coords, start_station: @closest_start_coords, end_station: @closest_end_coords, station_objects: @stations, start_station_object: @closest_start_station, end_station_object: @closest_end_station}
    respond_with coords_hash

  end

end
