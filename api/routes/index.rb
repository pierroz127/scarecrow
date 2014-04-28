# encoding: utf-8
class Scarecrow < Sinatra::Application

  get '/' do 
    index_path = File.join(File.dirname(__FILE__), '..', 'public', 'index.html')
    puts index_path
    send_file index_path
  end

end
