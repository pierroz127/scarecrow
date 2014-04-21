require_relative './common'
require_relative '../models/init'
require 'json'

class Scarecrow < Sinatra::Application
  include Common

  get '/creche/index' do 
    email = params[:user]
    puts 'get creche for user ' + email
    creches = Creche.all({email: email})
    content_type :json
    { 
      creches: creches
    }.to_json
  end

  post '/creche/new' do 
    params = deep_symbolize JSON.parse(request.body.read)
    puts params
    creche = Creche.new(params)
    content_type :json
    if (creche.save)
      { message: 'CRECHE_CREATION_SUCCESSFULL' }.to_json
    else
      status = 400
      { message: 'CRECHE_CREATION_FAIL' }.to_json
    end
  end
end