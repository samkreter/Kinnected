'use strict';

var KinnectedApp = angular.module('KinnectedApp', [
  'KinnectedControllers',
  'KinnectedServices',
  'KinnectedDirectives',
  'ui.router',
  'ngAnimate'
])
.run([
  '$rootScope','$state','$stateParams',
  function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeSuccess', function() {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.access.restricted && AuthService.isLoggedIn() === false) {
        $location.path('/login');
        $route.reload();
      }
    });
    });
  }

])
.config([
  '$stateProvider','$urlRouterProvider','$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'static/home.html',
      controller: 'IndexController',
      access: {restricted: false}
    })
    .state('profile',{
      url: '/test',
      templateUrl: 'static/Profile_page.html',
      controller: 'profileController',
      access: {restricted: true}
    })
    $urlRouterProvider.otherwise('home');
    $locationProvider.html5Mode(true);
  }
])