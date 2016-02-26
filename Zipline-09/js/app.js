angular.module('TicTacToeApp', [])

.directive('ticTacToe', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/tictactoe.html',
		controller: ['$scope', function($scope) {
			$scope.winCon = [
				["t1","t3","t2"],
				["t5","t4","t6"],
				["t7","t9","t8"],
				["t1","t7","t4"],
				["t5","t2","t8"],
				["t3","t9","t6"],
				["t5","t1","t9"],
				["t5","t3","t7"]
			];
		  $scope.player = {
		  	symbol: "X",
		  	color: "green",
		  }
		  $scope.computer = {
		  	symbol: "O",
		  	color: "red"
		  }
		  $scope.score = function() {
		  	var scores = $scope.winCon.map(function(win) {
					var threatLevel = 0;
					for(var i=0;i<win.length;i++) {
						if($scope.board[win[i]] === $scope.player.symbol) {
							threatLevel += 1;
						} else if($scope.board[win[i]] === $scope.computer.symbol) {
							threatLevel -=2;
						}
					};
					return threatLevel;
				});
				console.log("scores:", scores);
				return scores
		  }
		  $scope.playerMove = function(tile) {
		  	if($scope.board[tile] !== "" || $scope.gameOver) { return };
		  	$scope.score();
				$scope.board[tile] = $scope.player.symbol;
		  	console.log("player chooses ", tile);
				$('#' + tile).html('<span style="color:' + $scope.player.color + '">' + $scope.player.symbol + '</span>');
				$scope.turn += 1;
				var check = $scope.winCheck()
				if($scope.turn < 9 && check !== "Player Wins!") {
					$scope.compTurn();
				}
			};
			$scope.compTurn = function() {
				var tiles = ["t1","t2","t3","t4","t5","t6","t7","t8","t9"];
				var available = tiles.filter(function(tile) {return $scope.board[tile] === ""});
		  	var scores = $scope.score();
				var tile;
				if(available.indexOf("t5") > 0) {
					console.log("t5 gate")
					tile = "t5";
				} else if(scores.indexOf(-4) >= 0) {
					console.log("win gate");
					tile = $scope.winCon[scores.indexOf(-4)].filter(function(tile) {return $scope.board[tile] === ""});
				} else if(scores.indexOf(2) >= 0) {
					console.log("block gate");
					tile = $scope.winCon[scores.indexOf(2)].filter(function(tile) {return $scope.board[tile] === ""});
				} else if(scores.indexOf(-2) >=0) {
					console.log("progress gate")
					tile = $scope.winCon[scores.indexOf(-2)].filter(function(tile) {return $scope.board[tile] === ""})[0];
				} else if(available.indexOf("t7") >= 0) {
					console.log("t7 gate")
					tile = "t7";
				} else {
					console.log("random gate")
					tile = available[Math.floor(Math.random()*available.length)];
				}
				$scope.compPick(tile);
			};
			$scope.compPick = function(tile) {
				console.log("Computer chooses " + tile)
				$('#' + tile).html('<span style="color:' + $scope.computer.color + '">' + $scope.computer.symbol + '</span>');
				$scope.board[tile] = $scope.computer.symbol;
				$scope.turn +=1;
				$scope.winCheck()
			} 
			$scope.winCheck = function() {
				var board = $scope.board;
				for(var i=0;i<$scope.winCon.length;i++) {
					var win = $scope.winCon[i];
					if(board[win[0]] !== "" && board[win[0]] === board[win[1]] && board[win[1]]  === board[win[2]]) {
						var winnerSymbol = board[win[0]];
						if($scope.player.symbol === winnerSymbol) {
							$('#winnerBoard').html("Player Wins!");
							var timeout = window.setTimeout($scope.reset, 2000);
							$scope.gameOver = true;
							return "Player Wins!"
						} else {
							$('#winnerBoard').html("Computer Wins!");
							var timeout = window.setTimeout($scope.reset, 2000);
							$scope.gameOver = true;
							return "Computer Wins!"
						}
					} 
				}
				if($scope.turn === 9) {
					$('#winnerBoard').html("Game Tie!");
					var timeout = window.setTimeout($scope.reset, 2000);
					$scope.gameOver = true;
					return "Game Tie!"
				}
			}
			$scope.reset = function() {
				$scope.board = { t1:"", t2:"", t3:"", t4:"", t5:"", t6:"", t7:"", t8:"", t9:""};
				$scope.turn = 0;
				$scope.gameOver = false;
		  	$('.tile').html("");
		  	$('#winnerBoard').html("");
		  	var coinflip = Math.floor(Math.random()*2);
		  	if(coinflip) {
		  		$scope.compTurn();
		  	}
			};
			$scope.changeSide = function(symbol) {			
				if(symbol === "X") {
					$scope.player.symbol = "X";
					$scope.computer.symbol = "O";
					$('#pickX').hide();
					$('#pickO').show();
				} else {
					$scope.player.symbol = "O";
					$scope.computer.symbol = "X";
					$('#pickO').hide();
					$('#pickX').show();
				}
				$scope.reset();
			}

			$('#pickX').hide();
			$scope.reset();
		}]
	}
})

$(document).ready(function() { 
});