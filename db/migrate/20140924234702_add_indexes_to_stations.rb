class AddIndexesToStations < ActiveRecord::Migration
  def change
    add_index :stations, :latitude
    add_index :stations, :longitude
    add_index :stations, :station_id
  end
end
