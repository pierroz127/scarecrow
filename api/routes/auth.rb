require_relative '../models/abstract_user'
require 'json'

class Scarecrow < Sinatra::Application
  options '*' do
    response.headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS,POST'
    # Needed for AngularJS
    response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept'
  end

  post '/signup' do
    params = deep_symbolize JSON.parse(request.body.read)
    puts params
    existing_user = User.get({ :email => params[:user][:email]})
    unless existing_user
      puts "no existing user"
      @user = User.set(params[:user])
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

  post '/login/?' do
    params = deep_symbolize JSON.parse(request.body.read)
    puts params
    if user = User.authenticate(params[:email], params[:password])
      # TODO(pile) store login info in session 
      content_type :json
      { :message => "LOGIN_SUCCESS"}.to_json
    else
      status 400
      content_type :json
      { :message => "LOGIN_FAIL" }.to_json
    end
  end

  # method to deeply symbolize the keys of hash or the elements of an array
  def deep_symbolize(obj)
    return obj.inject({}){|memo,(k,v)| memo[k.to_sym] =  deep_symbolize(v); memo} if obj.is_a? Hash
    return obj.inject([]){|memo,v    | memo           << deep_symbolize(v); memo} if obj.is_a? Array
    return obj
  end
end