class DmUser
  include DataMapper::Resource

  property :id,              Serial
  property :email,           String,   :required => true
  property :firstname,       String,   :required => true
  property :lastname,        String,   :required => true
  property :hashed_password, String
  property :salt,            String
  property :created_at,      DateTime  # A DateTime, for any date you might like.

  attr_accessor :password

  validates_presence_of :password, :unless => Proc.new { |t| t.hashed_password }
  #validates_confirmation_of :password

  def password=(pass)
    @password = pass
    self.salt = User.random_string(10) if !self.salt
    self.hashed_password = User.encrypt(@password, self.salt)
  end


end