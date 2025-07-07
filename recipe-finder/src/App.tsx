import "./App.css";
import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "./api/api.ts";
import MovieCard from "./components/MovieCard.tsx";
import SearchBar from "./components/SearchBar.tsx";
import { searchMovies } from "./api/api.ts";
import FilterBar from "./components/FilterBar.tsx";
import { fetchMoviesByGenreOrYear } from "./api/api.ts";
import MovieModal from "./components/MovieModal.tsx";
import MovieTabs from "./components/MoviesTab.tsx";

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mode, setMode] = useState("tabs");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({ genreId: "", year: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [liveResults, setLiveResults] = useState<any[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      const trending = await fetchTrendingMovies(1);
      setMovies(trending.results);
      setTotalPages(trending.total_pages || 1);
    };
    getMovies();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let data;
      if (mode === "search") {
        data = await searchMovies(query, currentPage);
      } else if (mode === "filter") {
        data = await fetchMoviesByGenreOrYear(
          filter.genreId,
          filter.year,
          currentPage,
        );
      } else {
        data = await fetchTrendingMovies(currentPage);
      }

      setMovies(data.results);
      setTotalPages(data.total_pages || 1);
    };

    fetchData();
  }, [currentPage, mode, query, filter]);

  const handleSubmit = (query) => {
    setQuery(query);
    setCurrentPage(1);
    setMode("search");
  };

  const handleFilter = (genreId, year) => {
    setFilter({ genreId, year });
    setCurrentPage(1);
    setMode("filter");
  };

  const handleClearFilter = () => {
    setFilter({ genreId: "", year: "" });
    setMode("tabs");
    setCurrentPage(1);
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <SearchBar
        onSearch={handleSubmit}
        onSelectMovie={(movie) => setSelectedMovies(movie)}
        searchFunction={searchMovies}
        onClear={() => {
          setQuery("");
          setMode("trending");
          setCurrentPage(1);
          setLiveResults([]);
        }}
        onLiveSearchResult={(results, inputQuery) => {
          setLiveResults(results);

          if (inputQuery === "") {
            setMode("tabs");
          } else if (results.length > 0) {
            setMode("search");
          }
        }}
      />

      {mode === "search" && liveResults.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No results found.</div>
      )}

      {liveResults.length > 0 && mode === "search" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {liveResults.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovies(movie)}
            />
          ))}
        </div>
      )}

      <div className="text-center mb-6">
        <button
          onClick={() => {
            setShowFilter((prev) => !prev);
            setMode("filter"); // make sure to switch mode to filter
          }}
          className="px-4 py-2 bg-purple-500 text-white  rounded hover:bg-purple-600 "
        >
          {showFilter ? "Hide Filter" : "Show Filter"}
        </button>
      </div>

      {mode === "tabs" && (
        <MovieTabs onSelectMovie={(movie) => setSelectedMovies(movie)} />
      )}

      {showFilter && (
        <FilterBar onFilter={handleFilter} onClear={handleClearFilter} />
      )}

      {["search", "filter", "trending"].includes(mode) && (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">
            {mode === "search"
              ? "🔍 Search Results"
              : mode === "filter"
                ? "🎯 Filtered Movies"
                : "🎬 Trending Movies"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovies(movie)}
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
                {currentPage > 4 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
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
        </>
      )}

      {selectedMovies && (
        <MovieModal
          onClose={() => setSelectedMovies(null)}
          movie={selectedMovies}
        />
      )}
    </div>
  );
}

export default App;
