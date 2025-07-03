import YouTube from "react-youtube";
import { useEffect, useState } from "react";
import { getMovieVideos, fetchGenres, fetchMoviesReviews } from "../api/api.ts";

export default function MovieModal({ movie, onClose }) {
    const [trailer, setTrailer] = useState(null);
    const [genreMap, setGenreMap] = useState({});
    const [tab, setTab] = useState("Details");
    const [reviews, setReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchTrailer = async () => {
            const t = await getMovieVideos(movie.id);
            setTrailer(t);
        };
        fetchTrailer();

        const loadGenres = async () => {
            const genres = await fetchGenres();
            const map = {};
            genres.forEach((g) => (map[g.id] = g.name));
            setGenreMap(map);
        };
        loadGenres();

        const loadReviews = async () => {
            const data = await fetchMoviesReviews(movie.id);
            setReviews(data.results);
            setTotalReviews(data.total_results);
        }

        loadReviews();
        setTab("Details");
    }, [movie]);

    const formattedDate = new Date(movie.release_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[500px] overflow-y-auto relative p-4 md:p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-600 font-bold text-xl"
                >
                    ✕
                </button>

                <div className={"flex gap-4 mb-4 border-b pb-2"}>
                    {["Details", "Trailer", "Reviews"].map((t) => (
                        <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`font-semibold ${tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {tab === "Details" && (
                <div className="flex flex-col gap-6 md:flex-row mt-8">
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                                : "https://via.placeholder.com/342x513?text=No+Image"
                        }
                        alt={movie.title}
                        className="w-full md:w-[200px] rounded shadow-md object-cover"
                    />

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                        <p className="mb-3 text-gray-700">{movie.overview}</p>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Release Date:</strong> {formattedDate}</p>
                            <p><strong>Rating:</strong> ⭐ {movie.vote_average} ({movie.vote_count} votes)</p>
                            <p><strong>Language:</strong> {movie.original_language.toUpperCase()}</p>
                            <p>
                                <strong>Genres:</strong> {movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(", ")}
                            </p>
                        </div>
                    </div>
                </div>
                )}

                {tab === "Trailer" && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                    {trailer ? (
                        <div className="w-full aspect-video">
                            <YouTube
                                videoId={trailer.key}
                                className="w-full h-full"
                                iframeClassName="w-full h-full rounded"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">Trailer not available</p>
                    )}
                </div>
                )}

                {tab === "Reviews" && (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews available.</p>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    Reviews ({totalReviews})
                                </h3>
                                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => {
                                    const isLong = review.content.length > 300;
                                    const isExpanded = expandedReviews.has(review.id);

                                    const toggleExpanded = () => {
                                        setExpandedReviews((prev) => {
                                            const newSet = new Set(prev);
                                            if (newSet.has(review.id)) {
                                                newSet.delete(review.id);
                                            } else {
                                                newSet.add(review.id);
                                            }
                                            return newSet;
                                        });
                                    };

                                    return (
                                        <div key={review.id} className="border-b pb-4">
                                            <p className="text-sm text-gray-600 font-bold mb-1">{review.author}</p>

                                            <p className="text-gray-700 text-sm mb-1">
                                                "
                                                {isLong && !isExpanded
                                                    ? `${review.content.slice(0, 300)}...`
                                                    : review.content}
                                                "
                                                {isLong && (
                                                    <button
                                                        onClick={toggleExpanded}
                                                        className="ml-1 text-blue-500 hover:underline"
                                                    >
                                                        {isExpanded ? "Show less" : "Read more"}
                                                    </button>
                                                )}
                                            </p>

                                            {review.author_details?.rating && (
                                                <p className="text-yellow-500 text-sm">Rating: ⭐ {review.author_details.rating}</p>
                                            )}
                                        </div>
                                    );
                                })}

                                {reviews.length > 3 && (
                                    <button
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                        className="mt-2 text-blue-600 font-medium underline"
                                    >
                                        {showAllReviews ? "Show Less" : "See All Reviews"}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
