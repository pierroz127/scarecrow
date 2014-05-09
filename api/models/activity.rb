class Activity
  include DataMapper::Resource

  property :id, Serial
  property :label, String, required: true
  property :starts_at_earliest, DateTime, required: true
  property :starts_at_latest, DateTime, required: true
  property :ends_at_earliest, DateTime, required: true
  property :ends_at_latest, DateTime, required: true
  property :description, String
  property :pricing, String
  property :location, String
  property :comments, String
  property :adaptation, Integer, required: true, default: 1 # 1: mandatory, 2: mandatory unless parent present, 3: optional
  property :presence_of_parent, Integer, required: true, default: 1 # 1: yes, 2: possible, 3: no

  belongs_to :creche
  has n, :events

  def self.get_default_activities
    activities = []
    activities << Activity.new({
      label: "FULL_DAY", 
      starts_at_earliest: DateTime.new(2000, 1, 1, 8, 0), 
      starts_at_latest: DateTime.new(2000, 1, 1, 9, 0), 
      ends_at_earliest: DateTime.new(2000,1,1,17,00),
      ends_at_latest: DateTime.new(2000,1,1,19,00),
      });
    activities << Activity.new({
      label: "HALF_DAY_AM", 
      starts_at_earliest: DateTime.new(2000, 1, 1, 8, 0), 
      starts_at_latest: DateTime.new(2000, 1, 1, 9, 0), 
      ends_at_earliest: DateTime.new(2000,1,1,11,30),
      ends_at_latest: DateTime.new(2000,1,1,12,30),
      });
    activities << Activity.new({
      label: "HALF_DAY_PM", 
      starts_at_earliest: DateTime.new(2000, 1, 1, 13, 30), 
      starts_at_latest: DateTime.new(2000, 1, 1, 14, 30), 
      ends_at_earliest: DateTime.new(2000,1,1,17,00),
      ends_at_latest: DateTime.new(2000,1,1,19,00),
      });
    activities
  end

end