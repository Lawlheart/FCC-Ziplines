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
      template: '<div class="story" ng-click="newsRedirect(story.link)"><div class="image-container" style="background: #666 url(\'{{story.image}}\') no-repeat center; background-size: cover"><img ng-src="{{story.author.picture}}" alt="" class="avatar"></div><h4 class="headline">{{story.headline}}</h4><div class="upvotes text-center"><p>+&nbsp;{{story.upVotes.length}}</p></div></div>',
      controller: function($scope) {
        if($scope.story.image.indexOf('http') < 0) {
          $scope.story.image = "https://avatars1.githubusercontent.com/FreeCodeCamp?&s=140";
        }
        $scope.newsRedirect = function(url) {
          window.location.href = url;
        }
      },
      link: function($scope, $element, $attrs) {
        $element.hover(function() {
          $element.addClass('animated pulse');
        }, function() {
          window.setTimeout( function(){
            $element.removeClass('animated pulse');
            }, 1000); 
        })
      }
    }
  })

})();

$(document).ready(function() { 

});