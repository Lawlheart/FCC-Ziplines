$(document).ready(function() { 
	$('#get-quotes').click(function(event) {
		console.log(event)
		function callback(data) {
			$('#quote').html(" ");
			var $author = $('<h1 class="text-center">').html(data.author);
			var $text = $('<p class="text-center">').html(data.text);
			$('#quote').append($author).append($text);
		}
		$.getJSON('http://198.199.95.142:7378/quote/random', callback)
	})
});