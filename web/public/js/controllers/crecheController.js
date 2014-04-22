var app = angular.module('scarecrow.controllers');
  app.controller('CrecheCtrl', 
    ['$scope', '$log', '$location', '$routeParams', 'session', 'apiProxy', 
    function($scope, $log, $location, $routeParams, session, apiProxy) {
      var initialize = function() {
        apiProxy().getCreches(session().getUserEmail(), function(data, status) {
          $scope.creches = data.creches;
        }, function() {
          $log.error('getCreches returned an error: ' + data.message);
        });
        $scope.uiConfig = {
          calendar:{
            height: 450,
            editable: true,
            header:{
              left: 'title',
              center: '',
              right: 'today prev,next'
            }
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
            })
          }
        }
      }

      var s = session();
      if (s && s.user && s.user.email !== '') {
        $log.log('user email: ' + s.user.email);

        initialize();

      } else {
        //$location.path('/');
        s.set("pierre@leroy.com", "pierroz");
      }

      $scope.validate = function() {
        apiProxy().addNewCreche($scope.creche, function(data, status) {
          $scope.creches.push($scope.creche);
          $scope.creationFail = false;
          $location.path('/configure')
        }, function() {
          $scope.creationFail = true;
        });
      };

      $scope.setViewMenu = function(menu) {
        $scope.viewMenu = menu;
      };

      $scope.isViewMenu = function(menu) {
        return $scope.viewMenu === menu;
      };
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