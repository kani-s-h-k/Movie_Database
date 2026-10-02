import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Helpers/firebase";
import { useApp } from "../Helpers/StateContext";
import OtherMovie from "./OtherMovie";

const messageStyle = {
  minHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

function WatchList() {
  const { user, authReady } = useApp();
  const uid = user ? user.uid : null;
  const [result, setResult] = useState({ uid: null, docs: [], error: null });

  useEffect(() => {
    if (!uid || !db) return undefined;
    let cancelled = false;
    // Only this user's titles; matches the rules in firestore.rules.
    getDocs(query(collection(db, "movies"), where("uid", "==", uid)))
      .then((snapshot) => {
        if (!cancelled) {
          setResult({ uid, docs: snapshot.docs.map((d) => d.data()), error: null });
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setResult({ uid, docs: [], error: err });
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const items = useMemo(
    () =>
      result.docs
        .filter((d) => typeof d.tmdbId === "number" && d.mediaType)
        .sort(
          (a, b) =>
            (b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0) -
            (a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0)
        )
        .map((d) => ({
          id: d.tmdbId,
          mediaType: d.mediaType,
          title: d.title || "Untitled",
          posterPath: d.poster_path || null,
          year: "",
          genreIds: [],
        })),
    [result.docs]
  );

  if (!authReady) return <div style={messageStyle}>Loading…</div>;

  if (!user) {
    return (
      <div style={messageStyle}>
        <h2>Your Watchlist</h2>
        <p>Log in to save titles and see them here.</p>
        <Link to="/login" state={{ from: "/watchlist" }} className="btn btn-dark">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <OtherMovie
      eyebrow="SAVED BY YOU"
      heading="Your Watchlist"
      items={items}
      loading={result.uid !== uid}
      error={result.uid === uid ? result.error : null}
      emptyText="Your watchlist is empty. Open a title and tap the heart to save it."
    />
  );
}

export default WatchList;
