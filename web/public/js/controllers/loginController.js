// TODO(pile) make it configurable
var apiUri = 'http://localhost:8585';

angular.module('scarecrow.controllers')
  .controller('LoginCtrl', ['$scope', '$modal', '$http', '$log', '$cookieStore', function($scope, $modal, $http, $log, $cookieStore) {

    var reset = function () {
        $scope.user = { 'email' : ''};
        $scope.isModal = false;
        $scope.isAuthenticated = false;
        $scope.errorVisible = false;
    }

    reset();

    $scope.login = function () {
        $scope.isModal = true;
        var modalInstance = $modal.open({
          templateUrl: '/views/login.html',
          controller: loginInstanceCtrl,
          resolve: {
            http: function() { return $http; },
            cookieStore: function() { return $cookieStore; }
          }
        });

        modalInstance.result.then(function(email) {
          $scope.isAuthenticated = true;
          $scope.user.email = email;
        }, function () {
          $scope.isModal = false;
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    /*$scope.signin = function () {
        $scope.isModal = true;
        var modalInstance = $modal.open({
            templateUrl : '/views/signin.html',
            controller : signinInstanceCtrl
        });

        modalInstance.result.then(function (result) {
            $http.post(apiUri + '/auth/signup', { "user": result })
                 .success(function(data, status) {
                    console.log('signup succeeded');
                 })
                 .error(function(data, status) {
                    console.log('signup failed: ' + data.message);
                 });
        }, function() {
            // dismiss modal window 
            $scope.isModal = false;
        })
    };*/

    $scope.logout = function() {
      var token = $cookieStore.get('token');
      $http.post(apiUri + '/auth/logout', {"email": $scope.user.email, "token": token})
        .success(function(data, status) {
          reset();
          $cookieStore.remove('token');
        })
        .error(function(data, status) {
          console.log(data.message);
        })
    }

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var loginInstanceCtrl = function($scope, $modalInstance, http, cookieStore) {
  $scope.login = function () {
    var user = {
      email : $scope.myEmail,
      password : $scope.myPassword
    }
    console.log("trying to log " + JSON.stringify(user));
    http.post(apiUri + '/auth/login/?', user)
        .success(function(data, status) {
          console.log("token: " + data.token);
          cookieStore.put('token', data.token);
          $modalInstance.close(user.email);
        })
        .error(function(data, status) {
          console.log('login failed: ' + data.message);
          $scope.errorVisible = true;
        });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

/*var signinInstanceCtrl = function ($scope, $modalInstance) {
  $scope.signup = function() {
    $modalInstance.close({ 
        "email": $scope.email,
        "firstname": $scope.firstname,
        "lastname": $scope.lastname,
        "password": $scope.password
    });
  }
};*/