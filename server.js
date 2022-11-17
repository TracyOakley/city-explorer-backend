'use strict';

console.log('our first server');

//const { response } = require('express');
// REQUIRE
// in our servers, we have to use 'require' instead of 'import'
// Here we will list the requirments for a server

const express = require('express');
//let data = require('./data/weather.json');


// we need to bring in our .env file, so we'll use this after we have installed
// `npm i dotenv`
require('dotenv').config();

// we must include CORS if we want to share resources over the web
const cors = require('cors');
const axios = require('axios');

// USE
// once we have required something, we have to use it
// Here is where we will assign the required file a variable
// React does this in one step with 'import' - express takes 2 steps: require and use
// This is just how express works
const app = express();

// We must tell express to use cors
app.use(cors());

// define the PORT and validate that our .env is working
const PORT = process.env.PORT || 3002;
// If we see our server running on 3002, that means theere's a problem with our .env file or how we are importing it.

// ROUTES
// this is where we will write handlers for our endpoints

// create a basic default route
// app.get() correlates to axios.get()
// app.get() takes in a parament or a URL in quotes, and callback function
app.get('/', (request, response) => {
  response.send('Hello, from our server');
});

app.get('/sayHello', (request, response)=> {
  console.log(request.query.name);
  let lastName = request.query.lastName;
  response.send(`Hi ${request.query.name} ${lastName}`);
});

app.get('/weather', async (request, response, next) => {
  try {
    //let city = request.query.cityName;
    //console.log(`THisOne: ${request.query.lat}`);

    let cityLat = request.query.lat;
    let cityLon = request.query.lon;

    

    //  let selectedCity = data.find(weather => weather.city_name === city);

    let cityURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&units=I&lat=${cityLat}&lon=${cityLon}&days=3`;

    //console.log(cityURL);

    let selectedCity = await axios.get(cityURL);


    let cityCleanedUp = [];

    cityCleanedUp = selectedCity.data.data.map(day => new Forecast(day));

    //console.log(cityCleanedUp);
    
    response.send(cityCleanedUp);

  } catch (error) {
    // create a new instance of the Error object that lives in Express
    next(error);
  }
});

app.get('/movie', async (request, response, next) => {
  try {
    let city = request.query.cityName;
  
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${city}&page=1&include_adult=false`;

    //console.log(movieURL);

    let selectedMovies = await axios.get(movieURL);

    let movieCleanedUp = [];

    movieCleanedUp = selectedMovies.data.results.map(movie => new Movie(movie));
    
    response.send(movieCleanedUp);

  } catch (error) {
    // create a new instance of the Error object that lives in Express
    next(error);
  }
});

// '*' wild card
// this will run for any route not defined above
app.get('*', (request, response) => {
  response.send('That route does not exist');
});

// ERRORS
// handle any errors
app.use((error, request, response) => {
  response.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(cityObject) {
    this.date = cityObject.valid_date;
    this.description = cityObject.weather.description;
  }
}

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.overview = movieObject.overview;
    this.vote_average =movieObject.vote_average;
    this.vote_count=movieObject.vote_count;
    this.image_url= movieObject.poster_path;
    this.popularity= movieObject.popularity;
    this.released_on= movieObject.released_date;
  }
}


// LISTEN
// start the server

// listen is express method, it takes in a port value and a callback function
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
