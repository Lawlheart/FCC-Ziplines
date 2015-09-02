$(document).ready(function() { 
	//gets quotes from my own API, https://github.com/LawlietBlack/quotes-api
	$('#get-quotes').click(function(event) {
		console.log(event)
		function callback(data) {
			$('#quote').html(" ");
			var $author = $('<h1 class="text-center" id="author">').html(data.author);
			var $text = $('<p class="text-center" id="text">').html(data.text);
			$('#quote').append($author).append($text);
		}
		$.getJSON('http://198.199.95.142:7378/quote/random', callback)
	});

	//creates a popup tweet window populated with the quote
  $('.popup').click(function(event) {
  	if($('#text').html() && $('#text').html()) {
  		var quote = "\""+ $('#text').html() + "\" - " + $('#author').html();
  	} else {
  		var quote = "";
  	}
  	// console.log(encodeURI(quote))
  	var width  = 575,
      height = 400,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      url    = this.href,
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;
  	window.open(url + "?text=" + encodeURI(quote), 'twitter', opts);
  	return false;
  });
});