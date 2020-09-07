var cityInputEl = document.querySelector("#city");
var citySearchForm = document.querySelector("#city-search-form");

// function to handle when a city is searched for
var citySearchHandler = function(){
    // get the city from the form input
    var city = cityInputEl.value;
}

citySearchForm.addEventListener("submit", citySearchHandler);