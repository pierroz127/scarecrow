class Section
  include DataMapper::Resource

  property :id, Serial
  property :name, String, required: true
  property :min_birthdate, DateTime, required: true
  property :max_birthdate, DateTime, required: true

  belongs_to :creche

end