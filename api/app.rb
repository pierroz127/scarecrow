# encoding: utf-8
require 'multi_json'
require 'sinatra'
require 'sinatra/cross_origin'
require 'data_mapper'
require 'dm-migrations'
require_relative 'routes/common'

class Scarecrow < Sinatra::Application
  include Common

  enable :sessions
  enable :cross_origin
  set :allow_origin, :any
  set :allow_methods, [:get, :post, :options]
  set :allow_credentials, true
  set :max_age, "1728000"
  set :expose_headers, ['Content-Type']
  set :protection, :origin_whitelist => ['http://127.0.0.1:9000'], :except => [:remote_token, :http_origin]
  configure :development do
    DataMapper::Logger.new($stdout, :debug)
    
    # A MySQL connection:
    #DataMapper.setup(:default, 'mysql://scarecrow_user:scarecrow@localhost/scarecrow')

    #sqlite connection
    db_path = File.join(File.dirname(__FILE__), 'heroku_scarecrow.db')
    DataMapper.setup(:default, "sqlite://#{db_path}")
  end

  options '*' do
    response.headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS,POST'
    # Needed for AngularJS
    response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
  end

  before /^\/(auth|creche)/ do
    content_type 'application/json'
  end

  before do 
    next unless request.post?
    @params = deep_symbolize JSON.parse(request.body.read)
    puts "@params: #{@params}"
  end
end



require_relative 'models/init'
require_relative 'routes/init'

DataMapper.finalize
