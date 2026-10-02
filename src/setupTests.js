// jest-dom adds custom matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Tests never hit the real TMDB API, but the data layer requires a key.
process.env.REACT_APP_TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'test-key';
