class Activity
  include DataMapper::Resource

  property :id, Serial
  property :label, String, required: true
  property :starts_at, DateTime, required: true
  property :ends_at, DateTime, required: true
  property :description, String
  property :section, Integer, required: true # BB (0 to 12 months) = 1, MY (12 to 24 monts) = 2, GD (older) = 3

  belongs_to :creche
  has n, :events

end