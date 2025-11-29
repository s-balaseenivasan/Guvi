import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../services/omdbApi';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details", error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6  shadow-2xl">
      <div className="flex flex-col md:flex-row">
        <img src={movie.Poster} alt={movie.Title} className="w-full md:w-1/3" />
        <div className="md:ml-6 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{movie.Title}</h1>
          <p className="text-lg text-gray-600">{movie.Year} | {movie.Genre}</p>
          <p className="my-4">{movie.Plot}</p>
          <h3 className='font-semibold'>Actress</h3>
          <p>{movie.Actors}</p>
          
          <h3 className="font-semibold">Ratings</h3>
          {movie.Ratings.map((rating) => (
            <p key={rating.Source}>{rating.Source}: {rating.Value}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
