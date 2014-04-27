module EventHelper
  def self.get_cal_events(creche)
    creche.activities.inject([]) do
        |memo, a| 
        memo | (a.events.map do
          |e| 
          {
            title: "#{a.label} (#{e.great_cradles}, #{e.medium_cradles}, #{e.baby_cradles})", 
            allDay: true, 
            start: e.starts_on.strftime("%Y/%m/%d %H:%M:%S")
          }
        end)
      end
  end
end