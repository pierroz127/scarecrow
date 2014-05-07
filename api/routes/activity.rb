require_relative 'common'
require_relative '../models/init'
require 'json'

class Scarecrow < Sinatra::Application
  include Common

  put '/activity/:id' do
    activity = Activity.get(@params[:id])
    @params.delete("splat")
    @params.delete("captures")
    creche = activity.creche
    creche.activities
    if (activity.update(@params))
      "{\"activity\": #{activity.to_json}, \"creche\": #{creche.to_json_with_attributes}}"
    else
      status = 400
      { message: "ACTIVITY_UPDATE_FAIL" }.to_json
    end
  end
end