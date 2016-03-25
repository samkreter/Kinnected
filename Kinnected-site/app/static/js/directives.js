'use strict';

var KinnectedDirectives = angular.module('KinnectedDirectives',[]);

KinnectedDirectives
.directive('gamePartialBrief', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/game.partial.brief.html'
  }
})
.directive('gamePartialItem', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/game.partial.item.html'
  }
})
.directive('teamPartialBrief', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/team.partial.brief.html'
  }
})
.directive('teamPartialItem', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/team.partial.item.html'
  }
})
.directive('playerPartialBrief', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/player.partial.brief.html'
  }
})
.directive('playerPartialItem', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/player.partial.item.html'
  }
})
.directive('productPartial', function() {
  return {
    restrict: 'E',
    templateUrl: 'static/partials/product.partial.html'
  }
})