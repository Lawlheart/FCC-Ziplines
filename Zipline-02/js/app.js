$(document).ready(function() { 
  var quotesData
  $.getJSON('./js/quotes.json', function(data) {
    quotesData = data;
  });

  function renderRandomQuote() {
    var random = Math.floor(Math.random()*101);
    var quote = quotesData[random]
    $('#quote').html(" ");
    var $author = $('<h1 class="text-center" id="text">').html(quote.text);
    var $text = $('<h3 class="text-center" id="author">').html(" - " + quote.author);
    $('#quote').append($author).append($text);
  };

	$('#get-quotes').click(function(event) {
		renderRandomQuote();
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