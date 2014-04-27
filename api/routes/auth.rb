require_relative '../models/user_mapper'
require_relative './common'
require 'json'

class Scarecrow < Sinatra::Application
  include Common

  post '/auth/signup' do
    puts @params
    existing_user = UserMapper.exists(@params[:user][:email], @params[:user][:pseudo])
    unless existing_user
      puts "no existing user"
      @user = UserMapper.set(@params[:user])
      if @user.valid && @user.id
        { :message => "USER_ACCOUNT_CREATION_SUCCESS" }.to_json
      else
        # TODO(pile) check if the user name already exists
        status 400
        { :message => "USER_ACCOUNT_CREATION_FAIL" }.to_json
      end
    else
      status 400
      { :message => "USER_ACCOUNT_CREATION_FAIL_USER_EXISTS" }.to_json
    end
  end

  post '/auth/login/?' do
    puts @params
    if session = UserMapper.authenticate(@params[:email], @params[:password])
      # TODO(pile) store login info in session 
      {
        :token => session.token, 
        :message => "LOGIN_SUCCESS"
      }.to_json
    else
      status 400
      { :message => "LOGIN_FAIL" }.to_json
    end
  end

  post '/auth/logout' do
    if UserMapper.logout(@params[:email], @params[:token])
      { :message => "LOGOUT_SUCCESS"}.to_json
    else
      status 400
      { :message => "LOGOUT_FAIL"}.to_json
    end
  end
end