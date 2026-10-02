import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Poster from "./Poster";

function OtherMovieBlocks({ item }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "20rem",
        margin: "1rem",
        width: "13vw",
        minWidth: "140px",
        marginRight: "5vh",
        marginTop: "5vh",
      }}
    >
      <Link
        to={`/title/${item.mediaType}/${item.id}`}
        style={{ display: "block", height: "100%", width: "100%" }}
      >
        <Poster
          path={item.posterPath}
          title={item.title}
          style={{ height: "100%", width: "100%" }}
        />
      </Link>
      <div style={{ display: "flex", flexDirection: "row", marginTop: "1vh", color: "white" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p className="genres">{item.title}</p>
          {item.year && <p className="genres">{item.year}</p>}
        </div>
      </div>
    </div>
  );
}

export default OtherMovieBlocks;
