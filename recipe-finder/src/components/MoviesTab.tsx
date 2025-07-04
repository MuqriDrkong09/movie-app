import { useEffect, useState } from "react";
import {
    fetchTrendingMovies,
    fetchNowPlayingMovies,
    fetchUpcomingMovies,
    fetchTopRatedMovies
} from "../api/api.ts";
import MovieCard from "./MovieCard.tsx";

const tabs = [
    { key: "trending", label: "🎬 Trending" },
    { key: "now_playing", label: "🍿 Now Playing" },
    { key: "upcoming", label: "🔜 Upcoming" },
    { key: "top_rated", label: "⭐ Top Rated" },
];

export default function MovieTabs({ onSelectMovie }) {
    const [activeTab, setActiveTab] = useState("trending");
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMovies = async () => {
            let data;

            switch (activeTab) {
                case "now_playing":
                    data = await fetchNowPlayingMovies(currentPage);
                    break;
                case "upcoming":
                    data = await fetchUpcomingMovies(currentPage);
                    break;
                case "top_rated":
                    data = await fetchTopRatedMovies(currentPage);
                    break;
                default:
                    data = await fetchTrendingMovies(currentPage);
            }

            setMovies(data.results || []);
            setTotalPages(data.total_pages || 1);
        };

        fetchMovies();
    }, [activeTab, currentPage]);

    return (
        <div className="my-8">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 rounded-md font-semibold ${
                            activeTab === tab.key
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => {
                            setActiveTab(tab.key);
                            setCurrentPage(1); // Reset to page 1 when switching tabs
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => onSelectMovie(movie)}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-1 flex-wrap">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>

                {currentPage > 3 && (
                    <>
                        <button
                            onClick={() => setCurrentPage(1)}
                            className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded"
                        >
                            1
                        </button>
                        {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                    </>
                )}

                {Array.from({ length: 5 }, (_, i) => {
                    const page =
                        currentPage <= 3
                            ? i + 1
                            : currentPage >= totalPages - 2
                                ? totalPages - 4 + i
                                : currentPage - 2 + i;

                    if (page < 1 || page > totalPages) return null;

                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                                currentPage === page
                                    ? "bg-blue-700 text-white"
                                    : "bg-white border border-blue-500 text-blue-500"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {currentPage < totalPages - 2 && (
                    <>
                        {currentPage < totalPages - 3 && (
                            <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-3 py-1 bg-white border border-blue-500 text-blue-500 rounded"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
