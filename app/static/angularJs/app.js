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
      runPositionFooter();
      if( $.mobile.support.touch ) {
        slidebarIn();
      }
    });
  } 
])
.config([
  '$stateProvider','$urlRouterProvider','$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
    .when('','/home')
    .otherwise('/home');
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'static/base.html',
      controller: 'IndexController'
    })

    $locationProvider.html5Mode(true);
  }
])