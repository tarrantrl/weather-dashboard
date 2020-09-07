// select city search input element
var cityInputEl = document.querySelector("#city");
// select form element
var citySearchForm = document.querySelector("#city-search-form");
// select search container element
var searchContainerEl = document.querySelector("#search-container");
// select previous searches div
var previousSearchesEl = document.querySelector("#previous-searches");
// select the main results container
var mainResultsEl = document.querySelector("#main-results");

// create list to store searched cities
var cities = [];

// function to handle when a city is searched for
var citySearchHandler = function(event){
    event.preventDefault();
    // get the city from the form input
    var city = cityInputEl.value;
    // use the fetch function for that city
    cityFetch(city);
    
}

// function to fetch city weather info using api
var cityFetch = function(city){
    // make a fetch request using the city name
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3ecb6161f0ffa0bfa224115fa7448b5a`).then(function(response){
        // if the fetch is successful
        if (response.ok){
            // convert city to upper case
            city = city.toUpperCase();
            // check if city is in cities list
            if (!cities.includes(city)){
                // add city to list
                cities.push(city);
                // create button element
                var cityBtn = document.createElement("button");
                cityBtn.classList = "city-btn";
                cityBtn.setAttribute("data-city-name", city);
                cityBtn.textContent = city;
                // append button to search container
                previousSearchesEl.appendChild(cityBtn);
                // save list to local storage
                localStorage.setItem("cities", JSON.stringify(cities));
            }
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
                // append to main results div
                mainResultsEl.appendChild(cityHeader);
                // create list of weather info
                var weatherList = document.createElement("ul");
                // the temperature, 
                var temp = data.main.temp;
                // convert temp to farenheit
                var fTemp = ((temp - 273.15) * (9/5) + 32).toFixed(1);
                // create temp li
                var tempLi = document.createElement("li");
                tempLi.textContent = "Temperature: " + fTemp + "°F";
                // append to ul
                weatherList.appendChild(tempLi);
                // the humidity, 
                var humidity = data.main.humidity;
                // create humidity li
                var humidityLi = document.createElement("li");
                humidityLi.textContent = "Humidity: " + humidity + "%";
                // append to ul
                weatherList.appendChild(humidityLi);
                // the wind speed, 
                var windSpeed = data.wind.speed;
                // convert meters per second to miles per hour
                var mphWindSpeed = (windSpeed * 2.237).toFixed(1);
                // create wind speed li
                var windSpeedLi = document.createElement("li");
                windSpeedLi.textContent = "Wind Speed: " + mphWindSpeed + " MPH";
                // append to ul
                weatherList.appendChild(windSpeedLi);
                
                // get lat and lon for uv fetch request
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                // fetch uv index
                fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=3ecb6161f0ffa0bfa224115fa7448b5a&lat=${lat}&lon=${lon}`).then(function(response){
                    if (response.ok){
                        // convert to json
                        response.json().then(function(data){
                            // get uv index
                            var uv = data.value;
                            // create uv li
                            var uvLi = document.createElement("li");
                            uvLi.textContent = "UV Index: ";
                            // create span for uv index
                            var uvSpan = document.createElement("span");
                            uvSpan.textContent = uv;
                            // determine uv index color
                            if (uv < 3){
                                uvSpan.classList = "uv-low";
                            }else if (uv < 6){
                                uvSpan.classList = "uv-mod";
                            }else if (uv < 8){
                                uvSpan.classList = "uv-high";
                            }else if (uv < 11){
                                uvSpan.classList = "uv-very-high";
                            }else{
                                uvSpan.classList = "uv-extreme";
                            }
                            // append span to li
                            uvLi.appendChild(uvSpan);
                            // add li to ul
                            weatherList.appendChild(uvLi);
                        })
                    }
                })
                // append ul to main results
                mainResultsEl.appendChild(weatherList);
            })
        } else{
            alert("Error: " + response.statusText);
        }
    })  
}

// function to render previous searches
var loadCities = function(){
    // set cities variable to localStorage value
    cities = JSON.parse(localStorage.getItem("cities"));
    console.log(cities);
    console.log("text");
    if (!cities){
        cities = [];
        return
    }
    // render each city on the page as a button
    for (var i = 0; i < cities.length; i++){
        // create button element
        var cityBtn = document.createElement("button");
        cityBtn.classList = "city-btn";
        cityBtn.setAttribute("data-city-name", cities[i]);
        cityBtn.textContent = cities[i];
        // append button to search container
        previousSearchesEl.appendChild(cityBtn);
    }
}

var prevSearchHandler = function(event){
    // get the city name from the closest button clicked
    var city = event.target.closest(".city-btn").textContent;
    // use that city name to fetch
    cityFetch(city);
}

// load previous searches
loadCities();
// add event listener to search form submit
citySearchForm.addEventListener("submit", citySearchHandler);
// add event listener for click of previous searches
previousSearchesEl.addEventListener("click", prevSearchHandler);