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
  function($rootScope, $state, $stateParams, AuthService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      console.log(toState);
      if (toState.restricted && AuthService.isLoggedIn() === false){
        // User isn’t authenticated
        $state.transitionTo("home");
        event.preventDefault();
      }
      console.log(AuthService.isLoggedIn())
      if(toState.name != "profile" && AuthService.isLoggedIn() === true){
        $state.transitionTo("profile");
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
      restricted: false
    })
    .state('profile',{
      url: '/profile',
      templateUrl: 'static/Profile_page.html',
      controller: 'profileController',
      restricted: true
    })
    $urlRouterProvider.otherwise('home');
    $locationProvider.html5Mode(true);
  }
])