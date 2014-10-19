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
    json_str = Net::HTTP.get(uri)
    JSON.parse(json_str)
  end

  def self.fetch_address_json(address_string)
    uri = URI("https://maps.googleapis.com/maps/api/geocode/json?address=#{URI::escape(address_string)}")
    json = Net::HTTP.get(uri)
    result = JSON.parse(json)
  end

  def self.get_optimal_route(closest_start_stations, closest_end_stations, start_coords, end_coords)
    stations_matrix = self.get_stations_matrix(closest_start_stations, closest_end_stations)
    start_matrix = self.get_start_matrix(start_coords, closest_start_stations)
    end_matrix = self.get_end_matrix(end_coords, closest_end_stations)

    stations_matrix.each do |station|
      puts "before #{station[:time]}"
      time_from_start = start_matrix.select { |x| x[:station] == station[:start_station] }.map { |u| u[:time] }
      time_from_end = end_matrix.select { |x| x[:station] == station[:end_station] }.map { |u| u[:time] }
      station[:time] += time_from_start[0] + time_from_end[0]
      puts "after  #{station[:time]}"
      puts
    end
    stations_matrix.sort_by { |station| station[:time] }
  end

  def self.get_stations_matrix(closest_start_stations, closest_end_stations)
   matrix = self.fetch_stations_matrix_json(closest_start_stations, closest_end_stations)
    rows = matrix["rows"]
    results = []
    r = 0
    while r < rows.length
      start_station = closest_start_stations[r]
      elements = rows[r]["elements"]
      e = 0
      while e < elements.length
        end_station = closest_end_stations[e]
        if elements[e] == {"status"=>"ZERO_RESULTS"}
          time = 10000
        else
          time = elements[e]["duration"]["value"]
        end
        results << {start_station: start_station, end_station: end_station, time: time}
        e += 1
      end
      r += 1
    end
    return results
  end

  def self.get_start_matrix(start_point, stations)
    matrix = self.fetch_points_matrix_json(start_point, stations)
    rows = matrix["rows"]
    results = []
    elements = rows[0]["elements"]
    e = 0
    while e < elements.length
      station = stations[e]
      if elements[e] == {"status"=>"ZERO_RESULTS"}
          time = 10000
      else
        time = elements[e]["duration"]["value"]
      end
      results << {start_point: "start_point", station: station, time: time}
      e += 1
    end
    return results
  end

  def self.get_end_matrix(end_point, stations)
    matrix = self.fetch_points_matrix_json(end_point, stations)
    rows = matrix["rows"]
    results = []
    elements = rows[0]["elements"]
    e = 0
    while e < elements.length
      station = stations[e]
      time = elements[e]["duration"]["value"]
      results << {end_point: "end_point", station: station, time: time}
      e += 1
    end
    return results
  end

  def self.fetch_points_matrix_json(origin, stations)
    root_url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
    origins_url = "#{origin["lat"]},#{origin["lng"]}"
    destinations_url = "#{self.format_stations(stations)}"
    options = "&key=#{@@api}&avoid=highways&mode=walking"
    uri = URI("#{root_url}origins=#{URI::escape(origins_url)}&destinations=#{URI::escape(destinations_url)}#{options}")
    json = Net::HTTP.get(uri)
    result = JSON.parse(json)
  end

  def self.fetch_stations_matrix_json(closest_start_stations, closest_end_stations)
    root_url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
    origins_url = "#{self.format_stations(closest_start_stations)}"
    destinations_url = "#{self.format_stations(closest_end_stations)}"
    options = "&key=#{@@api}&avoid=highways&mode=bicycling"
    p uri = URI("#{root_url}origins=#{URI::escape(origins_url)}&destinations=#{URI::escape(destinations_url)}#{options}")
    json = Net::HTTP.get(uri)
    result = JSON.parse(json)
  end

  def self.format_stations(stations)
    parameters = ""
    stations.each_with_index do |station, index|
      if index != 0
        parameters << "|#{Station.find(station).latitude.to_f},#{Station.find(station).longitude.to_f}"
      else
        parameters << "#{Station.find(station).latitude.to_f},#{Station.find(station).longitude.to_f}"
      end
    end
    return parameters
  end

end
