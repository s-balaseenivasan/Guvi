import React from 'react'
import MovieCard from './MovieCard';

export default function MovieList({
    Movies={
      
    }
}) {
  
  return (
    <div>
       <h1 className='text-4xl font-bold text-center mt-3' > All Movie List</h1>

       {Object.entries(Movies.Movie).map(([genre, movies]) => (
   <div className='px-5' key={genre}>
    <h1 className='text-2xl font-bold mb-4 mt-2'>{genre}</h1>
    <div className='flex flex-wrap gap-3'>
      {movies.map(movie => (
      <MovieCard key={movie.imdbID} movie={movie} />
      
    ))}

    </div>

    
  </div>
))}

       {/* <div className='grid grid-cols-5 items-center px-5 gap-3 '>
        {Movies.length > 0 && Movies.map((movie,index)=>(
            <span key={index} ><MoviesCard Movie={movie}/></span>
            
        ))}
       </div> */}

    </div>

  )
}
