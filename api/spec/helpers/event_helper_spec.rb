require_relative '../../models/init'
require_relative '../../helpers/event_helper'
require_relative '../../helpers/section'
require_relative '../models/datamapper_spec'


describe 'event_helper spec' do
  before(:all) do
    puts "coucou it's before"
    #setup database
    DatamapperSpec.init
  end

  it 'can get calendar events' do
    creche = Creche.new({name: "event_helper_spec01", city: "paris", email: "tom@gmail.com"})
    activity1 = Activity.get_default_activities.first
    activity1.events << Event.new({starts_on: DateTime.new(2013, 1, 1), frequency: 1})
    creche.activities << activity1
    activity2 = Activity.new({
      label: "demi journée", 
      starts_at_earliest: DateTime.new(2000, 1, 1, 8, 30), 
      starts_at_latest: DateTime.new(2000, 1, 1, 9, 30), 
      ends_at_earliest: DateTime.new(2000,1,1,12,00),
      ends_at_latest: DateTime.new(2000,1,1,13,00)})
    creche.activities << activity2
    activity2.events << Event.new({starts_on: DateTime.new(2013, 1, 2), frequency: 0})
    activity2.events << Event.new({starts_on: DateTime.new(2013, 1, 3 ), frequency: 0})

    cal_events = EventHelper::get_cal_events creche
    cal_events.length.should eq(3)
    puts cal_events
  end

  it 'set availability per section' do
    creche = Creche.new({name: "event_helper_spec02", city: "paris", email: "bill@gmail.com"})
    section = Section.new({name: "great section", min_birthdate: DateTime.new(2012,1,1), max_birthdate: DateTime.new(2012, 12, 31)})
    creche.sections << section
    activity = Activity.get_default_activities.first
    event = Event.new({starts_on: DateTime.new(2014, 5, 1), frequency: 1})
    activity.events << event
    creche.activities << activity
    expect(creche.save).to be_true
    EventHelper.set_availability_per_section(event, [{id: section.id, count: 5}])
    read_event = Event.get(event.id)
    expect(read_event).to be_true
    read_event.available_cradles.length.should eq(1)
    read_event.available_cradles[0].cradles.should eq(5) 
  end
end