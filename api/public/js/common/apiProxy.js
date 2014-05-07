angular.module('scarecrow.common.services')
  .factory('apiProxy', ['$http',
    function($http) {
      var apiProxyUrl = '';
      var __activity_time_properties = ['starts_at_earliest', 'starts_at_latest', 'ends_at_earliest', 'ends_at_latest'];

      var __updateDates = function(data, properties) 
      {
        for (var j=0; j<properties.length; j++) 
        {
          data[properties[j]] = new Date(data[properties[j]]);
        }
      };

      var __updateCrecheDates = function(creche) 
      {
        for (var i=0; i<creche.activities.length; i++) 
        {
          __updateDates(creche.activities[i], __activity_time_properties);
        }
      };

      var __doPost = function(route, data, successCallback, errorCallback) {
        $http.post(apiProxyUrl + route, data).success(successCallback).error(errorCallback);
      };

      var __doGet = function(route, successCallback, errorCallback) {
        $http.get(apiProxyUrl + route).success(successCallback).error(errorCallback);
      };

      var __doPut = function(route, data, successCallback, errorCallback) {
        $http.put(apiProxyUrl + route, data).success(successCallback).error(errorCallback);
      };

      var apiProxy = {
        getCreches : function(userId, successCallback, errorCallback) {
          __doGet('creche/index?user='+userId, successCallback, errorCallback);
        },

        getCreche: function(crecheId, successCallback, errorCallback) {
          __doGet('creche?crecheid=' + crecheId, 
            function(data, status)
            {
              __updateCrecheDates(data.creche);
              successCallback(data, status);
            }, 
            errorCallback);
        },

        addNewCreche : function(creche, successCallback, errorCallback) {
          __doPost('creche/new', creche, successCallback, errorCallback);
        },

        updateCreche: function(creche, successCallback, errorCallback) {
          __doPut('creche/' + creche.id, creche, successCallback, errorCallback);
        },

        deleteCreche: function(crecheId, successCallback, errorCallback) {
          __doGet('creche/destroy/' + crecheId, successCallback, errorCallback);
        },

        addEvent: function(crecheId, activityId, calEvent, successCallback, errorCallback) {
          __doPost('creche/' + crecheId + '/' + activityId + '/event/new', 
            calEvent,
            successCallback, 
            errorCallback);
        },

        addOrUpdateActivity: function(activity, successCallback, errorCallback) {
          if (activity.id && activity.id > 0)
          {
            // update
            __doPut('activity/' + activity.id, activity, 
              function(data, status) {
                __updateDates(data.activity, __activity_time_properties);
                __updateCrecheDates(data.creche);
                successCallback(data, status);
              }, 
              errorCallback);
          }
          else 
          {
            __doPost('activity/' + activity.id, activity, successCallback, errorCallback);
          }
        },

        getCalendarEvents: function(crecheId, successCallback, errorCallback) {
          __doGet('creche/' + crecheId + '/event', successCallback, errorCallback);
        } 
      }

      return function() {
        return apiProxy;
      }
    }
  ]);