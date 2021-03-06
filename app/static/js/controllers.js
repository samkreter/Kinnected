'use strict';

var KinnectedAppControllers = angular.module('KinnectedControllers',['KinnectedServices']);


angular.module('KinnectedApp').controller('IndexController',
  ['$scope', '$state', 'AuthService','Flash',
  function ($scope, $state, AuthService,Flash) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.email, $scope.loginForm.password)
        // handle success
        .then(function () {
          $state.go('profile.home');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          var message = 'Invalid Username or Password bro :)';
          console.log("testing");
          Flash.create('danger', message);
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);


angular.module('KinnectedApp').controller('profileDisplayController',
  ['$scope', '$state', 'AuthService','$http','Flash',
  function ($scope, $state, AuthService,$http,Flash) {

      function init(){
          var baseUrl = "/api/users/display?email=";
          var currUserEmail = AuthService.currUser();
          $scope.d3Url = baseUrl + currUserEmail;
      }

      init()

  }]);

angular.module('KinnectedApp').controller('profileAddJobController',
  ['$scope', '$state', 'AuthService','$http','Flash',
  function ($scope, $state, AuthService,$http,Flash) {
      $scope.addJob = function(){
        $http({
          url:'/api/jobs/add',
          method:'GET',
          params:{'email':AuthService.currUser(),
                  'jobTitle':$scope.jobData.title,
                  'jobDes':$scope.jobData.description}})

        .success(function(data){

          if(data.result){
            Flash.create('success','Job successfully added');

            //Definitly not the best way to do this but o well,
            // I ain't got time now to fix it
            // Probably a todo
            $('#edit-profile-job-list').append('<div class="row">\
                <div class="list-group-item col-sm-10 col-sm-offset-1" style="margin-bottom: 16px;">\
                            <div class="row">\
                                <div id="user_info" class="col-sm-12">\
                                   <h4 class="list-group-item-heading">'+$scope.jobData.title+'</h4>\
                                    <p class="list-group-item-text">'+$scope.jobData.description+'</p>\
                                </div>\
                            </div>\
                        </div>\
                        </div>')

            $state.go('profile.editProfile');
          }
        })
        .error(function(data){
          Flash.create('danger',"Job failed to be added");
        })
      }

  }]);

angular.module('KinnectedApp').controller('profileSearchController',
  ['$scope', '$state', 'AuthService','$http','Flash',
  function ($scope, $state, AuthService,$http,Flash) {
      var getpeople = function(){
        $http({
          url:'/api/users/all',
          method:'GET'})
        .success(function(data){
          $scope.users = data;
          console.log($scope.users);
        })
        .error(function(data){
          console.log("messed up for the search");
        })
      }

      $scope.makeConnection = function(email){

        $http({
          url:'/api/users/connect',
          method:'GET',
          params:{'connect-email':email,'main-email':AuthService.currUser()}})
        .success(function(data){
          if(data.result){
            Flash.create('success','successfully created connection!');
          }
          else{
            console.log("failed");
          }
        })
        .error(function(data){
          console.log("messed up for the search");
        })
      }

      getpeople();
  }]);

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
    var firstTime = function () {
        var message = '<strong>Welcome!</strong> Fill in your profile information and get that job!.';
        Flash.create('info', message);
    };

    $scope.updateProfile = function(){
      $scope.userData.Useremail = AuthService.currUser();
      $http({
        url:'/api/users/update',
        method:'GET',
        params:$scope.userData})
        .success(function(data,status){
          AuthService.setCurrUser($scope.userData.email)
          console.log("successful update");
          $state.go('profile.home');
        })
        .error(function(data){
          console.log("failed update");
        })
    }

    var init = function(){
       AuthService.getUserData().then(function(data){
          $scope.userData = data.data;
          console.log(data)
          //have a filler if they havn't updated their profile yet
          if($scope.userData.major == null){
            $scope.userData.major = "Fill in your major!";
          }
          if($scope.userData.gradyear == null){
            $scope.userData.gradyear = "Fill in your Grad Year!";
          }
       })
    }

    init()


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
  ['$scope', '$location', 'AuthService','$state','Flash',
  function ($scope, $location, AuthService,$state,Flash) {

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
          $state.go('profile.home');
        })
        // handle error
        .catch(function () {
          $scope.disabled = false;
          Flash.create('danger','Email Already Used, Try Again Brother');
          $scope.registerForm = {};
        });

    };

}]);