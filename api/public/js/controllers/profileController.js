angular.module('scarecrow.controllers')
  app.controller('ProfileCtrl', ['$scope', '$routeParams', '$location', 'apiProxy', 'session', '_', 
    function($scope, $routeParams, $location, apiProxy, session, _) 
    {
      apiProxy().getUser($routeParams.id, 
        function(data, status)
        {
          $scope.user = data.user;
          $scope.errorMessage = undefined;
        },
        function(error)
        {
          $scope.errorMessage = error;
        });
      $scope.userMenu = 'profile';
      $scope.mode = "view";

      $scope.errorVisible = function()
      {
        return $scope.errorMessage !== undefined;
      };

      $scope.isReadOnly = function() 
      {
        return $scope.mode == "view";
      };

      $scope.edit = function() 
      {
        $scope.mode = "edit";
      };

      $scope.cancel = function()
      {
        $scope.mode = "view";
        $scope.errormessage = undefined;
      };

      $scope.save = function()
      {
        apiProxy().updateUser($scope.user,
          function(data, status)
          {
            $scope.mode = "view";
            $scope.errorMessage = undefined;
          },
          function(error)
          {
            $scope.errorMessage = error;
          });
      }
    }
  ]);