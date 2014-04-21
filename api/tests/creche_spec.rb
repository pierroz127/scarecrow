require_relative '../models/init'
require_relative './datamapper_spec'

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
      label: "journée entière",
      starts_at: Time.new(1, 1, 1, 8, 30),
      ends_at: Time.new(1, 1, 1, 19),
      section: 1
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
end