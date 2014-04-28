var apiUri = '';

angular.module('scarecrow.controllers')
  .controller('SignupCtrl', ['$scope', '$http', '$location', '$route', 'Child', function($scope, $http, $location, $route, Child) {
    var StatusEnum = {
      IN_PROGRESS : 1,
      SUCCESS : 2,
      FAIL : 3
    };

    var ModeEnum = {
      SIGN_UP : 1,
      READ_PROFILE : 2,
      EDIT_PROFILE : 3
    };
    
    var getMode = function(path) {
      console.log('path: ' + path);
      if (path === '/signup') {
        return ModeEnum.SIGN_UP;
      }
      return ModeEnum.READ_PROFILE;
    }

    var d = new Date();
    $scope.maxYear = d.getFullYear();

    $scope.allChildrenValid = true;

    $scope.user = {
      'children' : []
    };

    $scope.status = StatusEnum.IN_PROGRESS; 

    $scope.errorMessage = "";

    $scope.mode = getMode($location.path());

    $scope.signup = function () {
      $http.post(apiUri + '/auth/signup', { "user": $scope.user })
           .success(function(data, status) {
              console.log('signup succeeded');
              $scope.status = StatusEnum.SUCCESS;
             })
           .error(function(data, status) {
              console.log('signup failed: ' + data.message);
              $scope.status = StatusEnum.FAIL;
              $scope.errorMessage = data.message;
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

    $scope.statusIsInProgress = function() {
      return $scope.status === StatusEnum.IN_PROGRESS;
    }

    $scope.statusIsSuccess = function() {
      return $scope.status === StatusEnum.SUCCESS;
    }

    $scope.statusIsFail = function() {
      return $scope.status === StatusEnum.FAIL;
    }

    $scope.modeIsSignUp = function() {
      return $scope.mode === ModeEnum.SIGN_UP;
    }
  }]);