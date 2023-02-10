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

    });

};

$("#search-form").on("submit", function (event) {

    event.preventDefault();


    let city = $("#search-input").val().trim();


    getWeather(city);


    $("#search-input").val("");
});

$(document).ready(function () {
    getWeather("London, UK");
});


const APIController = (function () {

    const clientId = '614d476329af4034b2a4806c49e5ec6b';
    const clientSecret = 'fdc8bff4cb9a4932b8f364d74e60d2cd';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = await APIController.getToken();
    const genres = await APIController.getGenres(token);
    const randomGenreIndex = Math.floor(Math.random() * genres.length);
    const selectedGenre = genres[randomGenreIndex];
    const playlists = await APIController.getPlaylistByGenre(token, selectedGenre.id);
    const randomPlaylistIndex = Math.floor(Math.random() * playlists.length);
    const selectedPlaylist = playlists[randomPlaylistIndex];
    const tracks = await APIController.getTracks(token, selectedPlaylist.tracks.href);
    const randomTrackIndex = Math.floor(Math.random() * tracks.length);
    const selectedTrack = tracks[randomTrackIndex];
    const track = await APIController.getTrack(token, selectedTrack.track.href);
    console.log(track);
});
