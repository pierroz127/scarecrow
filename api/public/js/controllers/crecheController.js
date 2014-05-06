var app = angular.module('scarecrow.controllers');
  app.controller('CrecheCtrl', 
    ['$scope', '$log', '$location', '$routeParams', '$modal', 'session', 'apiProxy', '_',
    function($scope, $log, $location, $routeParams, $modal, session, apiProxy, _ ) {
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
          $scope.isModal = false;
          //$scope.crecheCalendar.fullCalendar('refetchEvents');
          for (var i=0; i<cal_events.length; i++) {
            $scope.events.push(cal_events[i]);
          }
        }, function () {
          $scope.isModal = false;
          $log.info('Modal dismissed at: ' + new Date());
        });
        //$scope.crecheCalendar.fullCalendar('refetchEvents');
      }

      var getCreche = function(crecheId, callback) {
        var r = /\d+/
        if (r.test(crecheId)) {
          console.log("edit creche "+ crecheId);
          apiProxy().getCreche(crecheId, function(data, status) {
            $scope.creche = data.creche;
            $scope.creche.sections = _.map(data.creche.sections, function(s) {
              s.min_birthdate = new Date(s.min_birthdate);
              s.max_birthdate = new Date(s.max_birthdate);
              return s;
            });
            callback();
          });
        }
      }


      var initialize = function() {
        apiProxy().getCreches(session().getUserEmail(), function(data, status) {
          $scope.creches = data.creches;
        }, function() {
          $log.error('getCreches returned an error: ' + data.message);
        });
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
            email: session().user.email,
            sections: [{
              name: '',
              min_birthdate: new Date(2012,0,1),
              max_birthdate: new Date(2012,11,31)
            }]
          };
          $scope.openDays = [];
          for (var i=0; i<6; i++) {
            $scope.openDays.push({
              day_of_week: i + 1, 
              isOpen: true, 
              opens_at: new Date(2000, 1, 1, 7, 0), 
              closes_at: new Date(2000, 1, 1, 19, 0)});
          }
          $scope.openDays.push({day_of_week: 6, isOpen: false});
          $scope.openDays.push({day_of_week: 0, isOpen: false});
          $scope.menu = "new";
        } else  if ($routeParams.sub === "edit") {
          //Edit a creche
          getCreche($routeParams.crecheId, function() {
            $scope.menu = "edit";
            $scope.openDays = [];
            var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
            console.log('even: ' + even);
            for (var i=0; i<7; i++) {
              var dayIdx = (i+1)%7;
              var e = _.find($scope.creche.open_days, function(od) { return od.day_of_week === dayIdx });
              if (e) {
                $scope.openDays.push({
                  day_of_week: dayIdx,
                  isOpen: true,
                  closes_at: new Date(e.closes_at),
                  opens_at: new Date(e.opens_at)
                });
              } else {
                $scope.openDays.push({day_of_week: dayIdx, isOpen: false});
              }
            }
          });
        } else {
          getCreche($routeParams.sub, function() {
            $scope.menu = "view";
            $scope.viewMenu = "home";
            $scope.events = [];
            $scope.eventSources = [
              $scope.events, 
              {
                events: function(start, end, callback) {
                  apiProxy().getCalendarEvents($scope.creche.id, 
                    function(data, status) {
                      $scope.events.splice(0, $scope.events.length);
                      $log.info(data.events.length + ' events loaded from API');
                      callback(data.events);
                    },
                    function() {});
                }
              }
            ];
          });
        }
      }

      var s = session();
      if (s && s.user && s.user.email !== '') {
        $log.log('user email: ' + s.user.email);

        initialize();

      } else {
        $location.path('/');
      }

      $scope.go = function(crecheId) {
        $location.path("/creche/" + crecheId);
      }

      $scope.isActive = function(crecheId) {
        return $scope.creche && $scope.creche.id == crecheId ? 'active' : '';
      }

      var __addOpenDays = function() {
        $scope.creche.open_days = [];
        for (var i=0; i<$scope.openDays.length; i++) {
          var od = $scope.openDays[i];
          if (od.isOpen) {
            var clone = {};
            for (var key in od) {
              if (key !== 'isOpen') {
                clone[key] = od[key];
              }
            }
            $scope.creche.open_days.push(clone);
          }
        }
      };

      var __validateSections = function() {
        temp = _.filter($scope.creche.sections, function(s) {
          return s.name!='' && s.min_birthdate && s.max_birthdate;
        });
        $scope.creche.sections = temp;
      };

      $scope.saveCreche = function() {
        __addOpenDays();
        __validateSections();
        if($scope.menu === "new") { 
          apiProxy().addNewCreche($scope.creche, function(data, status) {
            $scope.creches.push($scope.creche);
            $scope.creationFail = false;
            $location.path('/creche');
          }, function() {
            $scope.creationFail = true;
          });
        } else if ($scope.menu === "edit") {
          apiProxy().updateCreche($scope.creche, function(data, status) {
            $location.path('/creche/' + $scope.creche.id);
          }, function() {
            $scope.creationFail = true;
          })
        } 
      };


      var days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      
      $scope.getStrDay = function(day_of_week) {
        return days[day_of_week];
      };

      // TODO: refactor!!
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

      $scope.setViewMenu = function(menu) {
        $scope.viewMenu = menu;
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

      $scope.deleteCreche = function(crecheId) {
        apiProxy().deleteCreche(crecheId, function() {
          $location.path('/creche');
        }, function() {});
      }

      // Section management 
      // ----
      $scope.addSection = function() {
        $scope.creche.sections.push({
          name: '',
          min_birthdate: new Date(2012, 0, 1),
          max_birthdate: new Date(2012, 11, 31)
        })
      };

      $scope.deleteSection = function() {

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


