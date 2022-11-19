'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3002;
const express = require('express');
const cors = require('cors');

const weather = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');
const app = express();

app.use(cors());

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  const {lat,lon} = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}  

app.get('/movie', movieHandler);

function movieHandler(request, response) {
  //console.log(request.query);
  const {cityName} = request.query;
  //console.log(cityName);
  getMovies(cityName)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}  


app.listen(PORT, () => console.log(`Server up on ${PORT}`));
