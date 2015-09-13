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
  $scope.playing = true;

  $scope.choose = function(color) {
    console.log("CLICK")
    $scope.guess.push(color);
    $scope.flash(color);
    var lastColor = $scope.guess.length - 1;
    var correct = $scope.guess[lastColor] === $scope.sequence[lastColor];
    var lastGuess = $scope.guess.length === $scope.sequence.length;
    var turn20 = $scope.guess.length === 20;
    if(correct && lastGuess && turn20) {
      $scope.victory();
    } else if(correct && lastGuess) {
      $scope.advance();
    } else if(!correct) {
      $scope.wrong();
    }
  }
  
  $scope.start = function() {
    $scope.timer = 1000;
    $scope.output = 0;
    $scope.sequence = [];
    $scope.guess = [];
    $scope.advance();
  }

  $scope.advance = function() {
    var colors = ['green','red','blue','yellow'];
    var tempo = [5,9,13]
    $scope.output += 1;
    $scope.sequence.push(colors[Math.floor(Math.random()*4)]);
    if(tempo.indexOf($scope.output) >=0) {
      $scope.timer *= 0.85;
      console.log("timer increased to " + $scope.timer)
    }
    $scope.guess = [];
    $scope.playSequence();
    console.log($scope.sequence)
  }

  $scope.playSequence = function() {
    var seq = 0;
    $scope.playing = true;
    var simonSequence = window.setInterval(function() {
      var color = $scope.sequence[seq];
      $scope.flash(color);
      seq ++
      if(seq === $scope.sequence.length) {
        $scope.playing = false;
        window.clearInterval(simonSequence);
      }
    }, $scope.timer);
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
  }

  $scope.flash = function(color) {
    var tag = ".ring-" + color;
    $(tag).addClass('active');
    window.setTimeout(function(){$(tag).removeClass('active')}, $scope.timer/2);
    $scope[color].play();
  }

  $scope.wrong = function() {
    $scope.output = "! ! !";
    window.setTimeout(function() {
      $scope.output = $scope.sequence.length;
      if($scope.strict) {
        $scope.start(); 
      } else {
        $scope.guess = [];
        $scope.playSequence();
      }
      $scope.$digest();
    }, 1000);
  }
  $scope.victory = function() {
    $scope.output = "Victory!";
    window.setTimeout(function() {
      $scope.start();
      $scope.$digest();
    }, 1000);
  }

}]);

$(document).ready(function() { 
});