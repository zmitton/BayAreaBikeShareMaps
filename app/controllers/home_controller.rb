class HomeController < ApplicationController
	respond_to :json
	def index
		params[:start_location] = "1015 volts road north brookil" #temp
		params[:end_location] =  "4710NDamenAve,Chicago" #temp



		if params[:start_location] && params[:end_location] 
			@start_location_json = GoogleApi.get_coordinates_from_address(params[:start_location])
			@end_location_json =   GoogleApi.get_coordinates_from_address(params[:end_location])
			@direction_json = GoogleApi.get_directions_from_addresses(params[:start_location], params[:end_location])
		else
		    @json = "no params given"
		end
	end


end
