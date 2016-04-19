'use strict';

var KinnectedApp = angular.module('KinnectedApp', [
  'KinnectedControllers',
  'KinnectedServices',
  'KinnectedDirectives',
  'ui.router',
  'ngAnimate',
  'ngFlash'
])
.run([
  '$rootScope','$state','$stateParams','AuthService',
  function($rootScope, $state, $stateParams, AuthService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

      console.log(AuthService.isLoggedIn())
      //make sure only authenticated users can get to certain sections
      if (toState.restricted && AuthService.isLoggedIn() === false){
        $state.transitionTo("home");
        event.preventDefault();
      }

      //if users logged in and goes to homepage redirect to their profile page
      if(toState.name == "home" && AuthService.isLoggedIn() === true){
        $state.transitionTo("profile.home");
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
      templateUrl: 'static/partials/home.html',
      controller: 'IndexController',
      restricted: false
    })
    .state('profile',{
      url: '/profile',
      abstract: true,
      templateUrl: 'static/partials/profile_nav.html',
    })
    .state('profile.home',{
      url: '/profile/home',
      templateUrl: 'static/partials/Profile_page.html',
      controller: 'profileController',
      restricted: true
    })
    .state('profile.editProfile',{
      url: '/profile/editprofile',
      templateUrl: 'static/partials/edit_profile.html',
      controller: 'profileController',
      restricted: true
    })
    $urlRouterProvider.otherwise('home');
    $locationProvider.html5Mode(true);
  }
])