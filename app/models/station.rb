class Station < ActiveRecord::Base
  def self.find_distances_from(lat, lng)
    station_distances = []
    self.all.each do |station|
      temp_arr = [station.id]
      x_distance = (station.latitude - lat).abs
      y_distance = (station.longitude - lng).abs
      distance_sqrd = x_distance**2 + y_distance**2
      distance = Math.sqrt(distance_sqrd)
      temp_arr << distance
      station_distances << temp_arr
    end
    station_distances.sort{|arr1, arr2| arr1[1] <=> arr2[1] }
  end

  def self.find_closest_to(lat, lng)
    self.find(self.find_distances_from(lat, lng)[0][0])
  end

  def self.get_coords_of_station(station)
    station_coords = {"lat" => station.latitude.to_f, "lng" => station.longitude.to_f}
  end

end

