class CreateStations < ActiveRecord::Migration
  def change
    create_table :stations do |t|
      t.integer   :station_id
      t.string    :name
      t.integer   :available_docks
      t.integer   :total_docks
      t.decimal   :latitude
      t.decimal   :longitude
      t.string    :status_value
      t.integer   :status_key
      t.integer   :available_bikes
      t.string    :intersection 
      t.string    :intersection_2 # not used by divvy
      t.string    :city
      t.string    :postal_code # not used by divvy
      t.string    :location
      t.decimal   :altitude # not used by divvy
      t.boolean   :test_station
      t.datetime  :last_communication_time
      t.string    :landmark

      t.timestamps
    end
  end
end
