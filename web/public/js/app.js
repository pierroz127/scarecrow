// Declare app level module which depends on filters, and services
angular.module('scarecrow', [
  'ngResource', 
  'ngRoute', 
  'ngCookies',
  'ui.bootstrap', 
  'ui.date', 
  'scarecrow.controllers'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/signup', {
        templateUrl: 'views/signin.html',
        controller: 'SignupCtrl'
      })
      .when('/', {
        templateUrl: 'views/home/home.html', 
        controller: 'HomeCtrl'})
      .otherwise({redirectTo: '/'});
  }]);