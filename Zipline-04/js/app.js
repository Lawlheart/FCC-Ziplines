$(document).ready(function() { 
var clockRunning = false;
var timeLeft;
var sessionTime = 1500;
var breakTime = 300;
var breakClock = false;
var seconds;

//Converts seconds to MM:SS
function filterTime(seconds) {
  var min = Math.floor(seconds/60);
  var sec = seconds%60;
  if(sec<10) {
    return min + ":0" + sec;
  } else {
    return min + ":" + sec;
  }
}
//renders the background fill effect with different colors for session, break, and pause
function renderBackground() {
  var color = '#444'
  var timer = breakClock?breakTime:sessionTime;
  if(clockRunning) {
    color = breakClock?'#166':'#464';
  }
  var progress = (timer - seconds)*100/timer;
  $('#stopWatch').css('background', 'linear-gradient(to top, '+color+' 0%,'+color+' '+progress+'%,#222 '+progress+'%,#222 100%)');
}
//counts down till seconds = 0, then plays alarm and switches between session and break mode.
function timer() {
  if(seconds > 0) {
    seconds -= 1;
    if(seconds === 0) {
      document.getElementById('alarm').play();
    }
  } else {
    if(!breakClock) {
      seconds = breakTime;
      $('#title').html("Break");
      $('#stopWatch').removeClass('session').addClass('break');
      breakClock = true;
    } else {
      seconds = sessionTime;
      $('#title').html("Session");
      $('#stopWatch').addClass('session').removeClass('break');
      breakClock = false;
    }
  }
  renderBackground()
  $('#time').html(filterTime(seconds));
}
//renders time variables in the view with respect to break/session mode;
function renderTime() {
  seconds = breakClock?breakTime:sessionTime;
  $('#time').html(filterTime(seconds));
  $('#sessTime').html(Math.floor(seconds/60));
  $('#brkTime').html(Math.floor(breakTime/60));
}

//Initial page rendering
renderTime()

//add play/pause functionality to the stopwatch button
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
  renderBackground()
});

//reset button brings app back to session mode at full time.
$('#reset').click(function() {
  seconds = sessionTime;
  $('#title').html("Session");
  $('#stopWatch').addClass('session').removeClass('break');
  $('#time').html(filterTime(seconds));
  breakClock = false;
  renderBackground()
});


$('body').on('click', '.time-select', function(e) {
  var method = e.target.getAttribute("data-method");
  switch(method) {
    case "add-sess": sessionTime += 60; break;
    case "sub-sess": sessionTime -= 60; break;
    case "add-break": breakTime += 60; break;
    case "sub-break": breakTime -= 60; break;
  }
  renderTime()

});

});