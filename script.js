function getWeather(city) {
    let APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);


        let currentDate = moment().format("MM/DD/YYYY");
        let icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        let temperature = response.main.temp - 273.15;
        temperature = temperature.toFixed(2);
        let humidity = response.main.humidity;
        let windSpeed = response.wind.speed;

        $("#today").empty();
        $("#today").append(`
        <h2 class="text-left">${response.name} (${currentDate})  <img src="${icon}" /></h2>
    
        <p>Temperature:${temperature} &#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} MPH</p>
      `);


        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(response.name);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));


        displayHistory();
    });

};

$("#search-form").on("submit", function (event) {

    event.preventDefault();


    let city = $("#search-input").val().trim();


    getWeather(city);


    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history.unshift(city);


    localStorage.setItem("searchHistory", JSON.stringify(history));


    displayHistory();

    $("#search-input").val("");
});

$(document).ready(function () {
    getWeather("London, UK");
});