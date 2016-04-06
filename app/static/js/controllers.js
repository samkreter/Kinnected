'use strict';

var KinnectedAppControllers = angular.module('KinnectedControllers',['KinnectedServices']);

KinnectedAppControllers.controller("IndexController", function($scope, Gear, Product) {
  var gearQuery = Gear.get({q: {limit: 4, order_by: [{field: 'id', direction: 'desc'}]}}, function(gear) {
    $scope.gear = Product.toProducts(gear.objects);
  });
});

KinnectedAppControllers.controller('GameListController', function($scope, $stateParams, Game, StickyFooter) {
  var gameQuery = Game.get({}, function(games) {
    $scope.games = games.objects;
    if($scope.games)
      $scope.games.map(StickyFooter.getBadgeImage);
  })

  $scope.hasStuff = function(g) {
    return g.teams.length > 0 || g.players.length > 0 || g.gear.length > 0;
  }
});

KinnectedAppControllers.controller('GameDetailController', function($scope, $stateParams, Game, StickyFooter, Product) {
  var gameQuery = Game.get({gameId: $stateParams.id}, function(game) {
    $scope.game = game;
    
    if($scope.game.teams)
      $scope.game.teams.map(StickyFooter.getBadgeImage);
    
    if($scope.game.players)
      $scope.game.players.map(StickyFooter.getBadgeImage);
    
    if($scope.game.gear)
      $scope.game.gear.map(StickyFooter.getBadgeImage);
    
    $scope.game.gear = Product.toProducts($scope.game.gear);
  })
});

KinnectedAppControllers.controller('TeamListController', function($scope, Team, StickyFooter) {
  var teamQuery = Team.get({}, function(teams) {
    $scope.teams = teams.objects;
    if($scope.teams)
      $scope.teams.map(StickyFooter.getBadgeImage);
    console.log($scope.teams[0].badge.name);
  })
});

KinnectedAppControllers.controller('TeamDetailController', function($scope, $stateParams, Team, StickyFooter, Product) {
  var teamQuery = Team.get({teamId: $stateParams.id}, function(team) {
    $scope.team = team;
    
    if($scope.team.games)
      $scope.team.games.map(StickyFooter.getBadgeImage);
    
    if($scope.team.players)
      $scope.team.players.map(StickyFooter.getBadgeImage);
    
    if($scope.team.gear)
      $scope.team.gear.map(StickyFooter.getBadgeImage);
    
    $scope.team.gear = Product.toProducts($scope.team.gear);
  })
});

KinnectedAppControllers.controller('PlayerListController', function($scope, Player, StickyFooter) {
  var playerQuery = Player.get({}, function(players) {
    $scope.players = players.objects;
    if($scope.players)
      $scope.players.map(StickyFooter.getBadgeImage);
  })
});

KinnectedAppControllers.controller('PlayerDetailController', function($scope, $stateParams, Player, StickyFooter, Product) {
  var playerQuery = Player.get({playerId: $stateParams.id}, function(player) {
    $scope.player = player;

    if($scope.player.games)
        $scope.player.games.map(StickyFooter.getBadgeImage);

    if($scope.player.teams)
        $scope.player.teams.map(StickyFooter.getBadgeImage);

    if($scope.player.gear)
        $scope.player.gear.map(StickyFooter.getBadgeImage);

    $scope.player.gear = Product.toProducts($scope.player.gear);
  })
})