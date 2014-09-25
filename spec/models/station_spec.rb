require 'rails_helper'

describe Station do
  it "stations class exists" do
    expect(Station.new).to be_an_instance_of(Station)
  end  

  describe ".find_distances_from" do
    it "it returns an array of arrays" do
      expect(Station.find_distances_from( 41.8739 , -87.627 )).to be_an_instance_of(Array)
      expect(Station.find_distances_from( 41.8739 , -87.627 )[0]).to be_an_instance_of(Array)
    end
  end

  describe ".find_closest_to" do
    it "it returns a Station object" do
      expect(Station.find_closest_to( 41.8739 , -87.627 )).to be_an_instance_of(Station)
    end
  end


end