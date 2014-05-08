var app = angular.module('scarecrow.controllers');
  app.controller('ActivityCtrl', ['$scope', '$routeParams', '$location', 'apiProxy', 'session', '_', 
    function($scope, $routeParams, $location, apiProxy, session, _) 
    {
      var __crecheId = $routeParams.crecheId;

      var __initialize = function() 
      {
        // get creche list et selected creche
        apiProxy().getCreches(session().getUserEmail(),
          function(data)
          {
            $scope.creches = data.creches;
            $scope.creche = apiProxy().getCrecheById(__crecheId);
          });

        if ($routeParams.edit == "edit") 
        {
          $scope.mode = "edit";
        }
        else
        {
          $scope.mode = "view";
        }
        $scope.crecheMenu = "activity";
        $scope.selectedActivity = { id: 0 };

        if (/\d+/.test(__crecheId)) 
        {
          apiProxy().getActivities(__crecheId, 
            function(data, status) 
            {
              $scope.activities = data.activities;
            });
        }
      };

      __initialize();

      // common function for the creche list
      $scope.getCrecheName = function()
      {
        return apiProxy().getCrecheNameById(__crecheId);
      }

      $scope.select = function(activity) 
      {
        //console.log(JSON.stringify(activity));
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
            $scope.mode = "view";
          },
          function(error) 
          {
            $scope.errormessage = error; 
          })
        // TODO: save the activity
        $location.path('/creche/' + __crecheId + '/activity');
      }

      $scope.errorIsVisible = function() 
      {
        return $scope.errormessage !== undefined;
      }
    }
  ]
);
