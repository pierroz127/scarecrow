require_relative 'user_mapper'

class Session
  include DataMapper::Resource

  property   :id,              Serial
  property   :token,           String,    :required => true
  property   :created_at,      DateTime,  :required => true
 
  belongs_to :user

  def initialize(*args)
    self.token  = UserMapper.random_string(32)
    self.created_at = Time.now
  end 
end