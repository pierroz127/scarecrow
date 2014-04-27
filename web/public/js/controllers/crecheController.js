var app = angular.module('scarecrow.controllers');
  app.controller('CrecheCtrl', 
    ['$scope', '$log', '$location', '$routeParams', '$modal', 'session', 'apiProxy', 
    function($scope, $log, $location, $routeParams, $modal, session, apiProxy) {
      $scope.dayClick = function( date, allDay, jsEvent, view ) { 
        $log.info('hop! day clicked ' + date);
        var today = new Date();
          $scope.isModal = true;
        var modalInstance = $modal.open({
          templateUrl: '/views/creche/event.html',
          controller: eventInstanceCtrl,
          resolve: {
            crecheId: function() { return $scope.creche.id; },
            activities: function() { return $scope.creche.activities; },
            calEvent: function() { return {
                starts_on: date,
                frequency: 0
              }; 
            },
            apiProxy: function() { return apiProxy(); }
          }
        });

        modalInstance.result.then(function(cal_events) {
          //for (var i=0; i<cal_events.length; i++) {
          //  $scope.events.push(cal_events[i]);
          //}
          $scope.isModal = false;
          $scope.crecheCalendar.fullCalendar('refetchEvents');
        }, function () {
          $scope.isModal = false;
          $log.info('Modal dismissed at: ' + new Date());
        });
        //$scope.crecheCalendar.fullCalendar('refetchEvents');
      }


      var initialize = function() {
        apiProxy().getCreches(session().getUserEmail(), function(data, status) {
          $scope.creches = data.creches;
        }, function() {
          $log.error('getCreches returned an error: ' + data.message);
        });
        $scope.crecheCalendar = undefined;
        $scope.isModal = false;

        $scope.uiConfig = {
          calendar: {
            height: 450,
            editable: true,
            header:{
              left: 'title',
              center: '',
              right: 'today prev,next'
            },
            dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            dayClick: $scope.dayClick
          }
        };

        /* Sub navigation */
        if ($routeParams.sub === "new") {
          $scope.creche = {
            email: session().user.email
          };
          $scope.menu = "new";
        } else {
          var r = /\d+/
          if (r.test($routeParams.sub)) {
            apiProxy().getCreche($routeParams.sub, function(data, status) {
              $scope.menu = "view";
              $scope.creche = data.creche;
              $scope.viewMenu = "home";
              $scope.events = [];
              $scope.eventSources = [
                $scope.events, 
                {
                  events: function(start, end, callback) {
                    apiProxy().getCalendarEvents($scope.creche.id, 
                      function(data, status) {
                        $log.info(data.events.length + ' events loaded from API');
                        callback(data.events);
                      },
                      function() {});
                  }
                }
              ];
            })
          }
        }
      }

      var s = session();
      if (s && s.user && s.user.email !== '') {
        $log.log('user email: ' + s.user.email);

        initialize();

      } else {
        $location.path('/');
      }

      $scope.validate = function() {
        apiProxy().addNewCreche($scope.creche, function(data, status) {
          $scope.creches.push($scope.creche);
          $scope.creationFail = false;
          $location.path('/configure');
        }, function() {
          $scope.creationFail = true;
        });
      };

      $scope.setViewMenu = function(menu) {
        $scope.viewMenu = menu;
        if (menu == 'schedule') {
          $scope.crecheCalendar.fullCalendar('refetchEvents');
        }

      };

      $scope.isViewMenu = function(menu) {
        return $scope.viewMenu === menu;
      };

      $scope.changeCalendarView = function(view, calendar) {
        calendar.fullCalendar('changeView', view);
      };

      /* Change View */
      $scope.renderCalender = function(calendar) {
        if(calendar){
          calendar.fullCalendar('render');
        }
      };

      $scope.setCalendar = function(calendar) {
        if (!$scope.crecheCalendar) { 
          console.log('set calendar!!');
          $scope.crecheCalendar = calendar;
          return '';
        }
      }

      $scope.deleteCreche = function(crecheId) {
        apiProxy().deleteCreche(crecheId, function() {
          $location.path('/configure');
        }, function() {});
      }
    }
  ]);

  app.directive('crecheNew', function(){
    return {
      restrict: 'E',
      templateUrl: 'views/creche/edit.html'
    };
  });

  app.directive('crecheView', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/creche/view.html'
    };
  });


var eventInstanceCtrl  = function($scope, $modalInstance, apiProxy, crecheId, activities, calEvent) {
  $scope.calEvent = calEvent;
  $scope.activities = activities;
  $scope.eventCreationFail = false;

  var convertToLocale = function(utc) {
    var dt = new Date();
    var offset = dt.getTimezoneOffset() * 60000; /* gives the offset with utc in msec */
    return new Date(utc.getTime() - offset);
  } 

  $scope.addEvent = function(activityId) {
    // TODO
    $scope.calEvent.starts_on = convertToLocale($scope.calEvent.starts_on);
    console.log('event to be saved: ' + JSON.stringify($scope.calEvent));
    apiProxy.addEvent(crecheId, activityId, $scope.calEvent, 
      function(data, status){
        // TODO: data should return the new events to insert in the calendar
        $modalInstance.close(data.cal_events);
      }, function(data, status) {
        $scope.errorMessage = data.message;
        $scope.eventCreationFail = true;
      });
  };

  $scope.getStrTime = function(dateString) {
    if (dateString) {
      var dt = new Date(dateString);
      var h = dt.getHours();
      var m = dt.getMinutes();
      return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    } else {
      return "";
    }
  };

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };
}


