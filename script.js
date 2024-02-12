var userFormEL = document.querySelector('#user-form');
var searchInputEL = document.querySelector('#search-input');

var todayContainerEL = document.querySelector('#today');
var forecastContainerEL = document.querySelector('#forecast');


//api key generated from openweather site
var APIKey = "106228f81351016b1ca6383c7d60c3f0";
var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';

//search current weather data
function search() {
  search.innerHTML = '';

  for (var i = search.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute( 'today forecast');
    btn.setAttribute('data-search', search[i]);
    btn.textContent = search[i];
    search.append(btn);
  }
}

// display the current weather data 
function renderCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');

  // Store Data

  var windEl = document.createElement('p');
  var windMph = weather.wind.speed;
  windEl.setAttribute('class', 'card-text'); windEl.textContent = `Wind: ${windMph} MPH`;

  var humidityEl = document.createElement('p');
  var humidity = weather.main.humidity;
  humidityEl.setAttribute('class', 'card-text'); humidityEl.textContent = `Humidity: ${humidity} %`;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  

  var tempF = weather.main.temp;
  var tempEl = document.createElement('p');
  tempEl.setAttribute('class', 'card-text'); tempEl.textContent = `Temp: ${tempF}°F`;

  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var weatherIcon = document.createElement('img'); weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  var iconDescription = weather.weather[0].description || weather[0].main;

  todayContainer.innerHTML = '';
  todayContainer.append(card);

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  heading.setAttribute('class', 'h3 card-title');
  heading.textContent = `${city} (${date})`;
  heading.append(weatherIcon);

  cardBody.append(heading, tempEl, windEl, humidityEl);
}

//use coordinates to fetch weather data
function fetchWeather(loc) {
  var { latitude } = loc;
  var { longitude } = loc;
  var city = location.name;

  var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchXY(searchterm) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${searchterm}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        appendToHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function handleUserFormSubmit(event) {
  if (!searchInput.value) {
    return;
  }

  event.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = '';
}


initSearchHistory();
userFormEL.addEventListener('submit', handleUserFormSubmit);