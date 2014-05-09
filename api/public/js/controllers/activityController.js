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
        $scope.adaptations = [
          { val: 1, label: "Facultative"},
          { val: 2, label: "Obligatoire sauf si parent présent"},
          { val: 3, label: "Obligatoire"}
        ];
        $scope.parentPresences=[
          { val: 1, label: "Oui"},
          { val: 2, label: "Possible"},
          { val: 3, label: "Non"}
        ];


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

      var __getElement = function(value, arr)
      {
        return _.find(arr, function(o) { return o.val === value; });
      };

      var __getElementLabel = function(value, arr)
      {
        var a = __getElement(value, arr);
        if (a)
        {
          return a.label;
        }
        return '';
      };

      // common function for the creche list
      $scope.getCrecheName = function()
      {
        return apiProxy().getCrecheNameById(__crecheId);
      };

      $scope.select = function(activity) 
      {
        //console.log(JSON.stringify(activity));
        $scope.selectedActivity = activity;
      };

      $scope.getAdaptationLabel = function(adaptation) 
      {
        return __getElementLabel(adaptation, $scope.adaptations);
      };

      $scope.getParentPresenceLabel = function(parentPresence)
      {
        return __getElementLabel(parentPresence, $scope.parentPresences);
      };

      /*
       * returns true if activityId is the Id of the selected activity
       */
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
      };

      $scope.cancel = function()
      {
        $scope.mode = "view";
        $scope.errormessage = undefined;
      };

      /*
       * Save an activity
       */
      $scope.save = function() 
      {
        // update the value of the adaptation property
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
      };

      $scope.errorIsVisible = function() 
      {
        return $scope.errormessage !== undefined;
      };
    }
  ]
);
