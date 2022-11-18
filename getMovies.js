const axios = require('axios');

async function getMovies(request,response,next){
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


module.exports = getMovies;
