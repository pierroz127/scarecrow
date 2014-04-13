var apiUri = 'http://localhost:8585';

angular.module('scarecrow.controllers')
  .controller('SignupCtrl', ['$scope', '$http', '$location', '$log', 'Child', function($scope, $http, $location, $log, Child) {
    var d = new Date();
    $scope.maxYear = d.getFullYear();
    $scope.allChildrenValid = true;

    $scope.user = {
      'children' : []
    };


    $scope.signup = function () {
      $http.post(apiUri + '/auth/signup', { "user": $scope.user })
           .success(function(data, status) {
              console.log('signup succeeded');
              $location.path('/');
           })
           .error(function(data, status) {
              console.log('signup failed: ' + data.message);
           });
       
    };

    $scope.addChild = function() {
      var valid = true;
      for (var i=0; i<$scope.user.children.length; i++) {
        var child = $scope.user.children[i];
        child.updateHeading();
        if (!child.isValid()) {
          valid = false;
        }
      } 
      $scope.allChildrenValid = valid;
      if ($scope.allChildrenValid) {
        $scope.lastChild = new Child();
        $scope.user.children.push($scope.lastChild);
      }
    }

    $scope.removeChild = function(index) {
      $scope.user.children.splice(index, 1);
    }
  }]);