(function() { 
  var app = angular.module('CamperNewsApp', []);

  app.controller('MainController', ['$scope', 'news', function($scope, news) {
    $scope.news = [];
    news.success(function(data) {
      $scope.news = data;   
    });
  }]);

  app.factory('news', ['$http', function($http) {
      return $http.get('http://www.freecodecamp.com/news/hot?callback=JSON_CALLBACK?')
      .success(function(data) {
        return data;
      })
      .error(function(err) {
        return err;
      });
    }]);

  app.directive('camperStory', function() {
    return {
      restrict: 'E',
      scope: {
        story: '='
      },
      templateUrl: 'views/camper-story.html',
      controller: function($scope) {
        if($scope.story.image.indexOf('http') < 0) {
          $scope.story.image = "https://pbs.twimg.com/profile_images/562385977390272512/AK29YaTf_reasonably_small.png";
        }
        $scope.newsRedirect = function(url) {
          window.location.href = url;
        }
      }
    }
  })


})();
$(document).ready(function() { 


});