import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        fetch(`https://www.omdbapi.com/?i=${id}&apikey=b2c3ff60`)
            .then((response) => response.json())
            .then((result) => setMovie(result))
            .catch((err) => setError(err));
    }, [id]);

    if (error) return <h1 className="text-red-500 p-6">{error}</h1>;
    if (!movie) return <h1 className="text-center p-6">Loading...</h1>;

    return (
        <div className="flex items-center justify-center h-screen w-full bg-amber-100 ">
            <div className="flex flex-col p-5 items-center justify-center rounded-2xl shadow-xl bg-[#edf2f7] box-border

">
                <img
                src={movie.Poster}
                alt={movie.Title}
                className="h-[350px] w-[250px] rounded"
            />

            <h1 className="text-4xl font-bold mb-3">{movie.Title}</h1>

            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p className="max-w-[600px]"><strong>Plot:</strong> {movie.Plot}</p>
            <p><strong>Cast:</strong> {movie.Actors}</p>
            <h2 className="text-xl font-semibold mt-4">Ratings</h2>
            {movie.Ratings?.map((rate, i) => (
                <p key={i}>• {rate.Source}: {rate.Value}</p>
            ))}
            </div>

        </div>
    );
}
