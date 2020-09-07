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
// select five day results container
var fiveDayResultsEl = document.querySelector("#five-day-results");

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
                addCityBtn(city);
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
                            if (uv < 4){
                                uvSpan.classList = "uv-low";
                            }else if (uv < 7){
                                uvSpan.classList = "uv-mod";
                            }else{
                                uvSpan.classList = "uv-high";
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
                // get 5 day results
                fiveDayFetch(city);
            })
        } else{
            alert("Error: " + response.statusText);
        }
    })  
}

// function to fetch 5 day forecast
var fiveDayFetch = function(city){
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f4f14a83552976dedb188c08b5e2b54b`).then(function(response){
        if (response.ok){
            // convert to json
            response.json().then(function(data){
                var currentDate = moment().format("MM/DD/YYYY");
                //iterate through list
                for (var i = 0; i < data.list.length; i++){
                    var uDate = data.list[i].dt;
                    var date = moment.unix(uDate).format("MM/DD/YYYY");
                    // check if the date is the same date. If not, create a card for the screen
                    if (date != currentDate){
                        renderFiveDay(data.list[i]);
                        currentDate = date;
                    }
                    
                }
            })
        }
    })
}

var renderFiveDay = function(day){
    // get date
    var date = moment.unix(day.dt).format("MM/DD/YYYY");
    // get icon
    var icon = day.weather[0].icon;
    // icon url
    var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    // create icon img element
    var iconImg = document.createElement("img");
    iconImg.setAttribute("src", iconUrl);
    // get temp in kelvin
    var temp = day.main.temp;
    // convert temp to f
    var fTemp = ((temp - 273.15) * (9/5) + 32).toFixed(1);
    // get humidity
    var humidity = day.main.humidity;
    // create a card for the forecast data
    var forecastCard = document.createElement("div");
    forecastCard.classList = "col-sm-4 col-md-2 card";
    // create header
    var forecastHead = document.createElement("h5");
    forecastHead.textContent = date;
    // append header to card
    forecastCard.appendChild(forecastHead);
    // append icon
    forecastCard.appendChild(iconImg);
    // create p tags for temp and humidity
    var tempEl = document.createElement("p");
    tempEl.textContent = `Temp: ${temp} °F`;
    var humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${humidity}%`;
    // append to forecast card
    forecastCard.appendChild(tempEl);
    forecastCard.appendChild(humidityEl);
    // append to five day div
    fiveDayResultsEl.appendChild(forecastCard);
}

// function to render previous searches
var loadCities = function(){
    // set cities variable to localStorage value
    cities = JSON.parse(localStorage.getItem("cities"));
    //console.log(cities);
    //console.log("text");
    if (!cities){
        cities = [];
        return
    }
    // render each city on the page as a button
    for (var i = 0; i < cities.length; i++){
        // create button element
        addCityBtn(cities[i])
    }
}

// function to add previously searched city as a button
var addCityBtn = function(city){
    // create button element
    var cityBtn = document.createElement("button");
    cityBtn.classList = "city-btn";
    cityBtn.setAttribute("data-city-name", city);
    cityBtn.textContent = city;
    // append button to search container
    previousSearchesEl.appendChild(cityBtn);
}

// function to handle when a previously searched city button is clicked
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