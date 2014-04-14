require_relative 'user_mapper'

class User
  include DataMapper::Resource

  property :id,              Serial
  property :email,           String,   :required => true
  property :firstname,       String,   :required => true
  property :lastname,        String,   :required => true
  property :hashed_password, String
  property :salt,            String
  property :created_at,      DateTime  # A DateTime, for any date you might like.

  has n,   :sessions 
  has n,   :children, :through => Resource

  attr_accessor :password

  validates_presence_of :password, :unless => Proc.new { |t| t.hashed_password }
  #validates_confirmation_of :password

  def password=(pass)
    @password = pass
    self.salt = UserMapper.random_string(10) if !self.salt
    self.hashed_password = UserMapper.encrypt(@password, self.salt)
  end

  def self.fields
    a = properties.to_a
    a.collect! { |p| p.name }
    a << :password
    a
  end

  def to_s
    return "#{firstname}, #{lastname}, #{email}, #{hashed_password}"
  end
end