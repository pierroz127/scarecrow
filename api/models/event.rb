class Event
  include DataMapper::Resource

  property :id, Serial
  property :starts_on, DateTime, required: true
  property :ends_on, DateTime
  property :start_at, DateTime
  property :ends_at, DateTime
  property :frequency, Integer, required: true # 0: none, 1: daily, 2: weekly, 3: monthly, 4: yearly
  property :separation, Integer
  property :count, Integer
  property :until, DateTime
  property :available_seats, Integer
  
  belongs_to :activity
  has n, :event_recurrences
  has n, :event_cancellations

end