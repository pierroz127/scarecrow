angular.module('scarecrow.common.services')
  .factory('apiProxy', ['$http',
    function($http) {
      var apiProxyUrl = 'http://localhost:8585';
      var apiProxy = {
        getCreches : function(userId, successCallback, errorCallback) {
          $http.get(apiProxyUrl + '/creche/index?user='+userId)
            .success(successCallback)
            .error(errorCallback);
        },

        getCreche: function(crecheId, successCallback, errorCallback) {
          $http.get(apiProxyUrl + '/creche?crecheid=' + crecheId)
            .success(successCallback)
            .error(errorCallback);
        },

        addNewCreche : function(creche, successCallback, errorCallback) {
          $http.post(apiUri + '/creche/new', creche)
            .success(successCallback)
            .error(errorCallback);
        }
      }

      return function() {
        return apiProxy;
      }
    }
  ]);