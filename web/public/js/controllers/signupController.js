var apiUri = 'http://localhost:8585';

angular.module('scarecrow.controllers')
  .controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.signup = function () {
      var user = {
        "email": $scope.email,
        "firstname": $scope.firstname,
        "lastname": $scope.lastname,
        "password": $scope.password
      };
      
      $http.post(apiUri + '/auth/signup', { "user": user })
           .success(function(data, status) {
              console.log('signup succeeded');
              $location.path('/');
           })
           .error(function(data, status) {
              console.log('signup failed: ' + data.message);
           });
       
    };
  }]);