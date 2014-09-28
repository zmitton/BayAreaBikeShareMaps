class Station < ActiveRecord::Base
  def self.find_distances_from(lat, lng)
    station_distances = []
    self.all.each do |station|
      if station.available_bikes > 0
        temp_arr = [station.id]
        x_distance = (station.latitude - lat).abs
        y_distance = (station.longitude - lng).abs
        distance_sqrd = x_distance**2 + y_distance**2
        distance = Math.sqrt(distance_sqrd)
        temp_arr << distance
        station_distances << temp_arr
      end
    end
    station_distances.sort{|arr1, arr2| arr1[1] <=> arr2[1] }
  end

  def self.find_closest_to(lat, lng)
    self.find(self.find_distances_from(lat, lng)[0][0])
  end

  def self.get_coords_of_station(station)
    station_coords = {"lat" => station.latitude.to_f, "lng" => station.longitude.to_f}
  end

  def self.fetch_all
    if self.stale?
      uri = URI("http://www.divvybikes.com/stations/json")
      string = Net::HTTP.get(uri)
      json = JSON.parse(string)
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

end

