require_relative 'common'
require_relative '../models/init'
require 'json'

class Scarecrow < Sinatra::Application
  include Common

  get '/activity' do
    creche = Creche.get(params[:crecheid])
    if (creche && creche.activities)
      { activities: creche.activities }.to_json
    else
      status = 400
      { message: "UNKNOWN_CRECHE"}.to_json
    end
  end

  put '/activity/:id' do
    activity = Activity.get(@params[:id])
    @params.delete("splat")
    @params.delete("captures")
    creche = activity.creche
    creche.activities
    if (activity.update(@params))
      { message: "ACTIVITY_UPDATE_SUCCESS" }.to_json
    else
      status = 400
      { message: "ACTIVITY_UPDATE_FAIL" }.to_json
    end
  end
end