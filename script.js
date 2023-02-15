// All code for APIController is from user sammy007 on github

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

function getWeather(city) {
    let APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response.weather[0].description);


        let currentDate = moment().format("DD/MM/YYYY");
        let icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        let temperature = response.main.temp - 273.15;
        temperature = temperature.toFixed(2);
        let humidity = response.main.humidity;
        let weather = response.weather[0].description;
        console.log(weather);
        console.log(response);


        // Added card to hold the weather parameters
        const card = `
       
        <div class="card" id="weatherCard" style="width: 540px;>
            <div class="card-header header">
            <h4 class="text-left">${response.name} (${currentDate})  <img src="${icon}" /></h4>
            </div>
            <ul class="list-group list-group-flush" id="weatherList" >
                <li class="list-group-item"> &#127777; ${temperature} &#8451;</li>
                <li class="list-group-item">Description:${weather}</li>
                
            </ul>
        </div>
        `

        $("#today").fadeOut(500, function () {
            $(this).empty().append(card).fadeIn(500);
        });



    });

};

$("#search-form").on("submit", function (event) {

    event.preventDefault();


    let city = $("#search-input").val().trim();


    getWeather(city)
    songSelect()



    $("#search-input").val("");
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
      <div class="card mb-3" style="width: 540px;">
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

    $("#today2").fadeOut(500, function () {
        $(this).empty().append(card).fadeIn(500);
    });
}




