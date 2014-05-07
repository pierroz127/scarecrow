var app = angular.module('scarecrow.controllers');
  app.controller('ActivityCtrl', ['$scope', '$routeParams', '$location', 'apiProxy', '_', 
    function($scope, $routeParams, $location, apiProxy) 
    {
      var initialize = function() 
      {
        if ($routeParams.edit == "edit") 
        {
          $scope.mode = "edit";
        }
        else
        {
          $scope.mode = "view";
        }

        $scope.mode = "view";
        $scope.crecheMenu = "activity";
        $scope.selectedActivity = { id: 0 };

        var r = /\d+/
          , crecheId = $routeParams.crecheId;

        if (r.test(crecheId)) 
        {
          console.log("edit creche "+ crecheId);
          apiProxy().getCreche(crecheId, function(data, status) 
          {
            $scope.creche = data.creche;
          });
        }
      };

      initialize();

      $scope.select = function(activity) 
      {
        console.log(JSON.stringify(activity));
        $scope.selectedActivity = activity;
      };

      $scope.isSelected = function(activityId) 
      {
        return $scope.selectedActivity.id == activityId;
      };

      $scope.isReadOnly = function() 
      {
        return $scope.mode == "view";
      };

      $scope.edit = function() 
      {
        $scope.mode = "edit";
      }

      $scope.cancel = function()
      {
        $scope.mode = "view";
        $scope.errormessage = undefined;
      }

      $scope.save = function() 
      {
        apiProxy().addOrUpdateActivity($scope.selectedActivity, 
          function(data, status) 
          {
            $scope.creche = data.creche;
            $scope.selectedActivity = data.activity;
            $scope.errormessage = undefined;
            $scope.mode = "view";
          },
          function(error) 
          {
            $scope.errormessage = error; 
          })
        // TODO: save the activity
        $location.path('/creche/' + $routeParams.crecheId + '/activity');
      }

      $scope.errorIsVisible = function() 
      {
        return $scope.errormessage !== undefined;
      }
    }
  ]
);
