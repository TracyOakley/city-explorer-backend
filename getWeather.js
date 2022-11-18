const axios = require('axios');

async function getWeather(request,response,next){

  try {

    let cityLat = request.query.lat;
    let cityLon = request.query.lon;

    let cityURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&units=I&lat=${cityLat}&lon=${cityLon}&days=3`;


    let selectedCity = await axios.get(cityURL);

    let cityCleanedUp = [];

    cityCleanedUp = selectedCity.data.data.map(day => new Forecast(day));
    
    response.send(cityCleanedUp);

  } catch (error) {
    next(error);
  }
}

class Forecast {
  constructor(cityObject) {
    this.date = cityObject.valid_date;
    this.description = cityObject.weather.description;
  }
}

module.exports = getWeather;
