class Child
  include DataMapper::Resource

  property :id,                Serial
  property :firstname,         String,    :required => true
  property :lastname,          String,    :required => true
  property :birthdate,         DateTime,  :required => true
  property :created_at,        DateTime
  property :socialSecurityNbr, String,    :required => true
  property :allergys,          String

  has n, :users, :through => Resource

  def initialize(attr) 
    birthdate = Date.new(attr[:birthdate][:year], attr[:birthdate][:month], attr[:birthdate][:day])
    fields = properties.to_a
    fields.collect! { |p| p.name }
    attr.select! do 
      |k, v| 
      fields.find_index do
        |property|
        property == k
      end
    end
    super attr
  end
end