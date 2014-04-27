
require 'data_mapper'
require 'dm-migrations'

class DatamapperSpec
  def self.init
    DataMapper::Logger.new($stdout, :debug)
    # A sqlite connection:
    DataMapper.setup(:default, 'sqlite:///Users/pile/Projects/Angular/scarecrow/tests/scarecrow.db')
    DataMapper.finalize
    DataMapper.auto_migrate!
  end
end