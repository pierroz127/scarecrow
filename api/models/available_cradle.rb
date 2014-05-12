class AvailableCradle
  include DataMapper::Resource

  property :id, Serial
  property :cradles, Integer, default: 0

  belongs_to :event
  belongs_to :section
end