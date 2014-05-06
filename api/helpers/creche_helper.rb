module CrecheHelper
  def self.create_with_associations(attributes)
    open_days = []
    if attributes.has_key? :open_days
      attributes[:open_days].each do |od_attr|
        open_days << (OpenDay.new od_attr)
      end
      attributes.delete :open_days
    end
    creche = Creche.new attributes
    open_days.each {|od| creche.open_days << od} unless open_days.length == 0
    return creche
  end

  def self.update_with_associations(id, attributes)
    creche = Creche.get(id)
    return unless creche
    if (attributes[:open_days])
      attributes[:open_days].each do |od_attr|
        #TODO handle error cases !!!
        # update or save existing open days
        open_day = creche.open_days.detect {|od| od.id == od_attr[:id]}
        if (open_day)
          open_day.update(od_attr)
        else
          open_day = OpenDay.new(od_attr)
          open_day.save
        end
      end 

      # Delete open_days
      to_delete = creche.open_days.select do |od| 
        !attributes[:open_days].any? do |od_attr| 
          od_attr[:id] == od.id 
        end
      end
      to_delete.each { |od| od.destroy }
      attributes.delete :open_days
    end
    creche.update(attributes)
  end

  def self.update_sections(creche, attributes)
    puts "attributes: #{attributes}"
    ids = []
    attributes.each do |s_attr|
      puts "section id: #{s_attr[:id]}"
      section = creche.sections.detect {|s| s.id == s_attr[:id]}
      if (section) 
        puts "section found"
        section.update(s_attr)
      else
        puts "new section"
        section = Section.new(s_attr)
        creche.sections << section
        creche.save
      end
      ids << section.id
    end

    to_delete = creche.sections.select do |s|
      !ids.any? do |id|
        id == s.id
      end
    end
    puts "#{to_delete.length} sections to delete"
    to_delete.each { |s| s.destroy } if to_delete.length > 0
  end
end