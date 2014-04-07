# encoding: utf-8
require 'multi_json'
require 'sinatra'

class Scarecrow < Sinatra::Application

  enable :sessions

end

require_relative 'routes/init'