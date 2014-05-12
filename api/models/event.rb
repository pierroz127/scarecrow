class Event
  include DataMapper::Resource

  property :id, Serial
  property :starts_on, DateTime, required: true
  property :ends_on, DateTime
  property :starts_at, DateTime, default: DateTime.new(2000, 1, 1, 8, 0)
  property :ends_at, DateTime, default: DateTime.new(2000, 1, 1, 19, 0)
  property :frequency, Integer, required: true # 0: none, 1: daily, 2: weekly, 3: monthly, 4: yearly
  property :separation, Integer
  property :count, Integer
  property :until, DateTime
#  property :great_cradles, Integer, default: 0
#  property :medium_cradles, Integer, default: 0
#  property :baby_cradles, Integer, default: 0

  belongs_to :activity
  has n, :available_cradles
  has n, :event_recurrences
  has n, :event_cancellations

  def self.filter(attributes)
    fields = properties.to_a
    fields.collect! { |p| p.name }

    attributes.select! do 
        |k, v| 
        fields.find_index do
          |property|
          property == k
        end
      end
  end
end