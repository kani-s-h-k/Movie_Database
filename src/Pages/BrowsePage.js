import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import OtherMovie from "../Components/OtherMovie";
import NotFound from "./NotFound";
import { CATEGORIES } from "../Helpers/categories";
import { hasOwn, normalizeResults, useTmdb } from "../Helpers/tmdb";

function BrowsePage() {
  const { category } = useParams();
  const config = hasOwn(CATEGORIES, category) ? CATEGORIES[category] : null;
  const { data, loading, error } = useTmdb(
    config ? config.path : null,
    config ? config.params : undefined
  );
  const items = useMemo(
    () => normalizeResults(data, config ? config.mediaType : undefined),
    [data, config]
  );

  if (!config) return <NotFound />;
  return (
    <OtherMovie
      eyebrow={config.eyebrow}
      heading={config.heading}
      items={items}
      loading={loading}
      error={error}
    />
  );
}

export default BrowsePage;
