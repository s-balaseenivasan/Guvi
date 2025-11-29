import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-xs rounded overflow-hidden shadow-lg my-2">
      <img className="w-[300px] h-[400px]" src={movie.Poster} alt={movie.Title} />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl">{movie.Title}</h2>
        <p className="text-gray-700 text-base text-center">{movie.Year}</p>
      </div>
      <div className="flex justify-center items-center">
        <Link
          to={`/movie/${movie.imdbID}`}
          className="bg-blue-500 text-white rounded px-4 py-2 mb-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
