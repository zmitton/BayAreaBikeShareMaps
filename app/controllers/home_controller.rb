class HomeController < ApplicationController
respond_to :json

	def index
    @stations = Station.all
    @start_location = ""
    @end_location = ""
	end

  def search
    @start_location = "#{params[:start_location]} + Chicago, IL"
    @end_location = "#{params[:end_location]} + Chicago, IL"

    if @start_location && @end_location
      @start_location_coords = GoogleApi.get_coordinates_from_address(@start_location)
      @end_location_coords = GoogleApi.get_coordinates_from_address(@end_location)

      @closest_start_station = Station.find_closest_to(@start_location_coords["lat"], @start_location_coords["lng"])

      @closest_start_coords = Station.get_coords_of_station(@closest_start_station)


      @closest_end_station = Station.find_closest_to(@end_location_coords["lat"], @end_location_coords["lng"])

      @closest_end_coords = Station.get_coords_of_station(@closest_end_station)

      @stations = [@closest_start_station, @closest_end_station]

      coords_hash = {start_location: @start_location_coords, end_location: @end_location_coords, start_station: @closest_start_coords, end_station: @closest_end_coords, station_objects: @stations}
      respond_with coords_hash

      # @direction_json = GoogleApi.get_directions_from_addresses(@start_location, @end_location)
    else
        @start_location = ""
        @end_location = ""
    end
  end

end
