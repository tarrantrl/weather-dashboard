// select city search input element
var cityInputEl = document.querySelector("#city");
// select form element
var citySearchForm = document.querySelector("#city-search-form");
// select the main results container
var mainResultsEl = document.querySelector("#main-results");

// function to handle when a city is searched for
var citySearchHandler = function(event){
    event.preventDefault();
    // get the city from the form input
    var city = cityInputEl.value;
    // make a fetch request using the city name
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3ecb6161f0ffa0bfa224115fa7448b5a`).then(function(response){
        // if the fetch is successful
        if (response.ok){
            // convert to json
            response.json().then(function(data){
                // clear the main results section
                mainResultsEl.innerHTML = "";
                // city name,
                var cityName = data.name; 
                // the date,
                var date = moment().format("MM/DD/YYYY"); 
                // an icon representation of weather conditions, 
                var icon = data.weather[0].icon;
                // icon url
                var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                // create icon img element
                var iconImg = document.createElement("img");
                iconImg.setAttribute("src", iconUrl);
                // add city name, date, and icon as a header
                var cityHeader = document.createElement("h2");
                cityHeader.textContent = `${cityName} (${date})`;
                cityHeader.appendChild(iconImg);
                mainResultsEl.appendChild(cityHeader);
                // the temperature, 
                var temp = data.main.temp;
                // the humidity, 
                var humidity = data.main.humidity;
                // the wind speed, 
                var windSpeed = data.wind.speed;
                
                // get lat and lon for uv fetch request
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                
            })
        }
    })
}

citySearchForm.addEventListener("submit", citySearchHandler);