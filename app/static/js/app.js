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

    });
  }
])
.config([
  '$stateProvider','$urlRouterProvider','$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'static/base.html',
      controller: 'IndexController'
    })
    .state('test',{
      url: '/test',
      templateUrl: 'static/partials/index.html',
      controller: 'testController'
    })
    $urlRouterProvider.otherwise('home');
    $locationProvider.html5Mode(true);
  }
])