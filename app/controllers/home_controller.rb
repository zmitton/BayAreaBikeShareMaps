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


    @closest_start_station = Station.find_closest_to(@start_location_coords["lat"], @start_location_coords["lng"])

    @end_location = "#{params[:end_location]} Chicago, IL"
    @end_location_coords = GoogleApi.get_coordinates_from_address(@end_location)
    
    three_closest_start = Station.find_closest_three(@start_location_coords["lat"], @start_location_coords["lng"])
    three_closest_end = Station.find_closest_three(@end_location_coords["lat"], @end_location_coords["lng"])

    optimal_start_and_end = GoogleApi.get_optimal_route(three_closest_start, three_closest_end, @start_location_coords, @end_location_coords)

    @closest_start_coords = Station.get_coords_of_station(@closest_start_station)


    @closest_end_station = Station.find_closest_to(@end_location_coords["lat"], @end_location_coords["lng"])

    @closest_end_coords = Station.get_coords_of_station(@closest_end_station)

    @stations = [@closest_start_station, @closest_end_station]

    coords_hash = {start_location: @start_location_coords, end_location: @end_location_coords, start_station: @closest_start_coords, end_station: @closest_end_coords, station_objects: @stations, start_station_object: @closest_start_station, end_station_object: @closest_end_station}
    respond_with coords_hash

  end

end
