class Station < ActiveRecord::Base
  BIKE_WALK_SPEED_RATIO = 3.3
  def self.find_distances_from(lat1, lng1)
    station_distances = []
    self.all.each do |station|
      if station.available_bikes > 0
        temp_arr = [station.id]
        x_distance = (station.latitude - lat1).abs
        y_distance = (station.longitude - lng1).abs
        distance_sqrd = x_distance**2 + y_distance**2
        distance = Math.sqrt(distance_sqrd)
        temp_arr << distance
        station_distances << temp_arr
      end
    end
    station_distances.sort{|arr1, arr2| arr1[1] <=> arr2[1] }
  end

  def self.find_fastest_by_distance_and_direction(lat1, lng1, lat2, lng2)
    stations = []
    self.all.each do |station|
        temp_arr = [station.id]
        x_distance_walking = (station.latitude - lat1).abs
        y_distance_walking = (station.longitude - lng1).abs
        distance_walking_sqrd = x_distance_walking**2 + y_distance_walking**2
        distance_walking = Math.sqrt(distance_walking_sqrd)

        x_distance_biking = (station.latitude - lat2).abs
        y_distance_biking = (station.longitude - lng2).abs
        distance_biking_sqrd = x_distance_biking**2 + y_distance_biking**2
        distance_biking = Math.sqrt(distance_biking_sqrd)
        time_factor = (distance_walking * BIKE_WALK_SPEED_RATIO) + distance_biking

        temp_arr << time_factor
        stations << temp_arr
    end
    stations.sort{|arr1, arr2| arr1[1] <=> arr2[1] }
  end



  def self.find_closest_to(lat, lng)
    self.find(self.find_distances_from(lat, lng)[0][0])
  end

  def self.find_three(lat1, lng1, lat2, lng2, need)
    sorted_stations = self.find_fastest_by_distance_and_direction(lat1, lng1, lat2, lng2 ) # 3 better stations
    puts "###########################################################################"
    puts "NEED:#{need}"
    sorted_stations.each do |station|
      p Station.find(station[0]).name
    end
    stations = []
    i = 0
    while stations.length < 3 && i < sorted_stations.length
      if self.find(sorted_stations[i][0]).item_available(need)
        stations << sorted_stations[i][0]
      end
      i+=1
    end
    return stations
  end

  def self.get_coords_of_station(station)
    station_coords = {"lat" => station.latitude.to_f, "lng" => station.longitude.to_f}
  end

  def self.fetch_all
    if self.stale?
      uri = URI("http://www.divvybikes.com/stations/json")

      # string = Net::HTTP.get(uri)
      # json = JSON.parse(string)
      json = JSON.parse(Net::HTTP.get(uri))
      Station.delete_all
      json['stationBeanList'].each do |s|
        Station.create(station_id: s["id"] , name: s["stationName"] , available_docks: s["availableDocks"] , total_docks: s["totalDocks"] , latitude: s["latitude"] , longitude: s["longitude"] , status_value: s["statusValue"] , status_key: s["statusKey"] , available_bikes: s["availableBikes"] , intersection: s["stAddress1"] , city: s["city"] , location: s["location"] , test_station: s["testStation"] , last_communication_time: s["lastCommunicationTime"] , landmark: s["landMark"], intersection_2: s["stAddress2"], postal_code: s["postalCode"], altitude: s["altitude"] )
      end
    end
    self.all
  end

  def self.stale?
    self.first.created_at < 1.minutes.ago || self.last.created_at < 1.minutes.ago
  end

  def item_available(need)
    if need == "bikes"
      return self.available_bikes > 0
    elsif need == "docks"
      return self.available_docks > 0
    end
    puts "error item_available called on station without proper argument: '#{need}'"
    return false # line should never run
  end

  def cardinal_direction(lat1, lng1)
    y_vector = self.latitude - lat1
    x_vector = self.longitude - lng1
    output = ""
    if y_vector > (x_vector/2.0).abs 
      output += "North"
    elsif y_vector < -1.0 * (x_vector/2.0).abs
      output += "South"
    end  
    if x_vector > (y_vector/2.0).abs 
      output += "East"
    elsif x_vector < -1.0 * (y_vector/2.0).abs
      output += "West"
    end
    output
  end



end






