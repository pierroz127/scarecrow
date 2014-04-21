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

  has n, :activities
end