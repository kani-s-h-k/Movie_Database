import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import OtherMovie from "../Components/OtherMovie";
import NotFound from "./NotFound";
import { WEB_SERIES_LANGUAGES } from "../Helpers/categories";
import { hasOwn, normalizeResults, useTmdb } from "../Helpers/tmdb";

function WebSeriesPage() {
  const { language } = useParams();
  const valid = hasOwn(WEB_SERIES_LANGUAGES, language);
  const { data, loading, error } = useTmdb(valid ? "/discover/tv" : null, {
    with_original_language: language,
    sort_by: "popularity.desc",
  });
  const items = useMemo(() => normalizeResults(data, "tv"), [data]);

  if (!valid) return <NotFound />;
  return (
    <OtherMovie
      eyebrow="WEB SERIES"
      heading={WEB_SERIES_LANGUAGES[language]}
      items={items}
      loading={loading}
      error={error}
    />
  );
}

export default WebSeriesPage;
