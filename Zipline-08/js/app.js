
var app = angular.module('CalculatorApp', []);

app.controller('MainController', ['$scope', function($scope) {
  $scope.output = "";
  $scope.running = "";
  $scope.staged = false;
  $scope.evaluated = false;
  
  $scope.numClick = function(num) {
    $scope.evalCheck();
    $scope.clearCheck();
    $scope.output += num;
  };
  //
  $scope.decimalClick = function() {
    $scope.evalCheck();
    $scope.clearCheck();
    if($scope.output.indexOf(".") < 0 ) {
      $scope.zeroCheck();
      $scope.output += ".";

    }
  };
  //main function for + - / % * buttons. Staged variable tracks if the last button press was another operand
  $scope.mathClick = function(eval) {
    if($scope.staged) {
      $scope.running = $scope.running.slice(0,$scope.running.length-1) + eval;
    } else {
      $scope.zeroCheck();
      $scope.running += $scope.output + eval;
    }
    $scope.staged = true;
    $scope.evaluated = false;
  };

  //main evaluate function. checks for an empty input, evaluates the running total with the output, resets the running total, and sets evaluated to true and staged to false;
  $scope.evaluate = function() {
    if($scope.output === "") {
      return
    }
    $scope.output = math.eval($scope.running += $scope.output).toString();
    $scope.running = "";
    $scope.evaluated = true;
    $scope.staged = false;
  }
  $scope.clearEntry = function() {
    $scope.output = "";
    $scope.staged = true;
  };
  $scope.clearAll = function() {
    $scope.output = "";
    $scope.staged = false;
    $scope.running = "";
    $scope.evaluated = false;
  };
  //checks to see if the last button pressed was a math operator, and if so, clears and resets the boolean
  $scope.clearCheck = function() {
    if($scope.staged) {
      $scope.output = "";
      $scope.staged = false;
    }
  };
  //checks for an empty string and adds zero as appropriate
  $scope.zeroCheck = function() {
    if($scope.output === ""|| $scope.output.substr(-1) === ".") {
      $scope.output += "0"
    }
  };
  // checks if the output is a result of evaluation, and if so, clears before adding num
  $scope.evalCheck = function() {
    if($scope.evaluated) {
      $scope.clearAll();
      $scope.evaluated = false;
    }
  }
}]);



$(document).ready(function() { 
});