class PebbleController < ApplicationController
respond_to :json
  def index
    distances_from = Station.find_distances_from(params[:lat].to_f, params[:lng].to_f)
    closest_station = Station.find(distances_from[0][0])

    distance_in_miles = (distances_from[0][1] * 69.0).round(2)
    direction = closest_station.cardinal_direction(params[:lat].to_f, params[:lng].to_f)
    puts distance_in_miles
    puts direction

    # respond_with closest_station
    respond_with '{"station_id":' + closest_station.station_id.to_s + ',"name":"' + closest_station.name.to_s + '", "distance":"' + distance_in_miles.to_s + '", "direction":"' + direction.to_s + '"}'
  end
end
