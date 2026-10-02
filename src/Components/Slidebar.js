import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Slideblock from "./Slideblock";
import { normalizeResults, useTmdb } from "../Helpers/tmdb";
import "../App.css";

const AUTO_SCROLL_MS = 4000;

function Slidebar({ title, path, params, mediaType }) {
  const { data, loading, error } = useTmdb(path, params);
  const items = useMemo(
    () => normalizeResults(data, mediaType).slice(0, 10),
    [data, mediaType]
  );
  const rowRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const scrollRow = useCallback((direction) => {
    const row = rowRef.current;
    if (!row || typeof row.scrollBy !== "function") return;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
    if (direction > 0 && atEnd) {
      row.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      row.scrollBy({ left: direction * row.clientWidth * 0.9, behavior: "smooth" });
    }
  }, []);

  // Gentle auto-advance; pauses on hover/focus and for reduced-motion users.
  useEffect(() => {
    if (paused || items.length === 0) return undefined;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }
    const timer = setInterval(() => scrollRow(1), AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [paused, items.length, scrollRow]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
      className="container"
    >
      <div className="headings">{title}</div>
      <div
        className="rowContainer container my-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {loading && <div className="p-4">Loading…</div>}
        {error && (
          <div className="p-4 text-danger">
            Couldn't load this list. Please try again later.
          </div>
        )}
        {items.length > 0 && (
          <>
            <button
              type="button"
              className="carouselArrow left"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollRow(-1)}
            >
              <ChevronLeftIcon />
            </button>
            <div ref={rowRef} className="movieRow">
              {items.map((item) => (
                <Slideblock key={`${item.mediaType}-${item.id}`} item={item} />
              ))}
            </div>
            <button
              type="button"
              className="carouselArrow right"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollRow(1)}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Slidebar;
