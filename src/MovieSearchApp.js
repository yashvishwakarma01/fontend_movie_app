import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://backend-movie-t802.onrender.com";

function MovieSearchApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/search-movies?query=${searchQuery}`);
      setMovies(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setMovies([]);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/movie-details/${imdbID}`);
      setSelectedMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie details:', err);
    }
  };

  const handleMovieClick = (imdbID) => {
    fetchMovieDetails(imdbID);
  };

  const handleCloseMovieDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="movie-search-container">
      <h1 className="app-title">Movie Search App</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search Movies"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="button" onClick={handleSearch}>Search</button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="movies-grid">
        {movies.map((movie) => (
          <div 
            key={movie.imdbID} 
            className="movie-card"
            onClick={() => handleMovieClick(movie.imdbID)}
          >
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie-poster.png'} 
              alt={movie.Title} 
              className="movie-poster"
            />
            <div className="movie-info">
              <h3 className="movie-title">{movie.Title}</h3>
              <p className="movie-year">{movie.Year}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="movie-modal-overlay" onClick={handleCloseMovieDetails}>
          <div 
            className="movie-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close-btn" 
              onClick={handleCloseMovieDetails}
            >
              &times;
            </button>
            <div className="movie-details-container">
              <div className="movie-details-poster">
                <img 
                  src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : '/placeholder-movie-poster.png'}
                  alt={selectedMovie.Title} 
                />
              </div>
              <div className="movie-details-info">
                <h2>{selectedMovie.Title}</h2>
                <div className="movie-detail-section">
                  <strong>Plot:</strong>
                  <p>{selectedMovie.Plot}</p>
                </div>
                <div className="movie-detail-section">
                  <strong>Actors:</strong>
                  <p>{selectedMovie.Actors}</p>
                </div>
                <div className="movie-detail-section">
                  <strong>Director:</strong>
                  <p>{selectedMovie.Director}</p>
                </div>
                <div className="movie-detail-section">
                  <strong>Genre:</strong>
                  <p>{selectedMovie.Genre}</p>
                </div>
                <div className="movie-detail-section">
                  <strong>Release Year:</strong>
                  <p>{selectedMovie.Year}</p>
                </div>
                <div className="movie-detail-section">
                  <strong>Rating:</strong>
                  <p>{selectedMovie.imdbRating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearchApp;