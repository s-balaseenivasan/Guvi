import { Link } from "react-router";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.imdbID}`}>
      <div className="flex flex-col items-center border box-border p-3 rounded shadow-xl hover:shadow-md transition">
        <img
          src={movie.Poster !== "Not Found" ? movie.Poster : "/no-image.jpg"}
          alt={movie.Title}
          className="h-[350px] w-[250px] rounded"
        />

        <h2 className="font-bold mt-2">{movie.Title}</h2>
        <p className="text-sm text-gray-600">{movie.Year}</p>
      </div>
    </Link>
  );
}
