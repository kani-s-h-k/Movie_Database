import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Poster from "./Poster";
import { genreNames } from "../Helpers/tmdb";

function Slideblock({ item }) {
  return (
    <div className="slideblocks">
      <Link
        to={`/title/${item.mediaType}/${item.id}`}
        style={{ display: "block", height: "70%" }}
      >
        <Poster
          path={item.posterPath}
          title={item.title}
          style={{ height: "100%", width: "100%" }}
        />
      </Link>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5vh",
          textAlign: "center",
        }}
      >
        <p>{item.title}</p>
        <p className="gerneANDratingheading">
          {genreNames(item.genreIds).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default Slideblock;
