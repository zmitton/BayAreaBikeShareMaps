require 'rake'

task :fetch_and_save_station_data => :environment do
  
  ActiveRecord::Base.logger = Logger::new(STDOUT)

  uri = URI("http://www.divvybikes.com/stations/json")
  string = Net::HTTP.get(uri)
  json = JSON.parse(string)

  Station.destroy_all

  # json['stationBeanList'].each do |s|
  #   Station.create(station_id: s["id"] , name: s["stationName"] , available_docks: s["availableDocks"] , total_docks: s["totalDocks"] , latitude: s["latitude"] , longitude: s["longitude"] , status_value: s["statusValue"] , status_key: s["statusKey"] , available_bikes: s["availableBikes"] , intersection: s["stAddress1"] , city: s["city"] , location: s["location"] , test_station: s["testStation"] , last_communication_time: s["lastCommunicationTime"] , landmark: s["landMark"], intersection_2: s["stAddress2"], postal_code: s["postalCode"], altitude: s["altitude"] )
  # end

end
