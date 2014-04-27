require_relative '../../models/init'
require_relative 'datamapper_spec'

describe 'test activity' do
  before(:all) do
    puts "coucou it's before"
    #setup database
    DatamapperSpec.init
  end

  it 'create default activity' do
    creche = Creche.new({name: "activity_spec01", city: "cergy", email: "achille@gmail.com"})
    activity = Activity.default
    creche.activities<<activity
    expect(creche.save).to be_true

    read_creche = Creche.first({name: "activity_spec01"})
    read_creche.city.should eq("cergy")
    read_creche.email.should eq("achille@gmail.com")
    read_creche.activities.length.should eq(1)
    read_creche.activities[0].label.should eq("Journée Entière")
    read_creche.activities[0].starts_at.hour.should eq(8)
    read_creche.activities[0].starts_at.min.should eq(30)
    read_creche.activities[0].ends_at.hour.should eq(19)
    read_creche.activities[0].ends_at.min.should eq(0)
    read_creche.activities[0].section.should eq(7)

    activity = read_creche.activities.first
    activity.creche.id.should eq(read_creche.id)
  end

  it 'select activity' do
    creche = Creche.new({name: "activity_spec02", city: "cergy", email: "achille@gmail.com"})
    activity = Activity.default
    creche.activities<<activity
    expect(creche.save).to be_true

    read_creche = Creche.first({name: "activity_spec02"})
    activity = read_creche.activities.detect { |a| a.label == "Journée Entière"}
    expect(activity).to be_true
  end

  it 'get activity via its relationship with creche' do
    creche = Creche.new({name: "activity_spec03", city: "cergy", email: "achille@gmail.com"})
    activity = Activity.default
    creche.activities<<activity
    expect(creche.save).to be_true

    read_activities = Activity.all({creche: { name: "activity_spec03"}})
    expect(read_activities).to be_true
    read_activities.length.should eq(1)
  end
end