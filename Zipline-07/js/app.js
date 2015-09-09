(function() { 
  var app = angular.module('WikiFeedApp', []);

  app.controller('MainController', ['$scope', 'wiki', function($scope, wiki ) {
      $scope.pages = [];
      $scope.getWiki = function(query) {
        wiki.get(query).success(function(data) {
          $scope.pages = data.query.search;
          console.log($scope.pages)
        }).error(function(err) {
          console.log(err, err.message)
        })
      }
  }]);

  app.factory('wiki', ['$http', function($http) {
    return {
      get: function(query) {
        return $http.jsonp('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURI(query) + '&format=json&callback=JSON_CALLBACK')
        .success(function(data) {
          console.log(data)
          return data;
        })
        .error(function(err) {
          return err;
        });
      }
    }
  }]);

})();
$(document).ready(function() { 


});