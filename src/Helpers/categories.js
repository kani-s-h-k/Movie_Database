// Browsable lists reachable from the navbar: /browse/:category
export const CATEGORIES = {
  latest: {
    eyebrow: "NOW PLAYING",
    heading: "Latest Released",
    mediaType: "movie",
    path: "/movie/now_playing",
  },
  hollywood: {
    eyebrow: "MOVIES",
    heading: "Hollywood",
    mediaType: "movie",
    path: "/discover/movie",
    params: { with_original_language: "en", sort_by: "popularity.desc" },
  },
  bollywood: {
    eyebrow: "MOVIES",
    heading: "Bollywood",
    mediaType: "movie",
    path: "/discover/movie",
    params: { with_original_language: "hi", sort_by: "popularity.desc" },
  },
  anime: {
    eyebrow: "MOVIES",
    heading: "Anime",
    mediaType: "movie",
    path: "/discover/movie",
    params: {
      with_genres: 16,
      with_original_language: "ja",
      sort_by: "popularity.desc",
    },
  },
  "top-rated": {
    eyebrow: "MOVIES",
    heading: "Top Rated",
    mediaType: "movie",
    path: "/movie/top_rated",
  },
  "tv-popular": {
    eyebrow: "TV SHOWS",
    heading: "Popular",
    mediaType: "tv",
    path: "/tv/popular",
  },
  "tv-airing-today": {
    eyebrow: "TV SHOWS",
    heading: "Airing Today",
    mediaType: "tv",
    path: "/tv/airing_today",
  },
  "tv-on-the-air": {
    eyebrow: "TV SHOWS",
    heading: "On TV",
    mediaType: "tv",
    path: "/tv/on_the_air",
  },
  "tv-top-rated": {
    eyebrow: "TV SHOWS",
    heading: "Top Rated",
    mediaType: "tv",
    path: "/tv/top_rated",
  },
};

// Web series = TV shows filtered by original language: /web-series/:language
export const WEB_SERIES_LANGUAGES = {
  hi: "Hindi",
  en: "English",
  es: "Spanish",
  de: "German",
};
