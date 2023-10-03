var cityFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#username');
var cityContainerEl = document.querySelector('#city-container');
var citySearchTerm = document.querySelector('#city-search-term');

//api key generated from openweather site
var APIKey = "106228f81351016b1ca6383c7d60c3f0";
var city;

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = cityInputEl.value.trim();

  if (cityname) {
    getUserRepos(cityname);

    cityInputEl.value = '';
  } else {
    alert('Please enter a City Name');
  }
};
// weather api from site incorporated into query
var getUserRepos = function (city) {
  var apiUrl = 'api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, city);
        });
      } else {
        alert('Error:' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to weather API');
    });
};
// display weather?
var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No weather found.';
    return;
  }

 citySearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);
