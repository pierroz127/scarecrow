var app = angular.module('scarecrow.controllers');
  app.controller('CrecheCtrl', 
    ['$scope', '$log', '$location', '$routeParams', '$modal', 'session', 'apiProxy', '_',
    function($scope, $log, $location, $routeParams, $modal, session, apiProxy, _ ) 
    {
      var getCreche = function(crecheId, callback) 
      {
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


      var initialize = function() 
      {
        $scope.crecheMenu = 'home';
        apiProxy().getCreches(session().getUserEmail(), 
          function(data, status) 
          {
            $scope.creches = data.creches;
          }, 
          function()
          {
            $log.error('getCreches returned an error: ' + data.message);
          });

        /* Sub navigation */
        if ($routeParams.sub === "new") 
        {
          $scope.creche = {
            email: session().user.email,
            sections: [{
              name: '',
              min_birthdate: new Date(2012,0,1),
              max_birthdate: new Date(2012,11,31)
            }]
          };
          $scope.openDays = [];
          for (var i=0; i<5; i++) {
            $scope.openDays.push({
              day_of_week: i + 1, 
              isOpen: true, 
              opens_at: new Date(2000, 1, 1, 7, 0), 
              closes_at: new Date(2000, 1, 1, 19, 0)});
          }
          $scope.openDays.push({day_of_week: 6, isOpen: false});
          $scope.openDays.push({day_of_week: 0, isOpen: false});
          $scope.menu = "new";
        } 
        else if ($routeParams.sub === "edit") 
        {
          //Edit a creche
          $scope.crecheId = $routeParams.crecheId;
          getCreche($routeParams.crecheId, 
            function() 
            {
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
        } 
        else 
        {
          $scope.crecheId = $routeParams.sub;
          getCreche($routeParams.sub, 
            function() 
            {
              $scope.menu = "view";
              $scope.viewMenu = "home";
              $scope.events = [];
              $scope.eventSources = [
                $scope.events, 
                {
                  events: function(start, end, callback) 
                  {
                    apiProxy().getCalendarEvents($scope.creche.id, 
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
            });
        }
      }

      var s = session();
      if (s && s.user && s.user.email !== '') 
      {
        $log.log('user email: ' + s.user.email);
        initialize();

      } 
      else
      {
        $location.path('/');
      }

      $scope.getCrecheName = function()
      {
        if ($scope.menu == 'new')
        {
          return 'Nouvelle crèche';
        }
        return apiProxy().getCrecheNameById($scope.crecheId);
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


