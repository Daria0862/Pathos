const APIController = (function () {


    // private methods - The following paragraph of code has been taken from mujibsardar's github Repo on using Spotify with only jQuery
    const _getToken = (sParam) => {
        let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
            sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
            sParameterName,
            i;
        let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
        sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };


    const token = _getToken('access_token');


    let client_id = '614d476329af4034b2a4806c49e5ec6b';

    let redirect_uri = 'https%3A%2F%2Fdaria0862.github.io%2Fpathos';

    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    if (token == null || token == "" || token == undefined) {
        window.location.replace(redirect);
    }

    const _getGenres = function (token) {
        return $.ajax({
            url: `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

    };

    const _getPlaylistByGenre = function (token, genreId) {
        const limit = 10;

        return $.ajax({
            url: `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
    };

    const _getTracks = function (token, tracksEndPoint) {
        const limit = 10;

        return $.ajax({
            url: `${tracksEndPoint}?limit=${limit}`,
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
    };

    const _getTrack = function (token, trackEndPoint) {
        return $.ajax({
            url: `${trackEndPoint}`,
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
    };

    return {

        getToken: function () {
            return _getToken();
        },
        getGenres: function (token) {
            return _getGenres(token);
        },
        getPlaylistByGenre: function (token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks: function (token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack: function (token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }

    }

})();

function getWeather(city) {
    let APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response.weather[0].description);


        let currentDate = moment().format("MM/DD/YYYY");
        let icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        let temperature = response.main.temp - 273.15;
        temperature = temperature.toFixed(2);
        let humidity = response.main.humidity;
        let windSpeed = response.wind.speed;

        // Added card to hold the weather parameters
        $("#today").empty();
        $("#today").append(`
        <div class="card" id="weatherCard" style="width: 18rem;>
            <div class="card-header header">
            <h4 class="text-left">${response.name} (${currentDate})  <img src="${icon}" /></h4>
            </div>
            <ul class="list-group list-group-flush" id="weatherList" >
                <li class="list-group-item">Temperature:${temperature} &#8451;</li>
                <li class="list-group-item">Humidity: ${humidity}%</li>
                <li class="list-group-item">Wind Speed: ${windSpeed} MPH</li>
            </ul>
        </div>
      `);


    });

};

$("#search-form").on("submit", function (event) {

    event.preventDefault();


    let city = $("#search-input").val().trim();


    getWeather(city);
    songSelect();



    $("#search-input").val("");
});

$(document).ready(function () {
    getWeather("London, UK");
});


async function songSelect() {
    const token = await APIController.getToken();
    const genres = await APIController.getGenres(token);
    const randomIndex = Math.floor(Math.random() * genres.length);
    const randomGenre = genres[randomIndex].id;
    const playlists = await APIController.getPlaylistByGenre(token, randomGenre);
    const randomPlaylistIndex = Math.floor(Math.random() * playlists.length);
    const randomPlaylist = playlists[randomPlaylistIndex];
    const tracks = await APIController.getTracks(token, randomPlaylist.tracks.href);
    const randomTrackIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = tracks[randomTrackIndex];
    const trackData = await APIController.getTrack(token, randomTrack.track.href);

    const card = `
      <div class="card mb-3" style="max-width: 540px;">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${trackData.album.images[0].url}" class="card-img" alt="Album Art">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${trackData.name}</h5>
              <p class="card-text">${trackData.artists[0].name}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    $("#music").html(card);
}
