import React, { useEffect, useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Navbar from "../Components/Navbar";
import TopMovieDetails from "../Components/TopMovieDetails";
import Slidebar from "../Components/Slidebar";
import OtherMovie from "../Components/OtherMovie";
import Footer from "../Components/Footer";
import { Moviedetails } from "../Helpers/TopBgMoviesDetails";
import { normalizeResults, pickTrailerUrl, useTmdb } from "../Helpers/tmdb";

const HERO_INTERVAL_MS = 8000;

function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [moreRequested, setMoreRequested] = useState(false);

  // Rotate the hero. The timer lives in an effect so it is created once and
  // cleaned up properly (it used to be re-created on every render).
  useEffect(() => {
    const timer = setInterval(
      () => setHeroIndex((i) => (i + 1) % Moviedetails.length),
      HERO_INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, []);

  const hero = Moviedetails[heroIndex];
  const { data: heroVideos } = useTmdb(`/movie/${hero.id}/videos`);
  const trailerUrl = useMemo(() => pickTrailerUrl(heroVideos), [heroVideos]);

  const more = useTmdb(moreRequested ? "/trending/movie/week" : null);
  const moreItems = useMemo(() => normalizeResults(more.data, "movie"), [more.data]);

  return (
    <div className="App">
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${hero.imageLink})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          zIndex: 0,
        }}
      >
        <Navbar bg="transparent" />
        <TopMovieDetails
          movie={hero.name}
          synopsis={hero.synopsis}
          rating={hero.rating}
          yearReleased={hero.yearReleased}
          genre={hero.genre}
          trailerUrl={trailerUrl}
          movieId={hero.id}
        />
      </div>

      <Slidebar title="Trending Movies & TV Shows" path="/trending/all/day" />
      <Slidebar title="Top Rated" path="/movie/top_rated" mediaType="movie" />
      <Slidebar title="Popular Movies" path="/movie/popular" mediaType="movie" />

      {showMore && (
        <OtherMovie
          eyebrow="ONLINE STREAMING"
          heading="Movies"
          items={moreItems.slice(0, 10)}
          loading={more.loading}
          error={more.error}
        />
      )}
      <div className="text-center">
        <button
          onClick={() => {
            setMoreRequested(true);
            setShowMore(!showMore);
          }}
          type="button"
          className="btn btn-light m-5 px-3"
          style={{ border: "1px solid black" }}
        >
          {showMore ? "Less" : "More"}{" "}
          <KeyboardArrowDownIcon style={{ fontSize: "small" }} />
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
