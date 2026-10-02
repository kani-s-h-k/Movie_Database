import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="container text-center"
      style={{ minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
    >
      <h1>Page not found</h1>
      <p>We couldn't find what you were looking for.</p>
      <Link to="/" className="btn btn-dark">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
