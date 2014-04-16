current_path = File.expand_path("..", __FILE__)
#require 'dm-core'
require 'dm-timestamps'
require 'dm-validations'
require_relative 'user'
require_relative 'session'
require_relative 'dm_adapter'

class UserMapper
  include DmAdapter

  def initialize(interfacing_class_instance)
    @instance = interfacing_class_instance
  end

  def id
    @instance.id
  end

  def self.authenticate(email, pass)
    current_user = User.first(:email => email)
    return nil if current_user.nil?
    #return current_user if UserAdapter.encrypt(pass, current_user.salt) == current_user.hashed_password
    if UserMapper.encrypt(pass, current_user.salt) == current_user.hashed_password
      session = current_user.sessions.new
      session.save
      session
    else
      nil
    end
  end

  def self.logout(email, token)
    current_user = User.first(:email => email)
    return nil if current_user.nil?
    session = current_user.sessions.find { |s| s.token == token }
    if session
      session.destroy
    else
      nil
    end
  end

  def self.exists(email, pseudo)
    return (User.all(:email => email) + User.all(:pseudo => pseudo)).length > 0
  end

  def db_instance
    @instance
  end

  protected

  def self.encrypt(pass, salt)
    Digest::SHA1.hexdigest(pass + salt)
  end

  def self.random_string(len)
    #generate a random password consisting of strings and digits
    chars = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
    newpass = ""
    1.upto(len) { |i| newpass << chars[rand(chars.size-1)] }
    return newpass
  end
end

class Hash
  def stringify
    inject({}) do |options, (key, value)|
      options[key.to_s] = value.to_s
      options
    end
  end

  def stringify!
    each do |key, value|
      delete(key)
      store(key.to_s, value.to_s)
    end
  end
end