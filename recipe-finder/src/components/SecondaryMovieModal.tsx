import MovieModal from "./MovieModal.tsx";
import {useEffect, useState} from "react";

export default function SecondaryMovieModal({ movie, onClose}) {
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        setShowModal(true);
    }, [movie]);

    const handleClose = () => {
        setShowModal(false);
        onClose();
    }

    if (!showModal || !movie) return null;

    return (
        <MovieModal movie={movie} onClose={handleClose} />
    )
}