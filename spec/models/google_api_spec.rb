require 'rails_helper'

describe GoogleApi do
  it "GoogleApi class exists" do
    expect(GoogleApi.new).to be_an_instance_of(GoogleApi)
  end

	describe '::fetch_address_json' do
		let (:address_string) { "351 W Hubbard St" }
		let (:uri) { URI("http://maps.googleapis.com/maps/api/geocode/json?address=#{URI::escape(address_string)}") }

		it 'returns successful response' do 
			expect(Net::HTTP).to receive(:get)
				.with(uri)
				.and_return('{"foo":"bar"}')

			expect(GoogleApi.fetch_address_json(address_string)).to eq({"foo" => "bar"})
		end
	end

	describe '::fetch_directions_json' do 
		let (:start_address) {"351 W Hubbard St"}
		let (:end_address) { "1 N Michigan Ave" }
		let (:api) { "AIzaSyBYsTTIOfcPfQw_pa8wO0KC62frazyllps" }
		let (:mode) { "bicycling" }
		let (:uri) { URI("https://maps.googleapis.com/maps/api/directions/json?origin=#{URI::escape(start_address)}&destination=#{URI::escape(end_address)}&key=#{api}&avoid=highways&mode=#{mode}") }

		it 'returns a successful response' do 
			expect(Net::HTTP).to receive(:get)
				.with(uri)
				.and_return('{"foo":"bar"}')

			expect(GoogleApi.fetch_directions_json(start_address, end_address, mode)).to eq({"foo" => "bar"})	
		end
	end

end
