const WEATHER_API_KEY = '63f924fd3e52b7d1a5ec179e9748575d';
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchWeather = async (city = 'London') => {
  const response = await fetch(
    `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
  );
  if (!response.ok) {
    throw new Error('City not found or API error');
  }
  const data = await response.json();
  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
};

export const fetchPopularMovies = async (page = 1) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  const data = await response.json();
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    description: movie.overview,
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    type: 'movie',
  }));
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
  );
  if (!response.ok) {
    throw new Error('Search failed');
  }
  const data = await response.json();
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    description: movie.overview,
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    type: 'movie',
  }));
};

export const fetchMovieDetails = async (movieId) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    image: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : null,
    backdrop: data.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}`
      : null,
    description: data.overview,
    rating: data.vote_average,
    releaseDate: data.release_date,
    runtime: data.runtime,
    genres: data.genres.map((g) => g.name),
    voteCount: data.vote_count,
  };
};
