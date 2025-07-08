import { useEffect, useState } from "react";
import { fetchGenres } from "../api/api.ts";

type FilterBarProps = {
  onFilter: (genreId: string, year: string) => void;
  onClear?: () => void;
  resetSignal?: boolean;
};

export default function FilterBar({
  onFilter,
  onClear,
  resetSignal,
}: FilterBarProps) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const loadGenres = async () => {
      const data = await fetchGenres();
      setGenres(data);
    };
    loadGenres();
  }, []);

  // Trigger onFilter automatically when genre or year changes
  useEffect(() => {
    const delay = setTimeout(() => {
      onFilter(selectedGenre, year);
    }, 300); // debounce 300ms

    return () => clearTimeout(delay);
  }, [selectedGenre, year]);

  const handleClear = () => {
    setSelectedGenre("");
    setYear("");
    onClear?.();
  };

  useEffect(() => {
    if (resetSignal) {
      setSelectedGenre("");
      setYear("");
    }
  }, [resetSignal]);

  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-center">
      <select
        onChange={(e) => setSelectedGenre(e.target.value)}
        value={selectedGenre}
        className="p-2 border rounded-md"
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Year"
        className="p-2 border rounded-md"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      {(selectedGenre || year) && (
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Clear
        </button>
      )}
    </div>
  );
}
