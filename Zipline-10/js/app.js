angular.module('SimonApp', [])
.controller('MainController', ['$scope', function($scope) {
  $scope.green = document.createElement("AUDIO");
  $scope.green.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');

  $scope.red = document.createElement("AUDIO");
  $scope.red.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');

  $scope.blue = document.createElement("AUDIO");
  $scope.blue.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');

  $scope.yellow = document.createElement("AUDIO");
  $scope.yellow.setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');


  $scope.strict = false;
  
  $scope.choose = function(color) {
    $scope.guess.push(color);
    $scope[color].play();
    console.log($scope.guess)
    var lastColor = $scope.guess.length - 1;
    if($scope.guess[lastColor] === $scope.sequence[lastColor]) {
      console.log("correct")
      if($scope.guess.length === $scope.sequence.length) {
        $scope.advance();
      } 
    } else {
      console.log("incorrect");
      $scope.guess = [];
    }
  }
  
  $scope.start = function() {
    $scope.output = 0;
    $scope.sequence = [];
    $scope.guess = [];
    $scope.advance();
  }

  $scope.advance = function() {
    var colors = ['green','red','blue','yellow'];
    $scope.output += 1;
    $scope.sequence.push(colors[Math.floor(Math.random()*4)]);
    $scope.playSequence();
    $scope.guess = [];
    console.log($scope.sequence)
  }

  $scope.playSequence = function() {
    var seq = 0;
    var simonSequence = window.setInterval(function() {
      var color = $scope.sequence[seq];
      $scope[color].play();
      seq ++
      if(seq === $scope.sequence.length) {
        window.clearInterval(simonSequence);
      }
    }, 1000);
  }
  $scope.toggleStrict = function() {
    if(!$scope.strict) {
      $scope.strict = true;
      $('#output').addClass('strict');
    } else {
      $scope.strict = false;
      $('#output').removeClass('strict');
    }
    $scope.start();

    console.log($scope.strict)
  }
}]);

$(document).ready(function() { 
});