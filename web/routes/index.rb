# encoding: utf-8
class Scarecrow < Sinatra::Application
#  before do
#     content_type :json    
#     headers 'Access-Control-Allow-Origin' => '*', 
#             'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']  
#  end
  
  get '/' do 
    send_file File.join('public', 'index.html')
  end

end
