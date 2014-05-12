require_relative '../models/user'
require_relative './common'
require 'json'

class Scarecrow < Sinatra::Application
  include Common
  
  get '/user' do
    users = User.all()
    if (users)
      { users: users }.to_json
    else
      status = 400
      { error: 'ALL_USERS_FAIL' }.to_json
    end
  end

  get '/user/:id' do
    user = User.get(params[:id])
    if (user)
      { user: user}.to_json
    else
      status = 400
      { error: 'UNKNOWN_USER' }.to_json
    end
  end

  put '/user/:id' do
    user = User.get(@params[:id])
    @params.delete("splat")
    @params.delete("captures")
    if (user.update(@params))
      { message: "USER_UPDATE_SUCCESS" }.to_json
    else
      status = 400
      { message: "USER_UPDATE_FAIL" }.to_json
    end
  end
end