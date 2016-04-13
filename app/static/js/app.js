'use strict';

var KinnectedApp = angular.module('KinnectedApp', [
  'KinnectedControllers',
  'KinnectedServices',
  'KinnectedDirectives',
  'ui.router',
  'ngAnimate'
])
.run([
  '$rootScope','$state','$stateParams','AuthService',
  function($rootScope, $state, $stateParams, $AuthService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.restricted && AuthService.isLoggedIn() === false){
        // User isn’t authenticated
        $state.transitionTo("home");
        event.preventDefault();
      }
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
      url: '/profile',
      templateUrl: 'static/Profile_page.html',
      controller: 'profileController',
      access: {restricted: true}
    })
    $urlRouterProvider.otherwise('home');
    $locationProvider.html5Mode(true);
  }
])