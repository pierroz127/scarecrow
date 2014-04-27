require_relative 'common'
require_relative '../models/init'
require_relative '../helpers/event_helper'
require 'json'

class Scarecrow < Sinatra::Application
  include Common

  get '/creche/index' do 
    email = params[:user]
    puts 'get creche for user ' + email
    creches = Creche.all({email: email})
    content_type :json
    { creches: creches }.to_json
  end

  get '/creche' do 
    creche = Creche.get(params[:crecheid])
    if (creche)
      #content_type :json
      "{\"creche\":" + creche.to_json_with_attributes + "}"
    else
      status = 400
      { message: 'UNKNOWN_CRECHE' }.to_json
    end
  end

  post '/creche/new' do 
    puts @params
    creche = Creche.new(@params)
    # TEMP create a default activity
    creche.activities << Activity.default
    if (creche.save)
      { message: 'CRECHE_CREATION_SUCCESSFULL' }.to_json
    else
      status = 400
      { message: 'CRECHE_CREATION_FAIL' }.to_json
    end
  end

  get '/creche/activity' do
    creche = Creche.get(params[:crecheid])
    if (creche)
      activities = creche.activities
      { activities: activities }.to_json
    else
      status 400
      { message: 'UNKNOWN_CRECHE' }.to_json
    end
  end

  post '/creche/:creche/:activity/event/new' do |cid, aid|
    puts @params
    creche = Creche.get(cid)
    if (creche)
      activity = creche.activities.detect {|act| act.id.to_s == aid.to_s}
      if (activity)
        Event.filter(@params)
        event = Event.new(@params)
        activity.events << event
        if (activity.save) 
          return { 
            message: 'EVENT_CREATION_SUCCESSFUL',
            cal_events: [{
                title: "#{activity.label} (#{event.great_cradles}, #{event.medium_cradles}, #{event.baby_cradles})",
                allDay: true,
                start: event.starts_on
              }]
          }.to_json
        end
      end
    end
    return_error('EVENT_CREATION_SUCCESSFUL')
  end

  get '/creche/:creche/event' do |cid|
    creche = Creche.get(cid)
    if creche
      events = EventHelper::get_cal_events(creche)
      { events: events }.to_json
    else
      return_error("UNKNOWN_CRECHE")
    end
  end

  get '/creche/destroy/:id' do 
    creche = Creche.get(params[:id])
    if (creche.destroy)
      { message: 'CRECHE_DELETE_SUCCESSFUL' }.to_json
    else
      status 400
      { message: 'CRECHE_DELETE_FAIL' }.to_json
    end
  end
end