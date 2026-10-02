import "../App.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../Helpers/firebase";
import { useApp } from "../Helpers/StateContext";
import { pickTrailerUrl, useTmdb } from "../Helpers/tmdb";
import Poster from "./Poster";
import NotFound from "../Pages/NotFound";

const VIDEO_LANGUAGES = "en,hi,es,de,ja,null";

function MoviePage() {
  const { mediaType, id } = useParams();
  const { user, showAlert } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isValid =
    (mediaType === "movie" || mediaType === "tv") && /^\d+$/.test(id || "");

  // Works for both movies and TV shows, and for direct links / refreshes.
  const { data, loading, error } = useTmdb(
    isValid ? `/${mediaType}/${id}` : null,
    { append_to_response: "videos", include_video_language: VIDEO_LANGUAGES }
  );

  const uid = user ? user.uid : null;
  const docId = uid ? `${uid}_${mediaType}_${id}` : null;
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  // Is this title already on the signed-in user's watchlist?
  useEffect(() => {
    setLiked(false);
    if (!docId || !db) return undefined;
    let cancelled = false;
    getDoc(doc(db, "movies", docId))
      .then((snapshot) => {
        if (!cancelled) setLiked(snapshot.exists());
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, [docId]);

  if (!isValid) return <NotFound />;
  if (loading) {
    return <div className="container text-center my-5">Loading…</div>;
  }
  if (error || !data) {
    return (
      <div className="container text-center my-5">
        Couldn't load this title. Please try again later.
      </div>
    );
  }

  const title = data.title || data.name || "Untitled";
  const date = data.release_date || data.first_air_date || "";
  const year = date.slice(0, 4);
  const genres = (data.genres || []).map((g) => g.name.toUpperCase()).join(", ");
  const trailerUrl = pickTrailerUrl(data.videos);
  const score =
    typeof data.vote_average === "number" && data.vote_average > 0
      ? data.vote_average.toFixed(1)
      : "N/A";
  let length = "";
  if (mediaType === "movie" && data.runtime) {
    length = `${data.runtime} min`;
  } else if (mediaType === "tv" && data.number_of_seasons) {
    length = `${data.number_of_seasons} season${data.number_of_seasons === 1 ? "" : "s"}`;
  }

  const handleLike = async () => {
    if (!user || !db) {
      showAlert("Please log in to use your watchlist", "warning");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (busy) return;
    setBusy(true);
    const ref = doc(db, "movies", docId);
    try {
      if (liked) {
        await deleteDoc(ref);
        setLiked(false);
        showAlert("Removed from your watchlist", "primary");
      } else {
        await setDoc(ref, {
          uid,
          tmdbId: Number(id),
          mediaType,
          title,
          poster_path: data.poster_path || null,
          createdAt: serverTimestamp(),
        });
        setLiked(true);
        showAlert("Added to your watchlist", "success");
      }
    } catch (err) {
      console.error(err);
      showAlert("Couldn't update your watchlist. Please try again.", "danger");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="MPContainer container">
      <div style={{ display: "flex", flexDirection: "column", width: "70%", padding: "1vh", height: "max-content" }}>
        <h1 className="MPHeading moviename" style={{ color: "black" }}>
          {title}
        </h1>

        <div className="container" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: "1vh" }}>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "4.5vh" }}>
            <span style={{ fontWeight: "bold" }}>★ {score}</span>
            <span style={{ marginLeft: "1vh" }}>TMDB score</span>
          </div>
          {year && (
            <div style={{ display: "flex", marginLeft: "2.5vw", fontWeight: "bold" }}>{year}</div>
          )}
          {length && <div style={{ display: "flex", marginLeft: "2.5vw" }}>{length}</div>}
          {genres && (
            <div style={{ display: "flex", marginLeft: "2.5vw", color: "red" }}>{genres}</div>
          )}
          <button
            type="button"
            onClick={handleLike}
            disabled={busy}
            aria-pressed={liked}
            aria-label={liked ? "Remove from watchlist" : "Add to watchlist"}
            title={liked ? "Remove from watchlist" : "Add to watchlist"}
            style={{ background: "none", border: "none", padding: 0, marginLeft: "2.5vw", display: "flex" }}
          >
            <FavoriteIcon style={{ color: liked ? "red" : "grey", cursor: "pointer" }} />
          </button>
        </div>
        <div className="container" style={{ color: "black", display: "flex", alignItems: "center", marginTop: "2vh", padding: "2.5vw" }}>
          <p>{data.overview || "No description available."}</p>
        </div>
        <div className="container" style={{ display: "flex", alignItems: "center", paddingLeft: "2.5vw" }}>
          {trailerUrl ? (
            <a
              style={{ color: "black", display: "flex", alignItems: "center", textDecoration: "none" }}
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlayCircleFilledWhiteOutlinedIcon style={{ fontSize: "3rem", cursor: "pointer" }} />
              <span style={{ color: "black" }} className="watchthetrailer">
                WATCH THE TRAILER
              </span>
            </a>
          ) : (
            <span style={{ color: "grey" }}>No trailer available</span>
          )}
        </div>
      </div>
      <div>
        <Poster
          path={data.poster_path}
          title={title}
          size="w500"
          style={{ width: "100%", maxWidth: "300px", height: "auto" }}
        />
      </div>
    </div>
  );
}

export default MoviePage;
