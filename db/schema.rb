# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140924234702) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "stations", force: true do |t|
    t.integer  "station_id"
    t.string   "name"
    t.integer  "available_docks"
    t.integer  "total_docks"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.string   "status_value"
    t.integer  "status_key"
    t.integer  "available_bikes"
    t.string   "intersection"
    t.string   "intersection_2"
    t.string   "city"
    t.string   "postal_code"
    t.string   "location"
    t.decimal  "altitude"
    t.boolean  "test_station"
    t.datetime "last_communication_time"
    t.string   "landmark"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "stations", ["latitude"], name: "index_stations_on_latitude", using: :btree
  add_index "stations", ["longitude"], name: "index_stations_on_longitude", using: :btree
  add_index "stations", ["station_id"], name: "index_stations_on_station_id", using: :btree

end
