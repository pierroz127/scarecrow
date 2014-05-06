require 'dm-constraints'
require 'json'
class Creche
  include DataMapper::Resource

  property :id, Serial
  property :email, String, required: true # Administrator of the creche's email
  property :name, String, required: true
  property :city, String, required: true
  property :director_firstname, String
  property :director_lastname, String
  property :number, String
  property :street, String
  property :zipcode, Integer
  property :description, String
  property :fax, String # let's see later if it needs to be a number a whatever
  property :phone, String

  has n, :open_days, :constraint => :destroy
  has n, :activities, :constraint => :destroy
  has n, :sections, :constraint => :destroy


  def to_json_with_attributes(*args)
  #  puts "coucou"
    as_json.merge({activities: activities, open_days: open_days, sections: sections}).to_json
  end
end