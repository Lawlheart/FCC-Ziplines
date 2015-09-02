$(document).ready(function() { 
  function getIcons(icon) {
    switch(icon) {
      case "01d":
        return "day-sunny";
        break;
      case "02d":
        return "day-cloudy";
        break;
      case "03d":
        return "cloud";
        break;
      case "04d":
        return "cloudy";
        break;
      case "09d":
        return "showers";
        break;
      case "10d":
        return "day-rain";
        break;
      case "11d":
        return "thunderstorm";
        break;
      case "13d":
        return "snow";
        break;
      case "50d":
        return "fog";
        break;
      case "01n":
        return "night-clear";
        break;
      case "02n":
        return "night-alt-cloudy";
        break;
      case "03n":
        return "cloud";
        break;
      case "04n":
        return "cloudy";
        break;
      case "09n":
        return "showers";
        break;
      case "10n":
        return "night-alt-rain";
        break;
      case "11n":
        return "thunderstorm";
        break;
      case "13n":
        return "snow";
        break;
      case "50n":
        return "fog";
        break;
      default:
        return "alien";
        break;
      }
    }
  function getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported on this browser.");
    }
  }
  function showPosition(position) {
    if(position.coords.latitude !== undefined && position.coords.longitude !== undefined) {
      getWeather(position.coords.latitude, position.coords.longitude);
    } else {
      alert("weather not loading...")
    }
  }
  function getWeather(lat, lon) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon;
    $.getJSON(url, function(data) {
      renderPage(data)
    })
  }
  function renderPage(data) {
    var tempCel = Math.round(data.main.temp - 272.15);
    $('#location').html(data.name)
    $('#temp').attr("data-temp", data.main.temp).attr("temp-type", "cel");
    $('#temp').html(tempCel + "&#8451;");
    var iconString = ""
    for(var i=0;i<data.weather.length;i++) {
      iconString += "<i class='wi wi-" + getIcons(data.weather[i].icon) + "'></i>";
    }
    $('#weather-icons').html(iconString);
    console.log(data); 
  }
  getLocation(); 
  $("#change-temp").click(function() {
    var temp = $('#temp').attr("data-temp");
    var tempCel = Math.round(temp - 272.15);
    var tempFar = Math.round(tempCel*(9/5)+32);
    var currentType = $('#temp').attr("temp-type");
    if(currentType === "cel") {
      $('#temp').html(tempFar + "&#8457;").attr('temp-type', 'far');
      $(this).html('Switch to &#8451;');
    } else if(currentType === "far") {
      $('#temp').html(tempCel + '&#8451;').attr('temp-type', 'cel');
      $(this).html('Switch to &#8457;');
    }
  })
  $('#getWeather').click(function() {
    var zip = $('#zip').val();
    var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us";
    $.getJSON(url, function(data) {
      renderPage(data)
    });
  });
});