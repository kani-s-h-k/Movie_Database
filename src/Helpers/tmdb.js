import { useEffect, useState } from "react";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// TMDB genre ids are stable, so they are kept locally. This lets every card show
// its real genres without an extra request per title.
export const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

export const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object, key);

export function posterUrl(path, size = "w342") {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

export async function tmdbFetch(path, params = {}, signal) {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TMDB API key is missing. Set REACT_APP_TMDB_API_KEY in your .env file."
    );
  }
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Fetches `path` from TMDB inside an effect (never during render).
 * Pass `null` as the path to skip the request. Results always belong to the
 * path/params they were requested for, so stale data is never shown after
 * navigating, and in-flight requests are cancelled on change/unmount.
 */
export function useTmdb(path, params) {
  const [result, setResult] = useState({ key: "", data: null, error: null });
  const paramsKey = JSON.stringify(params || {});
  const requestKey = path ? `${path}?${paramsKey}` : "";

  useEffect(() => {
    if (!path) return undefined;
    const controller = new AbortController();
    tmdbFetch(path, JSON.parse(paramsKey), controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, data, error: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({ key: requestKey, data: null, error });
        }
      });
    return () => controller.abort();
  }, [path, paramsKey, requestKey]);

  if (!path) return { data: null, loading: false, error: null };
  if (result.key !== requestKey) return { data: null, loading: true, error: null };
  return { data: result.data, loading: false, error: result.error };
}

/** Turns a raw TMDB movie / TV / multi-search result into one common shape. */
export function normalizeItem(item, fallbackType) {
  const mediaType =
    item.media_type ||
    fallbackType ||
    (item.name && !item.title ? "tv" : "movie");
  const date = item.release_date || item.first_air_date || "";
  return {
    id: item.id,
    mediaType,
    title: item.title || item.name || "Untitled",
    posterPath: item.poster_path || null,
    year: date ? date.slice(0, 4) : "",
    genreIds: item.genre_ids || [],
  };
}

/** Normalises a TMDB list response, dropping people and malformed entries. */
export function normalizeResults(data, fallbackType) {
  if (!data || !Array.isArray(data.results)) return [];
  return data.results
    .filter(
      (item) =>
        item &&
        item.id !== undefined &&
        (!item.media_type ||
          item.media_type === "movie" ||
          item.media_type === "tv")
    )
    .map((item) => normalizeItem(item, fallbackType));
}

export function genreNames(ids, limit = 3) {
  return (ids || [])
    .map((id) => GENRES[id])
    .filter(Boolean)
    .slice(0, limit)
    .join(", ");
}

/** Picks the best YouTube trailer from a TMDB `videos` payload. */
export function pickTrailerUrl(videos) {
  const list = (videos && videos.results) || [];
  const youtube = list.filter((v) => v.site === "YouTube" && v.key);
  const best =
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0];
  return best ? `https://www.youtube.com/watch?v=${best.key}` : null;
}
