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
.factory('Game', function($resource) {
  return $resource('/api/game/:gameId', {}, {

  });
})
.factory('Team', function($resource) {
  return $resource('/api/team/:teamId', {}, {

  });
})
.factory('Player', function($resource) {
  return $resource('/api/player/:playerId', {}, {

  });
})
.factory('Gear', function($resource) {
  return $resource('/api/gear/:gearId', {}, {

  });
})
.factory('Image', function($resource) {
  return $resource('/api/image/:imageId', {}, {

  });
})
// Taken from http://www.sitepoint.com/tidy-angular-controllers-factories-services/
.factory('Product', [
  '$q', '$http',
  function($q, $http) {
    var Product = function(handle) {
      this.initialize = function() {
        var url = 'http://esports-booth.myshopify.com/products/'+handle+'.json';
        var productData = $http.get(url);
        var self = this;

        productData.then(function(response) {
          angular.extend(self, response.data.product);
          self.variantSelected = self.variants[0];
        });
      };
      // Call for every new instance
      this.initialize();
    };

    var toProducts = function(gear) {
      var products = [];
      $.each(gear, function(k,v) {
        var newProduct = {
          model: v,
          shopify: new Product(v.shopify_handle)
        }
        products.push(newProduct);
      });
      return products;
    }

    return {
      toProducts: toProducts
    }
  }
]);


/* Product
{
  product: {
  id: 1452002052,
  title: "Europe Region T-Shirt",
  body_html: "Support your favorite region of eSports by wearing this exclusive Europe region t-shirt!",
  vendor: "eSports Booth",
  product_type: "Shirt",
  created_at: "2015-09-13T10:43:08-05:00",
  handle: "europe-region-t-shirt",
  updated_at: "2015-10-14T18:44:17-05:00",
  published_at: "2015-09-13T10:41:00-05:00",
  template_suffix: null,
  published_scope: "global",
  tags: "",
  variants: [
    {
      id: 5156488004,
      product_id: 1452002052,
      title: "Small",
      price: "19.99",
      sku: "1",
      position: 1,
      grams: 227,
      inventory_policy: "deny",
      compare_at_price: "25.00",
      fulfillment_service: "manual",
      inventory_management: null,
      option1: "Small",
      option2: null,
      option3: null,
      created_at: "2015-09-13T10:43:08-05:00",
      updated_at: "2015-10-14T18:44:17-05:00",
      requires_shipping: true,
      taxable: true,
      barcode: "",
      inventory_quantity: 1,
      old_inventory_quantity: 1,
      image_id: null,
      weight: 0.5,
      weight_unit: "lb"
    },
    {
      id: 5160391492,
      product_id: 1452002052,
      title: "Medium",
      price: "19.99",
      sku: "2",
      position: 2,
      grams: 227,
      inventory_policy: "deny",
      compare_at_price: "25.00",
      fulfillment_service: "manual",
      inventory_management: null,
      option1: "Medium",
      option2: null,
      option3: null,
      created_at: "2015-09-13T15:55:15-05:00",
      updated_at: "2015-10-14T18:44:17-05:00",
      requires_shipping: true,
      taxable: true,
      barcode: "",
      inventory_quantity: 1,
      old_inventory_quantity: 1,
      image_id: null,
      weight: 0.5,
      weight_unit: "lb"
    }...
  ],
  options: [
    {
      id: 1788121284,
      product_id: 1452002052,
      name: "Size",
      position: 1,
      values: [
        "Small",
        "Medium",
        "Large",
        "X-Large"
      ]
    }
  ],
  images: [
    {
      id: 3662206532,
      product_id: 1452002052,
      position: 1,
      created_at: "2015-09-13T10:43:14-05:00",
      updated_at: "2015-09-13T10:43:14-05:00",
      src: "https://cdn.shopify.com/s/files/1/0990/8584/products/EUShirt.png?v=1442158994",
      variant_ids: [ ]
    }
  ],
  image: {
      id: 3662206532,
      product_id: 1452002052,
      position: 1,
      created_at: "2015-09-13T10:43:14-05:00",
      updated_at: "2015-09-13T10:43:14-05:00",
      src: "https://cdn.shopify.com/s/files/1/0990/8584/products/EUShirt.png?v=1442158994",
      variant_ids: [ ]
    }
  }
}
*/