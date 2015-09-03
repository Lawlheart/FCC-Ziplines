$(document).ready(function() { 

Twitch.init({clientId: '7slve55bcpxq289sk8rojb2a491i1j6'}, function(error, status) {
  console.log('the sdk is now loaded')
});

var channelList = ["monstercat","freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "comster404"]

for(var i=0;i<channelList.length;i++) {
  var method = 'channels/' + channelList[i];
  Twitch.api({method: method }, function(error, list) {
    if(error) {
      var $twitch = $('<div>').addClass('twitch');
      $twitch.html('<div class="twitch" data-href="#"><img class="ch-icon" src="http://dev.lawlietblack.com/img/glitchyz.png"><h2 class="ch-title">Not Found<br><span class="ch-desc">' + error.message + '</span></h2><div class="ch-status null"><h1><i class="fa fa-times-circle"></i></h1></div></div>');
        $('#twitch-streams').append($twitch);
    } else {
      renderChannel(list)
    }
  });
}

function renderChannel(list) {
  var $twitch = $('<div>').addClass('twitch');
  var $icon = $('<img>').addClass('ch-icon');
  var $title = $('<h2>').addClass('ch-title');
  var $status = $('<div>').addClass('ch-status');
  if(list.logo !== null) {
    $icon.attr('src', list.logo).appendTo($twitch);
  } else {
    $icon.attr('src', 'http://dev.lawlietblack.com/img/twitch-logo.png').appendTo($twitch);
  }
  var titleString = list.display_name;
  if(list.delay !== null) {
    titleString += "<br><span class='ch-desc'>";
    titleString += list.status + "</span>"
  }
  $title.html(titleString).appendTo($twitch);

  if(list.delay !== null) {
    $twitch.addClass('online');
    $status.addClass('active').html('<h1><i class="fa fa-check-circle"></i></h1>').appendTo($twitch);
  } else {
    $twitch.addClass('offline');
    $status.addClass('down').html('<h1><i class="fa fa-minus-circle"></i></h1>').appendTo($twitch);
  }
  $twitch.attr('data-href', list.url);
  $('#twitch-streams').append($twitch);
}

$('body').on('click', '.twitch', function(event) {
  // console.log(event);
  var url = event.currentTarget.getAttribute('data-href');
  window.location.href = url;
});
$('body').on('click', '#all', function() {
  $('#search').val("");
  $('.twitch').show();
});
$('body').on('click', '#online', function() {
  $('#search').val("");
  $('.twitch').hide();
  $('.twitch.online').show();
});
$('body').on('click', '#offline', function() {
  $('#search').val("");
  $('.twitch').hide();
  $('.twitch.offline').show();
});

$('body').on('keyup', '#search', function() {
  var search = $('#search').val();
  $('.twitch').each(function() {
    $(this).hide();
    var channelName = $(this).children('.ch-title').html();
    if(channelName !== undefined) {
      if(channelName.indexOf("<br>") >=0) {
        channelName = channelName.slice(0, channelName.indexOf("<br>"));
      }
      if(channelName.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
        $(this).show();
      }
    }
  })
})

});