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
      .when('/creche/:crecheId/activity/:edit?', {
        templateUrl: 'views/creche/activity.html',
        controller: 'ActivityCtrl'
      })
      .when('/creche/:crecheId/schedule', {
        templateUrl: 'views/creche/schedule.html',
        controller: 'ScheduleCtrl'
      })
      .when('/creche/:sub/:crecheId?', {
        templateUrl: 'views/creche/index.html',
        controller: 'CrecheCtrl'
      })
      .when('/creche', {
        templateUrl: 'views/creche/index.html',
        controller: 'CrecheCtrl'
      })
      .when('/user/:id', {
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/', {
        templateUrl: 'views/home/home.html', 
        controller: 'HomeCtrl'})
      .otherwise({redirectTo: '/'});
  }]);