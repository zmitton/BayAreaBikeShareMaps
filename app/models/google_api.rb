require 'json'

class GoogleApi
    @@api = "AIzaSyBYsTTIOfcPfQw_pa8wO0KC62frazyllps"

  def self.get_coordinates_from_address(address_string)
    address = self.fetch_address_json(address_string)
    address["results"][0]["geometry"]["location"]
  end

  def self.get_directions_from_addresses(start_address, end_address, mode = "bicycling")
    directions = self.fetch_directions_json(start_address, end_address, mode = "bicycling")
  end

  def self.fetch_directions_json(start_address, end_address, mode = "bicycling")
    uri = URI("https://maps.googleapis.com/maps/api/directions/json?origin=#{URI::escape(start_address)}&destination=#{URI::escape(end_address)}&key=#{@@api}&avoid=highways&mode=#{mode}")
    JSON.parse(Net::HTTP.get(uri))
    # json_str = Net::HTTP.get(uri)
    # JSON.parse(json_str)
  end

  def self.fetch_address_json(address_string)
    uri = URI("http://maps.googleapis.com/maps/api/geocode/json?address=#{URI::escape(address_string)}")
    json = Net::HTTP.get(uri)
    result = JSON.parse(json)
  end

  def self.get_optimal_route(closest_start_stations, closest_end_stations, start_coords, end_coords)
    matrix = self.fetch_matrix_json
  end

  def self.fetch_matrix_json(closest_start_stations, closest_end_stations)
    root_url = "http://maps.googleapis.com/maps/api/distancematrix/json?"
    origins_url = "origins=#{self.format_stations(closest_start_stations)}"
    destinations_url = "destinations=#{self.format_stations(closest_end_stations)}"
    options = "&key=#{@@api}&avoid=highways&mode=#{bicycling}"
    print uri = URI("#{root_url}#{origins_url}#{destinations_url}#{options}")
    # json = Net::HTTP.get(uri)
    # result = JSON.parse(json)
  end

  def self.format_stations(stations)
    parameters = ""
    stations.each_with_index do |station, index|
      if index != 0
      paramaters << "|#{Station.find(station.id).latitude},#{Station.find(station.id).longitude}"
    end
  end

end
