import {useEffect, useState} from "react";
import {fetchPersonDetails, fetchPersonMovies} from "../api/api.ts";

export default function PersonModal({ personId, onClose}) {
    const [person, setPerson] =useState(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const load = async () => {
            const details = await fetchPersonDetails(personId);
            const credits = await fetchPersonMovies(personId);
            setPerson(details);
            setMovies(credits.cast.slice(0, 10));
        }
        load();
    }, [personId]);

    if (!person) return null;

    return (
        <div className={"fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-auto"}>
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
                <button onClick={onClose} className={"absolute top-4 right-4 text-red-600 font-bold"}>X</button>
                <div className={"flex flex-col md:flex-row gap-4"}>
                    <img
                        src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : "https://via.placeholder.com/185x278?text=No+Image"}
                        alt={person.name}
                        className="w-[150px] h-[225px] rounded object-cover"
                    />
                    <div>
                        <h2 className={"text-xl font-bold"}>{person.name}</h2>
                        <p className={"text-sm text-gray-600 mb-2"}>{person.known_for_department}</p>
                        <p className={"text-sm text-gray-700"}>{person.biography || "No. biography available."}</p>
                        {person.birthday && (
                            <p className={"mt-2 text-sm"}><strong>Born:</strong> {person.birthday}</p>
                        )}
                        {person.place_of_birth && (
                            <p className={"mt-2 text-sm"}><strong>Place:</strong> {person.place_of_birth}</p>
                        )}
                    </div>
                </div>
                <div className={"mt-6"}>
                    <h3 className={"font-semibold text-lg mb-2"}>Known For</h3>
                    <div className={"grid grid-cols-2 sm:grid-cols-3 gap-4"}>
                        {movies.map((movie) => (
                            <div key={movie.id}>
                                <img
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : "https://via.placeholder.com/185x278?text=No+Image"}
                                    className="w-[150px] h-[225px] rounded object-cover shrink-0"
                                />
                                <p className={"text-sm mt-1 text-center"}>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}