class PebbleController < ApplicationController
respond_to :json
  def index
    respond_with JSON.parse('{"BTC":{"USD":"395.536900000000","Ounces":0.32074026945852,"Grams":9.976137529929,"SilverOunces":22.692880095115,"SilverGrams":705.82746956358},"Gold":{"USD":"1199.200000000000","Ounces":3.1177874934045,"Grams":0.10023919555529},"Silver":{"USD":"17.430000000000","Ounces":0.044066685055174,"Grams":0.0014167768233285}}')
  end
end
