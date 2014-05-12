require 'data_mapper'

module EventHelper
  def self.get_cal_events(creche)
    creche.activities.inject([]) do
        |memo, a| 
        memo | (a.events.map do
          |e| 
          {
            title: "#{a.label} (#{availability_to_s(e)})", 
            allDay: a.label == 'FULL_DAY', 
            start: get_start_time(a, e),
            end: get_end_time(a, e), 
            color: "#{get_color(a.label)}"
          }
        end)
      end
  end

  def self.set_availability_per_section(event, cradles)
    adapter = DataMapper.repository(:default).adapter
    cradles.each do |c|
      adapter.execute('INSERT INTO available_cradles (cradles, event_id, section_id) VALUES (?, ?, ?)', c[:count], event.id, c[:id])
    end
  end

  def self.availability_to_s(event)
    a = event.available_cradles.map { |c| "#{c.section.name}: #{c.cradles}" }
    a.join(", ")
  end

  def self.get_color(activity_label)
    return '#d9534f' if activity_label == 'HALF_DAY_AM'
    return '#5cb85c' if activity_label == 'HALF_DAY_PM'
    return '#5bc0de'
  end

  def self.get_start_time(activity, e)
    start = DateTime.new(e.starts_on.year, e.starts_on.month, e.starts_on.day, activity.starts_at_earliest.hour, activity.starts_at_earliest.min)
    start.strftime("%Y/%m/%d %H:%M:%S")
  end

  def self.get_end_time(activity, e)
    end_time = DateTime.new(e.ends_at.year, e.ends_at.month, e.ends_at.day, activity.ends_at_latest.hour, activity.ends_at_latest.min)
    end_time.strftime("%Y/%m/%d %H:%M:%S")
  end
end