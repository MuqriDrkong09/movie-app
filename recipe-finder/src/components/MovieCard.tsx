const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie, onClick }) {
    return (
        <div onClick={() => onClick(movie)} className="rounded overflow-hidden shadow-lg bg-white cursor-pointer hover:scale-105 transition-transform duration-200">
            <img src={IMG_BASE + movie.poster_path} alt={movie.title} className="w-full h-80 object-cover" />
            <div className="p-4">
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p className="text-gray-600">⭐ {movie.vote_average}</p>
            </div>
        </div>
    );
}
