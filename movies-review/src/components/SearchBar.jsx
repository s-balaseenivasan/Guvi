import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query, type); 
        setQuery("");
        navigate("/");
    };

    return (
        
        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 py-5 ">

            <input
                type="text"
                placeholder="Search for movies, series..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-4 py-2 w-64 border border-gray-300 rounded-lg"
            />


            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-4 py-2 bg-black border border-gray-300 rounded-lg"
            >
                <option value="">All</option>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
                <option value="episode">Episode</option>
            </select>
            
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
