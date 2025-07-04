const API_KEY = '7d25d55114f64601478df6713afa80ed';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTrendingMovies = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data;
};

export const searchMovies = async (query, page = 1) => {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
    const data = await res.json();
    return data;
}

export const getMovieVideos = async (movieId) => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results.find(video => video.site === "YouTube" && video.type === "Trailer");
};

export const fetchGenres = async () => {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();
    return data.genres;
};

export const fetchMoviesByGenreOrYear = async (genreId, year, page = 1) => {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&primary_release_year=${year}&page=${page}`);
    const data = await res.json();
    return data;
};

export const fetchMoviesReviews = async (movieId) => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${API_KEY}`);
    const data = await res.json();
    return data;
}

export const fetchNowPlayingMovies = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`);
    return await res.json();
}

export const fetchUpcomingMovies = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
    return await res.json();
}

export const fetchTopRatedMovies = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
    return await res.json();
}

export const fetchMovieCredits = async (movieId) => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    return res.json();
}

export async function fetchMovieDetails(movieId: number) {
    const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    return await res.json();
}