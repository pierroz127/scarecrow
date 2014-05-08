angular.module('scarecrow.common.services')
  .factory('apiProxy', ['$http',
    function($http) 
    {
      // const string for keys in cache
      var CRECHES_KEY = 'creches';

      // TODO(pile) useless for now...
      var apiProxyUrl = '';

      // list of properties of object Activity of type DateTime
      var __activity_time_properties = ['starts_at_earliest', 'starts_at_latest', 'ends_at_earliest', 'ends_at_latest'];

      var __cache = {};

      /*
       * Convert properties of data in Date objects 
       */
      var __updateDateTimes = function(data, properties) 
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
          __updateDateTimes(creche.activities[i], __activity_time_properties);
        }
      };

      var __doPost = function(route, data, successCallback, errorCallback) 
      {
        $http.post(apiProxyUrl + route, data).success(successCallback).error(errorCallback);
      };

      var __doGet = function(route, successCallback, errorCallback) 
      {
        $http.get(apiProxyUrl + route).success(successCallback).error(errorCallback);
      };

      var __doPut = function(route, data, successCallback, errorCallback) 
      {
        $http.put(apiProxyUrl + route, data).success(successCallback).error(errorCallback);
      };

      var apiProxy = 
      {
        resetCache: function(key)
        {
          if (key === undefined)
          {
            // reset all cache
            __cache = {};
          }
          else
          {
            __cache[key] = undefined;
          }
        },

        getCreches: function(userId, successCallback, errorCallback) 
        {
          if (__cache[CRECHES_KEY] === undefined || __cache[CRECHES_KEY].length == 0) 
          {
            __doGet('creche/index?user='+userId, 
              function(data, status) 
              {
                __cache[CRECHES_KEY] = data.creches;
                successCallback(data, status);
              }, 
              errorCallback);
          }
          else
          {
            var data = { creches: __cache[CRECHES_KEY]};
            successCallback(data, {});
          }
        },

        getCrecheById: function(id) 
        {
          console.log('getCrecheById(' + id + ')');
          if (__cache[CRECHES_KEY] !== undefined && __cache[CRECHES_KEY].length > 0)
          {
            for (var i=0; i<__cache[CRECHES_KEY].length; i++)
            {
              var creche = __cache[CRECHES_KEY][i];
              if (creche.id == id)
              {
                return creche;
              }
            }
          }
          return undefined;
        },

        getCrecheNameById: function(id)
        {
          console.log('getCrecheNameById(' + id + ')');
          var creche = this.getCrecheById(id);
          if (creche !== undefined)
          {
            return creche.name;
          }
          return 'Crèches';
        },

        getCreche: function(crecheId, successCallback, errorCallback) 
        {
          __doGet('creche?crecheid=' + crecheId, 
            function(data, status)
            {
              __updateCrecheDates(data.creche);
              successCallback(data, status);
            }, 
            errorCallback);
        },

        addNewCreche : function(creche, successCallback, errorCallback) 
        {
          __doPost('creche/new', creche, 
            function(data, status)
            {
              this.resetCache(CRECHES_KEY);
              successCallback(data, status);
            },
            errorCallback);
        },

        updateCreche: function(creche, successCallback, errorCallback) 
        {
          __doPut('creche/' + creche.id, creche,
            function(data, status)
            {
              this.resetCache(CRECHES_KEY);
              successCallback(data, status);
            },
            errorCallback);
        },

        deleteCreche: function(crecheId, successCallback, errorCallback) 
        {
          __doGet('creche/destroy/' + crecheId, 
            function(data, status)
            {
              this.resetCache(CRECHES_KEY);
              successCallback(data, status);
            }, 
            errorCallback);
        },

        addEvent: function(crecheId, activityId, calEvent, successCallback, errorCallback) 
        {
          __doPost('creche/' + crecheId + '/' + activityId + '/event/new', 
            calEvent,
            successCallback, 
            errorCallback);
        },

        getActivities: function(crecheId, successCallback, errorCallback) 
        {
          __doGet('activity?crecheid=' + crecheId, 
            function(data, status)
            {
              for (var i=0; i<data.activities.length; i++)
              {
                __updateDateTimes(data.activities[i], __activity_time_properties);
              }
              successCallback(data, status);
            }, 
            errorCallback);
        },

        addOrUpdateActivity: function(activity, successCallback, errorCallback) 
        {
          if (activity.id && activity.id > 0)
          {
            // The activity already exists, it's an update
            __doPut('activity/' + activity.id, activity, 
              successCallback,
              errorCallback);
          }
          else 
          {
            // The activity is new, it's a save
            __doPost('activity/' + activity.id, activity, successCallback, errorCallback);
          }
        },

        getCalendarEvents: function(crecheId, successCallback, errorCallback)
        {
          __doGet('creche/' + crecheId + '/event', successCallback, errorCallback);
        } 
      }

      return function() 
      {
        return apiProxy;
      }
    }
  ]);