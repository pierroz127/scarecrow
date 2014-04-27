require_relative '../../models/init'
require_relative 'datamapper_spec'

describe "event spec" do 
  before(:all) do
    #setup database
    DatamapperSpec.init
  end

  it "filter attribute" do
    dt = DateTime.new(2013, 6 , 1, 8, 0)
    attributes = {
      starts_on: dt,
      frequency: 1,
      great_cradles: 5,
      medium_cradles: 4,
      baby_cradles: 3,
      unknown_params: "surprise",
      params: [3, 4]
    }
    Event.filter(attributes)
    ev = Event.new(attributes)
    expect(ev).to be_true
    ev.starts_on.should eq(dt)
    ev.frequency.should eq(1)
    ev.great_cradles.should eq(5)
    ev.medium_cradles.should eq(4)
    ev.baby_cradles.should eq(3)
  end

  it "save a new event" do
    creche = Creche.new({name: "event_spec02", city: "Paris", email: "marcelo@gmail.com"})
    activity = Activity.default
    creche.activities<<activity
    expect(creche.save).to be_true

    read_creche = Creche.first({name: "event_spec02"})
    expect(read_creche).to be_true
    activity = read_creche.activities.first

    event = Event.new({starts_on: DateTime.new(2014, 1, 1, 12, 0), frequency: 0, great_cradles:10})
    activity.events << event
    expect(activity.save).to be_true

    read_creche2 = Creche.first({name: "event_spec02"})
    read_creche2.activities.length.should eq(1)
    activity = read_creche2.activities.first
    activity.events.length.should eq(1)
  end
end
