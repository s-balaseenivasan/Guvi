import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from "react-icons/fa";


const MovieCard = ({ movie }) => {
  const Ratings = JSON.parse(localStorage.getItem("rating")) || {};
  const value = Ratings[movie.imdbID];

  return (
    <div className="flex flex-col items-center justify-center max-w-xs rounded overflow-hidden shadow-lg my-2">
      <img className="w-[300px] h-[400px]" src={movie.Poster} alt={movie.Title} />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl">{movie.Title}</h2>
        <p className="text-gray-700 text-base text-center">{movie.Year}</p>
        <div className="flex justify-center mt-2">
          {value && [1, 2, 3, 4, 5].map((i) =>
            i <= value
              ? <FaStar key={i} className="text-yellow-400" />
              : <FaRegStar key={i} className="text-gray-400" />
          )}
        </div>


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
