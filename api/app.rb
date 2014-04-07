# encoding: utf-8
require 'multi_json'
require 'sinatra'
require 'sinatra/cross_origin'
require 'data_mapper'
require 'dm-migrations'

class Scarecrow < Sinatra::Application
  enable :sessions
  enable :cross_origin
  set :allow_origin, :any
  set :allow_methods, [:get, :post, :options]
  set :allow_credentials, true
  set :max_age, "1728000"
  set :expose_headers, ['Content-Type']
  configure :development do
    DataMapper::Logger.new($stdout, :debug)
    
    # A MySQL connection:
    #DataMapper.setup(:default, 'mysql://scarecrow_user:scarecrow@localhost/scarecrow')

    #sqlite connection
    DataMapper.setup(:default, 'sqlite:///Users/pile/Projects/scarecrow/api/scarecrow.db')
  end
end

require_relative 'models/init'
require_relative 'routes/init'

DataMapper.finalize
