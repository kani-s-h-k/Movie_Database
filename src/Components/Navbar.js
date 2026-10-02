import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "../App.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LogoutIcon from "@mui/icons-material/Logout";
import { useApp } from "../Helpers/StateContext";
import { auth } from "../Helpers/firebase";
import { friendlyAuthError } from "../Helpers/authErrors";
import { Items } from "../Helpers/NavItems";

const whiteText = { color: "white" };

function Navbar({ bg }) {
  const { user, showAlert } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef(null);

  // Close the mobile menu after navigating.
  useEffect(() => {
    const collapse = document.getElementById("navbarNavDropdown");
    if (collapse) collapse.classList.remove("show");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (showSearch && searchInput.current) searchInput.current.focus();
  }, [showSearch]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showAlert("Log Out Successful", "primary");
      navigate("/");
    } catch (err) {
      console.error(err);
      showAlert(friendlyAuthError(err), "danger");
    }
  };

  return (
    <div style={{ zIndex: "10" }}>
      <nav
        className={`navbar navbar-dark navbar-expand-lg bg-${bg}${
          bg === "transparent" ? " container" : ""
        }`}
        style={{ height: "17vh" }}
      >
        <div className="container-fluid">
          <Link
            className="navbar-brand websitename"
            to="/"
            style={{ fontSize: "2.5rem" }}
          >
            FxRcs
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav mx-auto titlecontainer">
              {Items.map((element) => {
                if (element.dropdown) {
                  return (
                    <li key={element.title} className="nav-item dropdown navTitles">
                      <button
                        type="button"
                        className="nav-link"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={whiteText}
                      >
                        {element.title}{" "}
                        <KeyboardArrowDownIcon style={{ fontSize: "small" }} />
                      </button>
                      <ul className="myDropdown dropdown-menu navbar-dark">
                        {element.dropdown.map((item) => (
                          <li key={item.to}>
                            <Link className="dropdownItems dropdown-item" to={item.to}>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={element.title} className="nav-item navTitles">
                    {element.to ? (
                      <Link className="nav-link" to={element.to} style={whiteText}>
                        {element.title}
                      </Link>
                    ) : (
                      <a
                        className="nav-link"
                        href={element.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={whiteText}
                      >
                        {element.title}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul className="navbar-nav me-auto" style={whiteText}>
              <li className="nav-item navTitles">
                <Link
                  className="nav-link"
                  to="/watchlist"
                  aria-label="Watchlist"
                  title="Watchlist"
                  style={whiteText}
                >
                  <ShoppingCartOutlinedIcon />
                </Link>
              </li>
              <li className="nav-item navTitles">
                {!showSearch ? (
                  <button
                    type="button"
                    className="nav-link"
                    aria-label="Open search"
                    onClick={() => setShowSearch(true)}
                    style={whiteText}
                  >
                    <SearchIcon />
                  </button>
                ) : (
                  <form
                    onSubmit={handleSearchSubmit}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      id="search-input"
                      ref={searchInput}
                      type="search"
                      className="form-control rounded"
                      style={{ marginRight: "0.5vw" }}
                      placeholder="Search"
                      aria-label="Search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="nav-link"
                      aria-label="Search"
                      style={{ ...whiteText, padding: 0 }}
                    >
                      <SearchIcon />
                    </button>
                  </form>
                )}
              </li>
              <li className="nav-item navTitles">
                {!user ? (
                  <Link className="nav-link" to="/login" aria-label="Log in" title="Log in" style={whiteText}>
                    <PersonOutlineIcon />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="nav-link"
                    onClick={handleLogout}
                    title="Log out"
                    aria-label="Log out"
                    style={{ ...whiteText, display: "flex", alignItems: "center" }}
                  >
                    <LogoutIcon style={{ marginRight: "0.5vw" }} />
                    <span>{user.displayName || user.email}</span>
                  </button>
                )}
              </li>
            </ul>
            <ul className="navbar-nav socialmediacontainer" style={whiteText}>
              <li className="socialmediaicons">
                <InstagramIcon style={{ fontSize: "17px", cursor: "pointer" }} />
              </li>
              <li className="socialmediaicons">
                <TwitterIcon style={{ fontSize: "17px", cursor: "pointer" }} />
              </li>
              <li className="socialmediaicons">
                <LinkedInIcon style={{ fontSize: "17px", cursor: "pointer" }} />
              </li>
              <li className="socialmediaicons">
                <PinterestIcon style={{ fontSize: "17px", cursor: "pointer" }} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
