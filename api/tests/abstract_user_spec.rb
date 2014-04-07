require 'rubygems'
require 'data_mapper'
require 'dm-migrations'
require_relative '../models/abstract_user'

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
    user = User.set( {
      :email => "user_01@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
      :firstname => "pierre",
      :lastname => "leroy"
    })
    new_user = user.save
    expect(new_user).to be_true
  end

  it "user has required properties" do
    user = User.set({})
    new_user = user.save

    # new_user nil because all the parameters are missing
    expect(new_user).to be_false

    user = User.set( {
      :email => "user_02@scarecrow.com", 
      :password => "1234", 
      :created_at => Time.now,
    })
    new_user = user.save

    # new_user nil because firstname and lastname are missing
    expect(new_user).to be_false

    user = User.set( {
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

  
end