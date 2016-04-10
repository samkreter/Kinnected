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