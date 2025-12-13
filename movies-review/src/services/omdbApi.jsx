import axios from 'axios';

const API_KEY = 'b2c3ff60'; // Replace with your OMDB API Key
const BASE_URL = 'https://www.omdbapi.com/';

export const fetchMovies = async (query, page = 1, type = '') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        s: query,
        page: page,
        type: type,
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movies", error);
    throw error;
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        i: id,
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details", error);
    throw error;
  }
};
