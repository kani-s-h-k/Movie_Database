import React from "react";
import "../App.css";
import OtherMovieBlocks from "./OtherMovieBlocks";

// Presentational grid of titles. Pages fetch the data and pass it in, so this
// component never makes network requests itself.
function OtherMovie({ eyebrow, heading, items = [], loading, error, emptyText }) {
  return (
    <div
      style={{
        backgroundColor: "rgb(17,17,17)",
        minHeight: "60vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2vh",
      }}
    >
      {eyebrow && (
        <h3 className="genres" style={{ color: "white", fontSize: "16px" }}>
          {eyebrow}
        </h3>
      )}
      {heading && (
        <h1
          className="moviename"
          style={{ color: "white", fontSize: "3rem", padding: 0, margin: "2vh", textAlign: "center" }}
        >
          {heading}
        </h1>
      )}
      <div
        style={{
          height: "max-content",
          width: "85%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "5vh",
          paddingBottom: "1rem",
        }}
      >
        {loading && <p style={{ color: "white" }}>Loading…</p>}
        {error && (
          <p style={{ color: "#ff6b6b" }}>
            Couldn't load titles. Please check your connection and try again.
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p style={{ color: "white" }}>{emptyText || "Nothing to show here yet."}</p>
        )}
        {items.map((item) => (
          <OtherMovieBlocks key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default OtherMovie;
