'use strict';

var KinnectedAppControllers = angular.module('KinnectedControllers',['KinnectedServices']);

KinnectedAppControllers.controller("IndexController", function($scope) {
    $scope.init = function() {
        console.log('loading the home ctrl');
    };

    $scope.init();
});


KinnectedAppControllers.controller("testController", function($scope) {
    $scope.init = function() {
        console.log('loading the test ctrl');
    };



    $scope.init();
});