// Declare app level module which depends on filters, and services
angular.module('scarecrow', [
  'ngResource', 
  'ngRoute', 
  'ngCookies',
  'ui.bootstrap', 
  'ui.date', 
  'scarecrow.controllers',
  'scarecrow.common.services'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/configure', {
        templateUrl: 'views/creche/index.html',
        controller: 'CrecheCtrl'
      })
      .when('/configure/:sub', {
        templateUrl: 'views/creche/index.html',
        controller: 'CrecheCtrl'
      })
      /*.when('/creche/:id/schedule', {
        templateUrl: 'views/creche/schedule.html',
        controller: 'CrecheCtrl'
      })*/
      .when('/', {
        templateUrl: 'views/home/home.html', 
        controller: 'HomeCtrl'})
      .otherwise({redirectTo: '/'});
  }]);