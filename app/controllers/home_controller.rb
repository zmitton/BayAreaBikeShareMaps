class HomeController < ApplicationController
respond_to :json

	def index
    @start_location = ""
    @end_location = ""
	end

  def search
    @start_location = "#{params[:start_location]} + Chicago, IL"
    @end_location = "#{params[:end_location]} + Chicago, IL"

    if @start_location && @end_location
      @start_location_coords = GoogleApi.get_coordinates_from_address(@start_location)
      @end_location_coords = GoogleApi.get_coordinates_from_address(@end_location)
      coords_hash = {start_location: @start_location_coords, end_location: @end_location_coords}
      respond_with coords_hash

      # @direction_json = GoogleApi.get_directions_from_addresses(@start_location, @end_location)
    else
        @start_location = ""
        @end_location = ""
    end
  end

end
