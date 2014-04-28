// TODO(pile) make it configurable
var apiUri = '';

angular.module('scarecrow.controllers')
  .controller('LoginCtrl', ['$scope', '$modal', '$http', '$log', '$cookieStore', '$location', 'session', 
    function($scope, $modal, $http, $log, $cookieStore, $location, session) {
    var tokenIsValid = function(tokenDate) {
        console.log('token date: ' + tokenDate);
        var validDate = new Date(tokenDate);
        validDate.setDate(validDate.getDate() + 1);
        var now = new Date();
        return validDate > now;
    }

    var reset = function () {
      session().reset();
      $scope.user = { 'email' : ''};
      $scope.isModal = false;
      $scope.isAuthenticated = false;
      $scope.errorVisible = false;
    }

    var initialize = function() {
      var cookie = $cookieStore.get('scarecrow_token');
      if (cookie && cookie.date && tokenIsValid(cookie.date)) {
        console.log('token present and valid');
        $scope.isAuthenticated = true;
        $scope.user = { 'email' : cookie.email }
        session().set(cookie.email);
      } else {
        console.log('no valid token');
        $scope.isAuthenticated = false;
        $scope.user = { 'email' : ''};
      }
      $scope.isModal = false;
      $scope.errorVisible = false;
    } 

    initialize();

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
          session().set(email);
        }, function () {
          $scope.isModal = false;
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.logout = function() {
      var cookie = $cookieStore.get('scarecrow_token');
      $http.post(apiUri + '/auth/logout', {"email": $scope.user.email, "token": cookie.token})
        .success(function(data, status) {
          console.log('user logged out');
          reset();
          $cookieStore.remove('scarecrow_token');
          $location.path('/');
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
          cookieStore.put('scarecrow_token', {
            date: new Date(),
            token: data.token,
            email: user.email
          });

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