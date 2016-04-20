'use strict';

angular.module('KinnectedServices', ['ngResource'])
.factory('StickyFooter', function(Image) {
  var getBadgeImage = function(self, index, array) {
    var badgeQuery = Image.get({imageId: self.badge_id}, function(image) {
      self.badge = image;
    })
    .$promise
    .then(runPositionFooter)
  }

  return {
    getBadgeImage: getBadgeImage
  }
})

.factory('Image', function($resource) {
  return $resource('/api/image/:imageId', {}, {

  });
})

.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;
    var userData = null;

    function getCurrUser(){
      return userData;
    }
    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserData(){
      var tmp = getCurrUserData(userData);
      return tmp;
    }

    function getCurrUserData(email){
      userData = email
      var promise = $http({
        url:'/api/users/json',
        method:'GET',
        params:{email: email}})


        // handle error
        promise.error(function (data) {
           return false;
        });

        return promise;
    }

  function login(email, password) {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a post request to the server
    $http.post('/api/login', {email: email, password: password})
      // handle success
      .success(function (data, status) {
        if(status === 200 && data.result){
            userData = email
            user = true;
            deferred.resolve();
        } else {
          user = false;
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function logout() {

    // create a new instance of deferred
    var deferred = $q.defer();

    // send a get request to the server
    $http.get('/api/logout')
      // handle success
      .success(function (data) {
        user = false;
        userData = null;
        deferred.resolve();
      })
      // handle error
      .error(function (data) {
        user = false;
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

  function register(first_name, last_name, email, password) {

    // create a new instance of deferred
    var deferred = $q.defer();
    // send a post request to the server
    // $http.post('/api/users/create', {first_name: first_name,
    //                              last_name: last_name,
    //                              email: email,
    //                              password: password})
      // handle success
    $http({
    url: '/api/users/create',
    method: "POST",
    data: JSON.stringify({first_name: first_name,
                                 last_name: last_name,
                                 email: email,
                                 password: password}),
    headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status) {
        if(status === 200 && data.result){
          userData = email;
          user = true;
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        deferred.reject();
      });

    // return promise object
    return deferred.promise;

  }

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserData: getUserData,
      currUser: getCurrUser
    });

}]);