import React from 'react'
import MovieCard from './MovieCard'

export default function HomeMovies(probs) {
    return (
        <div>
            <h1 className='text-4xl font-bold text-center mt-3' > All Movie List</h1>
            {Object.entries(probs.Movies.Movie).map(([genre, movies]) => (
                <div className='px-5' key={genre}>
                    <h1 className='text-2xl font-bold mb-4 mt-2'>{genre}</h1>
                    <div className='flex flex-wrap gap-3'>
                        {movies.map(movie => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
