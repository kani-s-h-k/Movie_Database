import "./App.css";
import React, { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Alert from "./Components/Alert";
import { Login } from "./Components/login";
import MoviePage from "./Components/MoviePage";
import WatchList from "./Components/WatchList";
import Home from "./Pages/Home";
import BrowsePage from "./Pages/BrowsePage";
import GenrePage from "./Pages/GenrePage";
import SearchPage from "./Pages/SearchPage";
import WebSeriesPage from "./Pages/WebSeriesPage";
import NotFound from "./Pages/NotFound";
import { AppProvider, useApp } from "./Helpers/StateContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AlertHost() {
  const { alert } = useApp();
  return alert ? <Alert alert={alert} /> : null;
}

// Every page except Home: dark navbar on top, footer at the bottom.
function PageLayout() {
  return (
    <>
      <Navbar bg="dark" />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <ScrollToTop />
      <AlertHost />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PageLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="title/:mediaType/:id" element={<MoviePage />} />
          <Route path="browse/:category" element={<BrowsePage />} />
          <Route path="genre/:genreId" element={<GenrePage />} />
          <Route path="web-series/:language" element={<WebSeriesPage />} />
          <Route path="watchlist" element={<WatchList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
