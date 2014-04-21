class EventRecurrence
  include DataMapper::Resource

  property :id, Serial
  property :day, Integer
  property :month, Integer
  property :year, Integer

  belongs_to :event
  
end