'use strict';

var KinnectedAppControllers = angular.module('KinnectedControllers',['KinnectedServices']);

KinnectedAppControllers.controller("IndexController", function($scope) {
    $scope.init = function() {
        console.log('loading the home ctrl');
    };

    $scope.init();
});

angular.module('KinnectedApp').controller('profileController',
  ['$scope', '$state', 'AuthService','$http','Flash',
  function ($scope, $state, AuthService,$http,Flash) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $state.go('home');
        });

    };
    var success = function () {
        var message = '<strong>Well done!</strong> You successfully read this important alert message.';
        Flash.create('success', message);
    };

    $scope.updateProfile = function(){
      $http({
        url:'/api/users/update',
        method:'GET',
        params:$scope.userData})
        .success(function(data,status){
          console.log("successful update");
        })
        .error(function(data){
          console.log("failed update");
        })
    }

    var init = function(){
       AuthService.getUserData().then(function(data){
          $scope.userData = data.data;

          //have a filler if they havn't updated their profile yet
          if($scope.userData.major == null){
            $scope.userData.major = "Fill in your major!";
          }
          if($scope.userData.gradyear == null){
            $scope.userData.gradyear = "Fill in your Grad Year!";
          }
       })
    }
    success()
    init()


}]);


angular.module('KinnectedApp').controller('loginController',
  ['$scope', '$state', 'AuthService',
  function ($scope, $state, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.email, $scope.loginForm.password)
        // handle success
        .then(function () {
          $state.go('profile');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('KinnectedApp').controller('logoutController',
  ['$scope', '$state', 'AuthService',
  function ($scope, $state, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $state.go('home');
        });

    };

}]);

angular.module('KinnectedApp').controller('registerController',
  ['$scope', '$location', 'AuthService','$state',
  function ($scope, $location, AuthService,$state) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.first_name,
                           $scope.registerForm.last_name,
                           $scope.registerForm.email,
                           $scope.registerForm.password)
        // handle success
        .then(function () {
          $scope.disabled = false;
          $scope.registerForm = {};
          $state.go('profile');
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);