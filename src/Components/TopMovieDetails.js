import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";

function TopMovieDetails({ movie, synopsis, rating, yearReleased, genre, trailerUrl, movieId }) {
  const genreText = Array.isArray(genre) ? genre.join(", ") : genre;
  const linkStyle = {
    display: "flex",
    flexDirection: "row",
    marginLeft: "5vh",
    color: "white",
    alignItems: "center",
    textDecoration: "none",
    width: "max-content",
  };
  const content = (
    <>
      <PlayCircleFilledWhiteOutlinedIcon style={{ fontSize: "3rem" }} />
      <span className="watchthetrailer">WATCH THE TRAILER</span>
    </>
  );

  return (
    <div className="topContent container">
      <h4 style={{ color: "white", marginLeft: "5vh" }}>{yearReleased}</h4>
      <div className="genreRatingContainer">
        <div className="genrecontainer">
          <h3 className="gerneANDratingheading">GENRE</h3>
          <p className="genres">{genreText}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p className="rating">
            {rating} <span className="gerneANDratingheading">RATING</span>{" "}
          </p>
        </div>
      </div>
      <h1 className="moviename">{movie}</h1>
      <div className="moviesummary">{synopsis}</div>
      {trailerUrl ? (
        <a href={trailerUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          {content}
        </a>
      ) : (
        // No trailer found (or still loading): fall back to the details page.
        <Link to={`/title/movie/${movieId}`} style={linkStyle}>
          {content}
        </Link>
      )}
    </div>
  );
}

export default TopMovieDetails;
