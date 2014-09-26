class StationsController < ApplicationController
respond_to :json
  def index
    @stations = Station.all
    respond_with @stations
  end
end
