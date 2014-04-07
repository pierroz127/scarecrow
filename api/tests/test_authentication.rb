require 'rubygems'
require 'data_mapper'
require 'dm-migrations'
require_relative '../models/abstract_user'

#setup database
DataMapper::Logger.new($stdout, :debug)
    
# A sqlite connection:
DataMapper.setup(:default, 'sqlite:///Users/pile/Projects/Angular/scarecrow/tests/scarecrow.db')

DataMapper.finalize
DataMapper.auto_migrate!

test_user = User.set( {:email => "pierre.leroy20@gmail.com", :password => "1234", :created_at => Time.now})
test_user.save

if test_user.valid?
	puts "User correctly saved to db"
else
	puts "ERROR!! An error occurred while saving the user in db"
end

retrieved_user = User.get({:email => "pierre.leroy20@gmail.com"})

if retrieved_user == nil
	puts "the user wasn't retrieved"
else
	puts "Youhoo user was retrieved..."
	puts "#{retrieved_user.email} - #{retrieved_user.hashed_password} - #{retrieved_user.salt} - #{retrieved_user.created_at}"
	if retrieved_user.hashed_password == test_user.hashed_password
		puts "... and with the right password"
	else
		puts "... arf he doesn't have the right password"
	end
end

other_user = User.set({
	:email => "dsaudo@gmail.com", 
	:firstname => "Delphine", 
	:lastname => "Leroy",
	:password => "5678", 
	:created_at => Time.now
})



users = User.all
if users.length != 2
	puts "ERROR!! Expected 2 users, found #{users.length}"
else
	puts "SUCCESS !! 2 users found as expected"
end
#users.each( { |usr| puts "#{usr.email} - #{usr.hashed_password} - #{usr.created_at}" })