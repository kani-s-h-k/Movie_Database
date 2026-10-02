import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import OtherMovie from "../Components/OtherMovie";
import { normalizeResults, useTmdb } from "../Helpers/tmdb";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const { data, loading, error } = useTmdb(q ? "/search/multi" : null, {
    query: q,
    include_adult: false,
  });
  const items = useMemo(() => normalizeResults(data), [data]);

  return (
    <OtherMovie
      eyebrow={q ? `Results for : ${q}` : "SEARCH"}
      items={items}
      loading={loading}
      error={error}
      emptyText={
        q ? `No results found for "${q}".` : "Type something in the search box to get started."
      }
    />
  );
}

export default SearchPage;
