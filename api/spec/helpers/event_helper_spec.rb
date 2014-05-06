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
    activity1 = Activity.default
    activity1.events << Event.new({starts_on: DateTime.new(2013, 1, 1), frequency: 1})
    creche.activities << activity1
    activity2 = Activity.new({
      label: "demi journée", starts_at: 
      DateTime.new(2000, 1, 1, 8, 30), 
      ends_at: DateTime.new(2000,1,1,12,00),
      section: SectionType::BB | SectionType::MD | SectionType::GT })
    creche.activities << activity2
    activity2.events << Event.new({starts_on: DateTime.new(2013, 1, 2), frequency: 0})
    activity2.events << Event.new({starts_on: DateTime.new(2013, 1, 3 ), frequency: 0})

    cal_events = EventHelper::get_cal_events creche
    cal_events.length.should eq(3)
    puts cal_events
  end
end