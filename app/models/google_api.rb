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
    JSON.parse(Net::HTTP.get(uri))
    # json = Net::HTTP.get(uri)
    # result = JSON.parse(json)
  end

end
