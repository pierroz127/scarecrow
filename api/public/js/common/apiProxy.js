angular.module('scarecrow.common.services')
  .factory('apiProxy', ['$http',
    function($http) {
      var apiProxyUrl = '';

      var __doPost = function(route, data, successCallback, errorCallback) {
        $http.post(apiProxyUrl + route, data)
          .success(successCallback)
          .error(errorCallback);
      };

      var __doGet = function(route, successCallback, errorCallback) {
        $http.get(apiProxyUrl + route).success(successCallback).error(errorCallback);
      }

      var apiProxy = {
        getCreches : function(userId, successCallback, errorCallback) {
          __doGet('creche/index?user='+userId, successCallback, errorCallback);
        },

        getCreche: function(crecheId, successCallback, errorCallback) {
          __doGet('creche?crecheid=' + crecheId, successCallback, errorCallback);
        },

        addNewCreche : function(creche, successCallback, errorCallback) {
          __doPost('creche/new', creche, successCallback, errorCallback);
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

        getCalendarEvents: function(crecheId, successCallback, errorCallback) {
          __doGet('creche/' + crecheId + '/event', successCallback, errorCallback);
        } 
      }

      return function() {
        return apiProxy;
      }
    }
  ]);