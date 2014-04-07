angular.module('scarecrow.controllers')
  .controller('LoginCtrl', ['$scope', '$modal', '$http', '$log', function($scope, $modal, $http, $log) {

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
            http : function() { return $http; }
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

    $scope.signin = function () {
        $scope.isModal = true;
        var modalInstance = $modal.open({
            templateUrl : '/views/signin.html',
            controller : signinInstanceCtrl
        });

        modalInstance.result.then(function (result) {
            $http.post('http://localhost:8585/signup', { "user": result })
                 .success(function(data, status) {
                    console.log('signup succeeded');
                 })
                 .error(function(data, status) {
                    console.log('signup failed: ' + data.message);
                 });
        }, function() {
            /* dismiss modal window */
            $scope.isModal = false;
        })
    };

    $scope.logout = function() {
        reset();
    }

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var loginInstanceCtrl = function($scope, $modalInstance, http) {
  $scope.login = function () {
    var user = {
      email : $scope.myEmail,
      password : $scope.myPassword
    }
    console.log("trying to log " + JSON.stringify(user));
    http.post('http://localhost:8585/login/?', user)
        .success(function(data, status) {
          // connection successful
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

var signinInstanceCtrl = function ($scope, $modalInstance) {
  $scope.signup = function() {
    $modalInstance.close({ 
        "email": $scope.email,
        "firstname": $scope.firstname,
        "lastname": $scope.lastname,
        "password": $scope.password
    });
  }
};