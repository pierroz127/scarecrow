var app = angular.module('scarecrow.controllers');
app.controller('ScheduleCtrl', ['$scope', '$routeParams', '$location', '$modal', '$log', 'apiProxy', 'session', '_', 
  function($scope, $routeParams, $location, $modal, $log, apiProxy, session, _)
  {
    var __crecheId = $routeParams.crecheId;

    __dayClick = function(date, allDay, jsEvent, view)
    {
      console.log('hop! day clicked ' + date);
      var today = new Date();
      $scope.isModal = true;
      var modalInstance = $modal.open(
      {
        templateUrl: '/views/creche/event.html',
        controller: eventInstanceCtrl,
        resolve: 
        {
          crecheId: function() { return __crecheId; },
          activities: function() { return $scope.activities; },
          calEvent: function() { 
            return {
              starts_on: date,
              frequency: 0
            }; 
          },
          apiProxy: function() { return apiProxy(); }
        }
      });

      modalInstance.result.then(
        function(cal_events) 
        {
          $scope.isModal = false;
          for (var i=0; i<cal_events.length; i++)
          {
            $scope.events.push(cal_events[i]);
          }
        },
        function() 
        {
          $scope.isModal = false;
          console.log('Modal dismissed at: ' + new Date());
        });
    };

    var __initialize = function()
    {
      apiProxy().getCreches(session().getUserEmail(),
        function(data)
        {
          $scope.creches = data.creches;
          $scope.creche = apiProxy().getCrecheById(__crecheId);
        });
      apiProxy().getActivities(__crecheId, 
        function(data, status)
        {
          $scope.activities = data.activities;
        })

      $scope.events = [];
      $scope.eventSources = [
        $scope.events, 
        {
          events: function(start, end, callback) 
          {
            apiProxy().getCalendarEvents(__crecheId, 
              function(data, status) 
              {
                $scope.events.splice(0, $scope.events.length);
                $log.info(data.events.length + ' events loaded from API');
                callback(data.events);
              },
              function() {});
          }
        }
      ];
      $scope.crecheMenu = 'schedule';
      $scope.uiConfig = 
        {
          calendar: 
          {
            height: 450,
            editable: true,
            header:
            {
              left: 'title',
              center: '',
              right: 'today prev,next'
            },
            dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            dayClick: __dayClick
          }
        };
    };

    __initialize();

    // TODO refactor this function common to many controllers
    $scope.getCrecheName = function()
    {
      return apiProxy().getCrecheNameById(__crecheId);
    };

    $scope.changeCalendarView = function(view, calendar) 
    {
      calendar.fullCalendar('changeView', view);
    };

    /* Change View */
    $scope.renderCalender = function(calendar)
    {
      if(calendar)
      {
        calendar.fullCalendar('render');
      }
    };
  }
]); 

var eventInstanceCtrl  = function($scope, $modalInstance, apiProxy, crecheId, activities, calEvent) 
{
  $scope.calEvent = calEvent;
  $scope.activities = activities;
  $scope.eventCreationFail = false;

  var convertToLocale = function(utc) 
  {
    var dt = new Date();
    var offset = dt.getTimezoneOffset() * 60000; /* gives the offset with utc in msec */
    return new Date(utc.getTime() - offset);
  } 

  $scope.addEvent = function(activityId) 
  {
    // TODO
    $scope.calEvent.starts_on = convertToLocale($scope.calEvent.starts_on);
    console.log('event to be saved: ' + JSON.stringify($scope.calEvent));
    apiProxy.addEvent(crecheId, activityId, $scope.calEvent, 
      function(data, status)
      {
        // TODO: data should return the new events to insert in the calendar
        $modalInstance.close(data.cal_events);
      }, 
      function(data, status) 
      {
        $scope.errorMessage = data.message;
        $scope.eventCreationFail = true;
      });
  };

  $scope.getStrTime = function(dateString) 
  {
    if (dateString) 
    {
      var dt = new Date(dateString);
      var h = dt.getHours();
      var m = dt.getMinutes();
      return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    } 
    else
    {
      return "";
    }
  };

  $scope.today = function() 
  {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () 
  {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () 
  {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) 
  {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() 
  {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) 
  {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = 
  {
    'year-format': "'yy'",
    'starting-day': 1
  };
}
