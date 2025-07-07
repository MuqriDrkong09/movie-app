import YouTube from "react-youtube";
import { useEffect, useState } from "react";
import {getMovieVideos, fetchGenres, fetchMoviesReviews, fetchMovieCredits, fetchMovieDetails, fetchRecommendedMovies, fetchSimilarMovies} from "../api/api.ts";
import PersonModal from "./PersonModal.tsx";
import SecondaryMovieModal from "./SecondaryMovieModal.tsx";
import Pagination from "./pagination.tsx";

export default function MovieModal({ movie, onClose }) {
    const [trailer, setTrailer] = useState(null);
    const [genreMap, setGenreMap] = useState({});
    const [tab, setTab] = useState("Details");
    const [reviews, setReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [fullMovieDetails, setFullMovieDetails] = useState(null);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [similarMovie, setSimilarMovie] = useState([]);
    const [relatedToggle, setRelatedToggle] = useState<"recommended" | "similar">("recommended");
    const [seconddaryMovies, setSeconddaryMovies] = useState(null);
    const [recommendedPages, setRecommendedPages] = useState(1);
    const [recomendedTotalPages, setRecomendedTotalPages] = useState(1);
    const [similarPages, setSimilarPages] = useState(1);
    const [similarTotalPages, setSimilarTotalPages] = useState(1);

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

    useEffect(() => {
        const loadCredits = async () => {
            const data = await fetchMovieCredits(movie.id);
            setCredits({ cast: data.cast.slice(0, 10), crew: data.crew });
        };

        loadCredits();
    }, [movie]);

    useEffect(() => {
        const fetchMovieData = async () => {
            const details = await fetchMovieDetails(movie.id);
            setFullMovieDetails(details);
        }
        fetchMovieData();
    }, [movie]);

    const formattedDate = new Date(movie.release_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        const loadRecommended = async () => {
            const data = await fetchRecommendedMovies(movie.id, recommendedPages);
            setRecommendedMovies(data.results);
            setRecomendedTotalPages(data.total_pages);
        };
        loadRecommended()
    }, [movie, recommendedPages]);

    useEffect(() => {
        const loadSimilar = async () => {
            const data = await fetchSimilarMovies(movie.id, similarPages);
            setSimilarMovie(data.results);
            setSimilarTotalPages(data.total_pages);
        }
        loadSimilar()
    }, [movie, similarPages]);

    useEffect(() => {
        setRecommendedPages(1);
        setSimilarPages(1)
    }, [movie]);

    useEffect(() => {
        if (relatedToggle === "recommended"){
            setRecommendedPages(1)
        } else {
            setSimilarPages(1)
        }
    }, [relatedToggle]);

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
                    {["Details", "Trailer", "Reviews", "Cast & Crew", "Related"].map((t) => (
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
                        className="w-[150px] h-[225px] rounded object-cover shadow-md"
                    />

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                        <p className="mb-3 text-gray-700">{movie.overview}</p>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Release Date:</strong> {formattedDate}</p>
                            {fullMovieDetails?.production_countries?.length > 0 && (
                                <p>
                                    <strong>Countries:</strong> {fullMovieDetails.production_countries.map((c) => c.name).join(", ")}
                                </p>
                            )}
                            <p><strong>Rating:</strong> ⭐ {movie.vote_average} ({movie.vote_count} votes)</p>
                            <p><strong>Language:</strong> {movie.original_language.toUpperCase()}</p>
                            {fullMovieDetails?.runtime && (
                                <p>
                                    <strong>Runtime:</strong> {Math.floor(fullMovieDetails.runtime / 60)}h {fullMovieDetails.runtime % 60}m
                                </p>
                            )}
                            {fullMovieDetails?.budget > 0 && (
                                <p>
                                    <strong>Budget:</strong> ${fullMovieDetails.budget.toLocaleString()}
                                </p>
                            )}

                            {fullMovieDetails?.revenue > 0 && (
                                <p>
                                    <strong>Revenue:</strong> ${fullMovieDetails.revenue.toLocaleString()}
                                </p>
                            )}
                            <p>
                                <strong>Genres:</strong> {movie.genre_ids.map(id => genreMap[id]).filter(Boolean).join(", ")}
                            </p>
                            {fullMovieDetails?.tagline && (
                                <p className="italic text-gray-600 mb-3">"{fullMovieDetails.tagline}"</p>
                            )}
                        </div>

                        {fullMovieDetails?.homepage && (
                            <p>
                                <strong>Website:</strong>{" "}
                                <a
                                    href={fullMovieDetails.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {fullMovieDetails.homepage}
                                </a>
                            </p>
                        )}

                        {fullMovieDetails?.production_companies?.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2 border-b pb-1 text-gray-800">Production Companies</h3>
                                <ul className="space-y-3">
                                    {fullMovieDetails.production_companies.map((company) => (
                                        <li key={company.id} className="flex items-center">
                                            {company.logo_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-8 object-contain mr-3"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 bg-gray-300 rounded mr-3 flex items-center justify-center text-xs text-gray-600">
                                                    N/A
                                                </div>
                                            )}
                                            <span className="text-sm text-gray-800">{company.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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

                {tab === "Cast & Crew" && (
                    <div className={"space-y-6"}>
                        <div>
                            <h3 className={"text-lg font-semibold"}>Director</h3>
                            <p>
                                {
                                    credits.crew.find((p) => p.job === "Director")?.name || "Not listed"
                                }
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Top Cast</h3>
                            <div className={"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"}>
                                {credits.cast.map((actor) => (
                                    <div key={actor.id} className={"text-center"}>
                                        <img
                                            src={
                                                actor.profile_path
                                                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                    : "https://via.placeholder.com/185x278?text=No+Image"
                                            }
                                            alt={actor.name}
                                            className={"w-full h-48 object-cover rounded mb-1"}
                                        />
                                        <p className={"font-medium text-sm cursor-pointer text-blue-600 hover:underline"} onClick={() => setSelectedPersonId(actor.id)}>{actor.name}</p>
                                        <p className={"text-xs text-gray-500"}>as  {actor.character}</p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mt-2">Key Crew</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    {["Director", "Producer", "Writer", "Composer"].map((role) => {
                                        const people = credits.crew.filter((p) => p.job === role);
                                        return (
                                            people.length > 0 && (
                                                <li key={role}>
                                                    <strong>{role}:</strong> {people.map((p) => p.name).join(", ")}
                                                </li>
                                            )
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {selectedPersonId && <PersonModal personId={selectedPersonId} onClose={() => setSelectedPersonId(null)} />}

                {tab === "Related" && (
                    <div>
                        <div className={"flex gap-4 mb-4"}>
                            <button
                                onClick={() => setRelatedToggle("recommended")}
                                className={`px-4 py-1 rounded-full border ${
                                    relatedToggle === "recommended" ? "bg-blue-500 text-white" : "bg-white text-gray-600"
                                }`}
                            >
                                Recommended
                            </button>
                            <button
                                onClick={() => setRelatedToggle("similar")}
                                className={`px-4 py-1 rounded-full border ${
                                    relatedToggle === "similar" ? "bg-blue-500 text-white" : "bg-white text-gray-600"
                                }`}
                            >
                                Similar
                            </button>
                        </div>

                        <div className={"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"}>
                            {(relatedToggle === "recommended" ? recommendedMovies : similarMovie).map((movie) => (
                                <div key={movie.id} className={"text-center"} onClick={() => setSeconddaryMovies(movie)}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-[150px] h-[225px] rounded object-cover shrink-0 mb-1"
                                    />
                                    <p className={"font-medium text-sm"}>{movie.title}</p>
                                    <p className={"text-xs text-gray-500"}>{new Date(movie.release_date).getFullYear()}</p>
                                </div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={relatedToggle === "recommended" ? recommendedPages : similarPages}
                            totalPages={relatedToggle === "recommended" ? recomendedTotalPages : similarTotalPages}
                            onPageChange={relatedToggle === "recommended" ? setRecommendedPages : setSimilarPages}
                        />
                    </div>
                )}

                {seconddaryMovies && (
                    <SecondaryMovieModal movie={seconddaryMovies} onClose={() => setSeconddaryMovies(null)} />
                )}
            </div>
        </div>
    );
}
