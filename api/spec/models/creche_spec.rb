require_relative '../../models/init'
require_relative 'datamapper_spec'

describe "creche spec" do 
  before(:all) do
    puts "coucou it's before"
    #setup database
    DatamapperSpec.init
  end

  it "create a creche" do
    creche = Creche.new({name: "babylou_spec01", city: "cergy", email: "martin@gmail.com"})
    expect(creche.save).to be_true
  end

  it "create a creche with activities" do
    creche = Creche.new({name: "babylou_spec02", city: "cergy", email: "achille@gmail.com"})
    creche.activities.new({
      label: "FULL_DAY",
      starts_at_earliest: Time.new(1, 1, 1, 8, 30),
      starts_at_latest: Time.new(1, 1, 1, 8, 30),
      ends_at_earliest: Time.new(1, 1, 1, 18),
      ends_at_latest: Time.new(1, 1, 1, 19),
    })
    expect(creche.save).to be_true

    read_creche = Creche.first({name: "babylou_spec02"})
    read_creche.activities.length.should eq(1)
    activities = Activity.all({creche: read_creche})
    activities.length.should eq(1)
  end


  it "create several creches for the same administrator" do 
    creche =  Creche.new({name: "test03_creche01", city: "Rueil", email: "hector@gmail.com"})
    expect(creche.save).to be_true
    creche = Creche.new({name: "test03_creche02", city: "Sartrouville", email: "hector@gmail.com"})
    expect(creche.save).to be_true
    read_creches = Creche.all({email: "ulysse@gmail.com"})
    read_creches.length.should eq(0)
    read_creches = Creche.all({email: "hector@gmail.com"})
    read_creches.length.should eq(2)
  end

  it "creche retrieved by id" do
    creche = Creche.new({name: "creche_spec04", city: "cergy", email: "spec4@gmail.com"})
    expect(creche.save).to be_true
    read_creche = Creche.first({name: "creche_spec04"})
    read_creche2 = Creche.get(read_creche.id)
    expect(read_creche2).to be_true
    read_creche2.name.should eq("creche_spec04")
  end

  it "test json serialization" do
    creche = Creche.new({name: "creche_spec05", city: "cergy", email: "bob@gmail.com"})
    activities = Activity.get_default_activities
    activities.each {|a| creche.activities << a}
    expect(creche.save).to be_true
    read_creche = Creche.first({name: "creche_spec05"})
    
    s = read_creche.to_json
    puts s
    expect(s).to be_true
  end
end