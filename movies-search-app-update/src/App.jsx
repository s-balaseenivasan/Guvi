import React, { useState, useEffect } from "react";
import { Routes, Route , Link } from "react-router-dom";
import { fetchMovies } from "./services/omdbApi";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Pagination from "./components/Pagination";
import MovieDetails from "./components/MovieDetails";
import movie from "/public/ModelData.json";
import HomeMovies from "./components/HomeMovies";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState(""); 
  const [type, setType] = useState("");   

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSearch = (searchQuery, selectedType) => {
    setQuery(searchQuery);
    setType(selectedType);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovies(query, currentPage, type);

        if (data.Response === "False") {
          setMovies([]);
          setError(data.Error);
        } else {
          setMovies(data.Search || []);
          setTotalPages(Math.ceil(data.totalResults / 10));
        }
      } catch (err) {
        setError("Something went wrong while fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, type, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      
        <div className="flex justify-center md:justify-between items-center px-2 bg-black text-white w-full">
          
         <Link to={'/'}>
          <h1 className="hidden md:block text-3xl font-bold">Movie Search App</h1>
         </Link>
         <SearchBar onSearch={handleSearch} />
          
        </div>
        
        <div className="p-3">
          <Routes>
          <Route
            path="/"
            element={
              <>
                {loading && <div>Loading...</div>}
                {error && <div className="text-red-500 text-center text-2xl">{error}</div>}

                {!loading && !error && movies.length === 0 && (
                  <HomeMovies Movies={movie} />
                  
                )}
                <MovieList movies={movies} />
                {!loading && movies.length > 0 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            }
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
        </div>
    
    </>
  );
};

export default App;
