require 'rails_helper'

describe Station do
  before(:each) do
    @station = Station.create(station_id: 5, name: "State St & Harrison St", available_docks: 7, available_bikes: 11, total_docks: 19, latitude: 41.8739, longitude: -87.627 )
  end

  it "stations class exists" do
    expect(Station.new).to be_an_instance_of(Station)
  end

  describe "::find_distances_from" do
    it "it returns an array of arrays" do
      expect(Station.find_distances_from( 41.8739 , -87.627 )).to be_an_instance_of(Array)
      expect(Station.find_distances_from( 41.8739 , -87.627 )[0]).to be_an_instance_of(Array)
    end
  end

  describe "::find_closest_to" do
    it "should returns a Station object" do
      expect(Station.find_closest_to( 41.8739 , -87.627 )).to be_an_instance_of(Station)
    end
  end

  pending "::fetch_all" do
    let (:uri) { URI("http://www.divvybikes.com/stations/json") }

    it "returns a successful response" do
      expect(Net::HTTP).to receive(:get)
        .with(uri)
        .and_return()

      # expect(Station.fetch_all).to eq()
    end
  end

end
