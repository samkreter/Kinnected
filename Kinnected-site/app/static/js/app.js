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
    .state('about-us', {
      url: '/about/',
      templateUrl: 'static/partials/about-us.html'
    })
    .state('contact-us', {
      url: '/contact/',
      templateUrl: 'static/partials/contact-us.html'
    })
    $locationProvider.html5Mode(true);
  }
])