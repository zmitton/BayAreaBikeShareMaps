require 'rails_helper'

describe GoogleApi do
  it "GoogleApi class exists" do
    expect(GoogleApi.new).to be_an_instance_of(GoogleApi)
  end
end