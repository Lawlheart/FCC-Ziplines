// $(document).ready(function() { 
var clockRunning = false;
var timeLeft;
var sessionTime = 5;
var breakTime = 5;
var seconds = sessionTime; // 1500 seconds for 25 minutes
var breakClock = false;

function filterTime(seconds) {
  var min = Math.floor(seconds/60);
  var sec = seconds%60;
  if(sec<10) {
    return min + ":0" + sec;
  } else {
    return min + ":" + sec;
  }
}
function timer() {
  if(seconds > 0) {
    seconds -= 1;
  } else {
    if(!breakClock) {
      seconds = breakTime;
      $('#title').html("Break");
      $('#stopWatch').removeClass('session');
      $('#stopWatch').addClass('break');
      breakClock = true;
    } else {
      seconds = sessionTime;
      $('#title').html("Session");
      $('#stopWatch').addClass('session');
      $('#stopWatch').removeClass('break');
      breakClock = false;
    }
  }
  $('#time').html(filterTime(seconds));
}

$('#time').html(filterTime(seconds));
$('#sessTime').html(Math.floor(seconds/60));
$('#brkTime').html(Math.floor(breakTime/60));


$('#stopWatch').click(function() {
  if(!clockRunning) {
    timeLeft = setInterval(function() {timer()}, 1000);
    clockRunning = true;
    $(this).addClass('running');
  } else {
    clearInterval(timeLeft);
    clockRunning = false;
    $(this).removeClass('running');
  }
});

$('#reset').click(function() {
  seconds = sessionTime;
  $('#title').html("Session");
  $('#stopWatch').addClass('session');
  $('#stopWatch').removeClass('break');
  $('#time').html(filterTime(seconds));
  breakClock = false;
});


$('#addSessTime').click(function() {
  sessionTime += 60;
  $('#sessTime').html(Math.floor(sessionTime/60));
  if(!breakClock) {
    seconds = sessionTime;
    $('#time').html(filterTime(seconds));
  }
});
$('#subSessTime').click(function() {
  sessionTime -= 60;
  $('#sessTime').html(Math.floor(sessionTime/60));
  if(!breakClock) {
    seconds = sessionTime;
    $('#time').html(filterTime(seconds));
  }
});
$('#addBrkTime').click(function() {
  breakTime += 60;
  $('#brkTime').html(Math.floor(breakTime/60));
  if(breakClock) {
    seconds = breakTime;
    $('#time').html(filterTime(seconds));
  }
});
$('#subBrkTime').click(function() {
  breakTime -= 60;
  $('#brkTime').html(Math.floor(breakTime/60));
  if(breakClock) {
    seconds = breakTime;
    $('#time').html(filterTime(seconds));
  }
});

// });