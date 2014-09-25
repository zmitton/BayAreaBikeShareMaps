class Station < ActiveRecord::Base
  def self.find_closest_to(lat, long)
    station_distances = {}
    self.all.each do |station|
      x_distance = (station.latitude - lat).abs
      y_distance = (station.longitude - long).abs
      distance_sqrd = x_distance**2 + y_distance**2
      distance = Math.sqrt(distance_sqrd)
      station_distances[station.id] = distance
    end
    station_distances.sort{|key, value| value }
  end
end

