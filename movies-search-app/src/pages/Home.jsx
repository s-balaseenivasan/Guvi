import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";
import movie from "/public/ModelData.json";




export default function Home() {
    const [Movies, setMovies] = useState({})
    const [SearchText, setSearchText] = useState("");
    const [GetText, setGetText] = useState("");
    const [Err, setErr] = useState("");


    useEffect(() => {
        if (SearchText !== "") {
            fetch(`https://www.omdbapi.com/?s=${SearchText}&apikey=b2c3ff60`)
                .then((response) => response.json())
                .then((result) => setMovies(result))
                .catch((err) => setErr(err));

        }

    }, [SearchText]);
    function saveSearchText(e) {
        if (e.code == "Enter" || e.code == "NumpadEnter") {
            setSearchText(GetText);
        }
    }


    return (
        <div >
            <Navbar cb={setGetText} onSubmit={saveSearchText} />

            {Err && (
                <h1 className="text-center text-red-500 text-xl mt-4">{Err}</h1>
            )}
            {
                Movies.Search?.length === undefined && (
                    <MovieList Movies={movie} />
                )

            }

            <div className="flex flex-wrap justify-center mt-3 mb-2 gap-3">
                {Movies.Search?.length > 0 && Movies.Search.map((movie) =>
                (
                    <div>
                        <MovieCard key={movie.imdbID} movie={movie} />
                    </div>

                ))}
            </div>

        </div>
    );
}
