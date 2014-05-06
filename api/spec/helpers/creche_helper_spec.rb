require_relative '../../models/init'
require_relative '../../helpers/creche_helper'
require_relative '../models/datamapper_spec'


describe 'creche_helper spec' do
  before(:all) do
    puts "coucou it's before"
    #setup database
    DatamapperSpec.init
  end

  it 'create creche with open days' do
    attributes = {
      email: "test01@gmail.com",
      city: "Paris",
      zipcode: 95000,
      name: "smartcity",
      open_days: [
        { day_of_week: 1, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 2, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ]
    }

    creche = CrecheHelper::create_with_associations attributes
    expect(creche.save).to be_true
    read_creche = Creche.get(creche.id)
    expect(read_creche).to be_true
    read_creche.open_days.length.should eq(2)
  end

  it 'try to create creche with wrong attributes' do
    attributes = {
      email: "test@gmail.com",
      city: "Paris",
      zipcode: 95000,
      name: "smartcity",
      open_days: [
        { day_of_week: 1, starts_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 2, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ]
    }
    #TODO: catch an exception here
    #creche = CrecheHelper::create_with_associations attributes
    #expect(creche.save).to be_false
  end

  it 'creache updated with open_days' do
    creche = Creche.new({email: "new_test@gmail.com", city: "Paris", name: "smartcity"})
    creche.save

    expect(creche.update({
      name: "smartcity2",
      open_days: [
        { day_of_week: 1, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 2, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ]})).to be_true
    #CrecheHelper::update_with_associations(creche.id, {email: "new_test@gmail.com", city: "Paris", name: "smartcity"})
    read_creche = Creche.get(creche.id)
    expect(read_creche).to be_true
    read_creche.name.should eq("smartcity2")
    read_creche.open_days.length.should eq(2)
  end

  it 'creche updated with open_days' do
    creche = Creche.new({
      email: "new_test@gmail.com", 
      city: "Paris", 
      name: "smartcity",
      open_days: [
        { day_of_week: 1, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 2, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ]})
    creche.save

    read_creche = Creche.get(creche.id)
    expect(read_creche).to be_true
    read_creche.open_days.length.should eq(2)
    read_creche.open_days.destroy
    expect(read_creche.update({
      name: "smartcity2",
      open_days: [
        { day_of_week: 1, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 3, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 5, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ]})).to be_true
    #CrecheHelper::update_with_associations(creche.id, {email: "new_test@gmail.com", city: "Paris", name: "smartcity"})
    #read_creche = Creche.get(creche.id)
    #expect(read_creche).to be_true
    #read_creche.name.should eq("smartcity2")
    #read_creche.open_days.length.should eq(3)
    #expect(read_creche.open_days.any?{|od| od.day_of_week == 2}).to be_false
    #expect(read_creche.open_days.any?{|od| od.day_of_week == 3}).to be_true
  end

  it 'update creche again...' do
    creche = Creche.new({
      email: "new_test@gmail.com", 
      city: "Paris", 
      name: "smartcity",
      open_days: [
        { day_of_week: 1, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 2, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ]})
    creche.save

    read_creche = Creche.get(creche.id)
    read_creche.open_days.destroy
    attributes = {
      :id=>creche.id, 
      :email=>"pierre@leroy.com", 
      :name=>"chat perché", 
      :city=>"cergy", 
      :director_firstname=>nil, 
      :director_lastname=>nil, 
      :number=>nil, 
      :street=>nil, 
      :zipcode=>95000, 
      :description=>"hip hop hup", 
      :fax=>nil, 
      :phone=>nil, 
      :activities=>[{
          :id=>2, 
          :label=>"Journée Entière", 
          :starts_at=>"2000-01-01T08:30:00+00:00", 
          :ends_at=>"2000-01-01T19:00:00+00:00", 
          :description=>nil, 
          :section=>7, 
          :creche_id=>2}], 
      :open_days=>[
        {:day_of_week=>1, :closes_at=>"2000-02-01T18:00:00.000Z", :opens_at=>"1900-01-01T07:30:00.000Z"}, 
        {:day_of_week=>2, :closes_at=>"2000-02-01T18:00:00.000Z", :opens_at=>"1900-01-01T07:30:00.000Z"}, 
        {:day_of_week=>4, :closes_at=>"2000-02-01T18:00:00.000Z", :opens_at=>"1900-01-01T07:30:00.000Z"}, 
        {:day_of_week=>5, :closes_at=>"2000-02-01T18:00:00.000Z", :opens_at=>"1900-01-01T07:30:00.000Z"}]
      }
      expect(read_creche.update(attributes)).to be_true
  end

  it 'update sections' do
    creche = Creche.new({
      email: "new_test@gmail.com", 
      city: "Paris", 
      name: "smartcity",
      open_days: [
        { day_of_week: 1, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) },
        { day_of_week: 2, opens_at: DateTime.new(1970, 1, 1, 8, 30), closes_at: DateTime.new(1970, 1, 1, 19, 0) }
      ],
      sections: [{:name=>"petits loulous", :min_birthdate=>"2010-12-31T23:00:00.000Z", :max_birthdate=>"2011-12-30T23:00:00.000Z"}]
    })
    expect(creche.save).to be_true
    read_creche = Creche.get(creche.id)
    read_creche.sections.length.should eq(1)
    id = read_creche.sections.first.id


    CrecheHelper::update_sections(creche, [
      {:name=>"grands loulous", :min_birthdate=>"2010-12-31T23:00:00.000Z", :max_birthdate=>"2011-12-30T23:00:00.000Z", id: id},
      {:name=>"moyens", :min_birthdate=>"2011-12-31T23:00:00.000Z", :max_birthdate=>"2012-12-30T23:00:00.000Z"}])

    read_creche = Creche.get(creche.id)
    read_creche.sections.length.should eq(2)
  end
end
