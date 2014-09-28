class StationsController < ApplicationController
respond_to :json
  def index
    @stations = Station.fetch_all
    respond_with @stations
  end
end
