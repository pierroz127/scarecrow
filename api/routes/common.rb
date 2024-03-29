module Common 
  # method to deeply symbolize the keys of hash or the elements of an array
  def deep_symbolize(obj)
    return obj.inject({}){|memo,(k,v)| memo[k.to_sym] =  deep_symbolize(v); memo} if obj.is_a? Hash
    return obj.inject([]){|memo,v    | memo           << deep_symbolize(v); memo} if obj.is_a? Array
    return obj
  end

  def return_error(err_msg)
    status 400
    { message: err_msg}.to_json
  end
end