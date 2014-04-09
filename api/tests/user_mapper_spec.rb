require 'rubygems'
require 'data_mapper'
require 'dm-migrations'
require_relative '../models/user_mapper'
require_relative '../models/session'
describe "abstract users" do 
  before(:all) do
    puts "coucou it's before"
    #setup database
    DataMapper::Logger.new($stdout, :debug)
    # A sqlite connection:
    DataMapper.setup(:default, 'sqlite:///Users/pile/Projects/Angular/scarecrow/tests/scarecrow.db')
    DataMapper.finalize
    DataMapper.auto_migrate!
  end

  it "can create a user" do
    user = UserMapper.set( {
      :email => "user_01@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
      :firstname => "john",
      :lastname => "doe"
    })
    new_user = user.save
    expect(new_user).to be_true
  end

  it "user has required properties" do
    user = UserMapper.set({})
    new_user = user.save

    # new_user nil because all the parameters are missing
    expect(new_user).to be_false

    user = UserMapper.set( {
      :email => "user_02@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
    })
    new_user = user.save

    # new_user nil because firstname and lastname are missing
    expect(new_user).to be_false

    user = UserMapper.set( {
      :email => "user_02@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
      :firstname => "toto"
    })
    new_user = user.save

    # new_user nil because lastname is missing
    expect(new_user).to be_false
  end

  #TODO(pile) so many other tests to write... 

  it "non-existing user can authenticate" do
    session = UserMapper.authenticate("user_03@scarecrow.com", "1234")
    expect(session).to be_false
  end

  it "user with wrong password can't authenticate" do
    user = UserMapper.set( {
      :email => "user_03@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
      :firstname => "john",
      :lastname => "doe"
    })
    session = UserMapper.authenticate("user_03@scarecrow.com", "5678")
    expect(session).to be_nil
  end

  it "user can authenticate and create a session" do
    user = UserMapper.set( {
      :email => "user_03@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
      :firstname => "john",
      :lastname => "doe"
    })
    session = UserMapper.authenticate("user_03@scarecrow.com", "1234")
    expect(session).to be_true
    expect(session.token).to be_true

    retrieved_user = User.first({:email => "user_03@scarecrow.com"})
    retrieved_user.sessions.length.should eq(1)
    retrieved_user.sessions[0].token.should eq(session.token)
  end

  it "user can log out" do
    user = UserMapper.set( {
      :email => "user_04@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
      :firstname => "john",
      :lastname => "doe"
    })
    session = UserMapper.authenticate("user_04@scarecrow.com", "1234")
    expect(session).to be_true
    expect(session.token).to be_true

    expect(UserMapper.logout("user_04@scarecrow.com", session.token)).to be_true
  end

end