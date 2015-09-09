(function() { 
  var app = angular.module('WikiFeedApp', ['ngSanitize']);

  app.controller('MainController', ['$scope', 'wiki', function($scope, wiki ) {
      $scope.search = "";
      $scope.searchScope = this;
      $scope.pages = [];
      $scope.random = {};
      $scope.getWiki = function(query) {
        wiki.get(query).success(function(data) {
          $scope.pages = data.query.search;
          console.log($scope.pages)
        }).error(function(err) {
          console.log(err, err.message);
        })
      }
      $scope.$on('search-update', function(event, data) {
        $scope.search = data;
        $scope.getWiki(data);
      });
      $scope.random = function() {
        wiki.random().success(function(data) {
          $scope.random = data.query.random[0];
          var url = 'https://en.wikipedia.org/wiki/' + $scope.random.title;
          window.location.href = url;
        }).error(function(err) {
          console.log(err, err.message);
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
      },
      random: function() {
        return $http.jsonp('https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=10&rnnamespace=0&format=json&callback=JSON_CALLBACK')
        .success(function(data) {
          return data;
        })
        .error(function(err) {
          return err;
        });
      }
    }
  }]);

  app.directive('wikiStory', function() {
    return {
      restrict: 'E',
      scope: { page: '='},
      templateUrl: 'views/wiki-story.html',
      link: function($scope, $element, $attrs) {
        $scope.redirect = function(title) {
            var url = 'https://en.wikipedia.org/wiki/' + title
            window.location.href = url;
        };
      }
    }
  });
  app.directive('wikiAutocomplete', ['wiki', function(wiki) {
      return {
        restrict: 'A',
        scope: { info: '=' },
        require: 'ngModel', 
        link: function($scope, $element, $attrs) {
          $element.autocomplete({
            minLength: 2,
            source: function(request, response) {
              $.ajax({
                url: "http://en.wikipedia.org/w/api.php",
                dataType: "jsonp",
                data: {
                  'action': "opensearch",
                  'format': "json",
                  'search': request.term
                },
                success: function(data) {
                  response(data[1]);
                  console.log(data)
                }
              });
            },
            select: function(event, ui) {
              $scope.$emit('search-update', ui.item.value);
            }
          }).appendTo('#search');
        }
      }
    }]);

})();
$(document).ready(function() { 


});