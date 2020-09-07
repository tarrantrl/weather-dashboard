var cityInputEl = document.querySelector("#city");
var citySearchForm = document.querySelector("#city-search-form");

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
                console.log(data);
                // city name,
                var cityName = data.name; 
                // the date, 
                // an icon representation of weather conditions, 
                var icon = data.weather.icon;
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