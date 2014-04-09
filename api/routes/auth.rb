require_relative '../models/user_mapper'
require 'json'

class Scarecrow < Sinatra::Application
  options '*' do
    response.headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS,POST'
    # Needed for AngularJS
    response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
  end

  post '/auth/signup' do
    params = deep_symbolize JSON.parse(request.body.read)
    puts params
    existing_user = UserMapper.get({ :email => params[:user][:email]})
    unless existing_user
      puts "no existing user"
      @user = UserMapper.set(params[:user])
      if @user.valid && @user.id
        content_type :json
        { :message => "USER_ACCOUNT_CREATION_SUCCESS" }.to_json
      else
        # TODO(pile) check if the user name already exists
        status 400
        content_type :json
        { :message => "USER_ACCOUNT_CREATION_FAIL" }.to_json
      end
    else
      status 400
      content_type :json
      { :message => "USER_ACCOUNT_CREATION_FAIL_USER_EXISTS" }.to_json
    end
  end

  post '/auth/login/?' do
    params = deep_symbolize JSON.parse(request.body.read)
    puts params
    if session = UserMapper.authenticate(params[:email], params[:password])
      # TODO(pile) store login info in session 
      content_type :json
      {
        :token => session.token, 
        :message => "LOGIN_SUCCESS"
      }.to_json
    else
      status 400
      content_type :json
      { :message => "LOGIN_FAIL" }.to_json
    end
  end

  post '/auth/logout' do
    params = deep_symbolize JSON.parse(request.body.read)
    content_type:json
    if UserMapper.logout(params[:email], params[:token])
      { :message => "LOGOUT_SUCCESS"}.to_json
    else
      status 400
      { :message => "LOGOUT_FAIL"}.to_json
    end
  end

  # method to deeply symbolize the keys of hash or the elements of an array
  def deep_symbolize(obj)
    return obj.inject({}){|memo,(k,v)| memo[k.to_sym] =  deep_symbolize(v); memo} if obj.is_a? Hash
    return obj.inject([]){|memo,v    | memo           << deep_symbolize(v); memo} if obj.is_a? Array
    return obj
  end
end