class EventCancellation
  include DataMapper::Resource

  property :id, Serial
  property :date, DateTime, required: true

  belongs_to :event
end