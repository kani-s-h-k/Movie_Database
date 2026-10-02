import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import OtherMovie from "../Components/OtherMovie";
import NotFound from "./NotFound";
import { GENRES, hasOwn, normalizeResults, useTmdb } from "../Helpers/tmdb";

function GenrePage() {
  const { genreId } = useParams();
  const valid = /^\d+$/.test(genreId || "") && hasOwn(GENRES, genreId);
  const { data, loading, error } = useTmdb(valid ? "/discover/movie" : null, {
    with_genres: genreId,
    sort_by: "popularity.desc",
  });
  const items = useMemo(() => normalizeResults(data, "movie"), [data]);

  if (!valid) return <NotFound />;
  return (
    <OtherMovie
      eyebrow="GENRE"
      heading={GENRES[genreId]}
      items={items}
      loading={loading}
      error={error}
    />
  );
}

export default GenrePage;
