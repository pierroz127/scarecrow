angular.module('scarecrow.common.services')
  .factory('_', [function() {
    return window._; // assumes underscore has already been loaded on the page
  }]);