import { useState, useEffect } from "react";

type SearchBarInput = {
  onSearch: (query: string) => void;
  onSelectMovie: (movie: any) => void;
  searchFunction: (query: string) => Promise<any>;
  onClear?: () => void;
  onLiveSearchResult?: (results: any[], query: string) => void;
};

export default function SearchBar({
  onSearch,
  onSelectMovie,
  searchFunction,
  onClear,
  onLiveSearchResult,
}: SearchBarInput) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length === 0) {
        setSuggestions([]);
        onLiveSearchResult?.([], "");
        return;
      }

      if (input.length < 2) {
        setSuggestions([]);
        return;
      }

      const result = await searchFunction(input);
      setSuggestions(result.results.slice(0, 10));
      onLiveSearchResult?.(result.results, input);
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [input, searchFunction]);

  const handleSelect = (movie: any) => {
    setInput("");
    setSuggestions([]);
    onLiveSearchResult?.([], "");
    onSelectMovie(movie);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
    setSuggestions([]);
    onLiveSearchResult?.([], input);
  };

  const handleClear = () => {
    setInput("");
    setSuggestions([]);
    onLiveSearchResult?.([], "");
    onClear?.();
  };

  return (
    <div className="mb-4 relative max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Search movies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 shadow-md max-h-60 overflow-y-auto">
            {suggestions.map((movie) => (
              <li
                key={movie.id}
                onClick={() => handleSelect(movie)}
                className="flex items-center gap-4 p-2 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "https://via.placeholder.com/92x138?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-[46px] h-[70px] object-cover rounded"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{movie.title}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
