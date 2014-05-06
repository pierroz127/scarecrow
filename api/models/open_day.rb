class OpenDay
  include DataMapper::Resource

  property :id, Serial
  property :day_of_week, Integer, required: true # DateTime.DayOfWeek
  property :opens_at, DateTime, required: true
  property :closes_at, DateTime, required: true

  belongs_to :creche

end