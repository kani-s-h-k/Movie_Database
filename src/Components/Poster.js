import React from "react";
import { posterUrl } from "../Helpers/tmdb";

// Shows a TMDB poster, or a text placeholder when the title has no poster.
function Poster({ path, title, size = "w342", style }) {
  const src = posterUrl(path, size);
  if (!src) {
    return (
      <div
        className="posterPlaceholder"
        style={style}
        role="img"
        aria-label={title}
      >
        No poster available
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      style={{ objectFit: "cover", ...style }}
    />
  );
}

export default Poster;
