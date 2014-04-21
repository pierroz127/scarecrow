angular.module('scarecrow.controllers')
  .controller('ConfigureCtrl', ['$scope', '$log', '$location', 'session', 'apiProxy', function($scope, $log, $location, session, apiProxy) {
    var initialize = function() {
      apiProxy().getCreches(session().getUserEmail(), function(data, status) {
        $scope.creches = data.creches;
      }, function() {
        $log.error('getCreches returned an error: ' + data.message);
      });
      $scope.isCreatingNewCreche = false;
      $scope.creationFail = false;
    } 

    var s = session();
    if (s && s.user && s.user.email !== '') {
      $log.log('user email: ' + s.user.email);

      initialize();

    } else {
      //$location.path('/');
      s.set("pierre@leroy.com", "pierroz");
    }

    $scope.addCreche = function() {
      $scope.isCreatingNewCreche = true;
      $scope.newCreche = {
        email: s.user.email
      };
    };

    $scope.validate = function() {
      apiProxy().addNewCreche($scope.newCreche, function(data, status) {
        $scope.creches.push($scope.newCreche);
        $scope.isCreatingNewCreche = false;
        $scope.creationFail = false;
      }, function() {
        $scope.creationFail = true;
      });
    };
  }
]);