import React from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import App from "./App";

// Firebase is mocked: tests must never talk to a real project.
jest.mock("./Helpers/firebase", () => ({
  __esModule: true,
  auth: {},
  db: {},
  googleProvider: {},
}));
jest.mock("firebase/auth", () => ({
  __esModule: true,
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  __esModule: true,
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

const poster = (n) => `/poster${n}.jpg`;

// Fake TMDB responses keyed by URL path.
const RESPONSES = {
  "/trending/all/day": {
    results: [
      { id: 1, media_type: "movie", title: "Trending Movie", poster_path: poster(1), genre_ids: [28, 12] },
      { id: 2, media_type: "tv", name: "Trending Show", poster_path: poster(2), genre_ids: [18] },
      { id: 3, media_type: "person", name: "Some Person" },
    ],
  },
  "/movie/top_rated": {
    results: [{ id: 4, title: "Top Movie", poster_path: poster(4), genre_ids: [80, 18] }],
  },
  "/movie/popular": {
    results: [{ id: 5, title: "Popular Movie", poster_path: poster(5), genre_ids: [35] }],
  },
  "/trending/movie/week": {
    results: [{ id: 6, title: "Weekly Movie", poster_path: poster(6), release_date: "2024-03-01" }],
  },
  "/tv/top_rated": {
    results: [{ id: 7, name: "Best Show", poster_path: poster(7), first_air_date: "2010-05-05" }],
  },
  "/search/multi": {
    results: [
      { id: 8, media_type: "movie", title: "Dune", poster_path: poster(8), release_date: "2021-09-15" },
      { id: 9, media_type: "person", name: "Dune Actor" },
      { id: 10, media_type: "tv", name: "Dune Prophecy", first_air_date: "2024-11-17" },
    ],
  },
  "/discover/movie": {
    results: [{ id: 11, title: "Discovered Movie", poster_path: poster(11), release_date: "2020-01-01" }],
  },
  "/discover/tv": {
    results: [{ id: 12, name: "Discovered Series", poster_path: poster(12), first_air_date: "2019-01-01" }],
  },
  "/tv/1399": {
    id: 1399,
    name: "Game of Thrones",
    first_air_date: "2011-04-17",
    overview: "Nine noble families fight for control.",
    poster_path: poster(13),
    vote_average: 8.4,
    number_of_seasons: 8,
    genres: [{ id: 18, name: "Drama" }, { id: 10765, name: "Sci-Fi & Fantasy" }],
    videos: {
      results: [
        { site: "Vimeo", key: "nope", type: "Trailer" },
        { site: "YouTube", key: "ytKey123", type: "Trailer", official: true },
      ],
    },
  },
  "/movie/550": {
    id: 550,
    title: "Fight Club",
    release_date: "1999-10-15",
    overview: "An insomniac office worker.",
    poster_path: poster(14),
    vote_average: 8.4,
    runtime: 139,
    genres: [{ id: 18, name: "Drama" }],
    videos: { results: [] },
  },
};
const HERO_VIDEOS = { results: [{ site: "YouTube", key: "heroKey", type: "Trailer", official: true }] };

// TMDB URLs look like https://api.themoviedb.org/3/<path>; keep just <path>.
const apiPath = (url) => new URL(url).pathname.replace(/^\/3/, "");

function mockFetch() {
  global.fetch = jest.fn((url) => {
    const pathname = apiPath(url);
    let body = RESPONSES[pathname];
    if (!body && /^\/movie\/\d+\/videos$/.test(pathname)) body = HERO_VIDEOS;
    if (!body) {
      return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
  });
}

const callsTo = (pathname) =>
  global.fetch.mock.calls.filter(([url]) => apiPath(url) === pathname);

let currentUser = null;

function renderAt(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.scrollTo = jest.fn();
  currentUser = null;
  mockFetch();
  // CRA resets mocks between tests, so implementations are set here.
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback(currentUser);
    return () => {};
  });
  collection.mockImplementation((db, name) => ({ name }));
  doc.mockImplementation((db, name, id) => ({ name, id }));
  query.mockImplementation((...args) => args);
  where.mockImplementation((...args) => args);
  require("firebase/firestore").serverTimestamp.mockReturnValue("SERVER_TIME");
  getDoc.mockResolvedValue({ exists: () => false });
  getDocs.mockResolvedValue({ docs: [] });
  setDoc.mockResolvedValue(undefined);
  deleteDoc.mockResolvedValue(undefined);
});

describe("Home page", () => {
  test("renders each carousel from its own request, skips people, shows real genres", async () => {
    renderAt("/");
    expect(await screen.findByText("Trending Movie")).toBeInTheDocument();
    expect(screen.getByText("Trending Show")).toBeInTheDocument();
    expect(screen.queryByText("Some Person")).not.toBeInTheDocument();
    expect(screen.getByText("Top Movie")).toBeInTheDocument();
    expect(screen.getByText("Popular Movie")).toBeInTheDocument();
    // Genres come from the data, not a hardcoded string.
    expect(screen.getByText("ACTION, ADVENTURE")).toBeInTheDocument();
    expect(screen.getByText("CRIME, DRAMA")).toBeInTheDocument();
    expect(screen.queryByText("CRIME,DRAMA,THRILLER")).not.toBeInTheDocument();
  });

  test("never re-fetches in a loop (regression: fetching during render)", async () => {
    renderAt("/");
    await screen.findByText("Trending Movie");
    await waitFor(() => expect(callsTo("/trending/all/day")).toHaveLength(1));
    const before = global.fetch.mock.calls.length;
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });
    expect(global.fetch.mock.calls.length).toBe(before);
    expect(callsTo("/movie/top_rated")).toHaveLength(1);
    expect(callsTo("/movie/popular")).toHaveLength(1);
    // Popular is the movie endpoint with a correct query string.
    expect(global.fetch.mock.calls.map(([u]) => u).join("\n")).not.toContain("page=1page=1");
  });

  test("all requests use https", async () => {
    renderAt("/");
    await screen.findByText("Trending Movie");
    global.fetch.mock.calls.forEach(([url]) => expect(url.startsWith("https://")).toBe(true));
  });

  test("hero trailer button links to the real YouTube trailer", async () => {
    renderAt("/");
    // Starts as a link to the details page, then becomes the YouTube link once loaded.
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /watch the trailer/i })).toHaveAttribute(
        "href",
        "https://www.youtube.com/watch?v=heroKey"
      )
    );
    expect(screen.getByRole("link", { name: /watch the trailer/i })).toHaveAttribute("target", "_blank");
  });

  test("More/Less toggles the extra grid", async () => {
    renderAt("/");
    await screen.findByText("Trending Movie");
    expect(screen.queryByText("Weekly Movie")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /more/i }));
    expect(await screen.findByText("Weekly Movie")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /less/i }));
    expect(screen.queryByText("Weekly Movie")).not.toBeInTheDocument();
  });
});

describe("Title page", () => {
  test("TV shows render without crashing (they have name/first_air_date, not title/release_date)", async () => {
    renderAt("/title/tv/1399");
    expect(await screen.findByRole("heading", { name: "Game of Thrones" })).toBeInTheDocument();
    expect(screen.getByText("2011")).toBeInTheDocument();
    expect(screen.getByText("DRAMA, SCI-FI & FANTASY")).toBeInTheDocument();
    expect(screen.getByText("8 seasons")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /watch the trailer/i })).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=ytKey123"
    );
    expect(callsTo("/tv/1399")[0][0]).toContain("append_to_response=videos");
  });

  test("movies render and a missing trailer is handled", async () => {
    renderAt("/title/movie/550");
    expect(await screen.findByRole("heading", { name: "Fight Club" })).toBeInTheDocument();
    expect(screen.getByText("139 min")).toBeInTheDocument();
    expect(screen.getByText("No trailer available")).toBeInTheDocument();
  });

  test("clicking a TV card on the home page opens its page", async () => {
    renderAt("/");
    const poster = await screen.findByAltText("Trending Show");
    expect(poster.closest("a")).toHaveAttribute("href", "/title/tv/2");
    expect(screen.getByAltText("Top Movie").closest("a")).toHaveAttribute("href", "/title/movie/4");
  });

  test("failed requests show a friendly message", async () => {
    renderAt("/title/movie/999999");
    expect(await screen.findByText(/couldn't load this title/i)).toBeInTheDocument();
  });

  test("invalid ids / media types show Not Found", () => {
    renderAt("/title/person/1");
    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining("/person/"), expect.anything());
  });

  test("liking while logged out sends the user to log in", async () => {
    renderAt("/title/movie/550");
    await userEvent.click(await screen.findByRole("button", { name: /add to watchlist/i }));
    expect(await screen.findByText("Please log in to use your watchlist")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
    expect(setDoc).not.toHaveBeenCalled();
  });

  test("liking while logged in saves one deterministic doc, and unliking removes it", async () => {
    currentUser = { uid: "u1", email: "a@b.com" };
    renderAt("/title/movie/550");
    const like = await screen.findByRole("button", { name: /add to watchlist/i });
    await userEvent.click(like);
    await waitFor(() => expect(setDoc).toHaveBeenCalledTimes(1));
    expect(setDoc.mock.calls[0][0]).toEqual({ name: "movies", id: "u1_movie_550" });
    expect(setDoc.mock.calls[0][1]).toEqual({
      uid: "u1",
      tmdbId: 550,
      mediaType: "movie",
      title: "Fight Club",
      poster_path: "/poster14.jpg",
      createdAt: "SERVER_TIME",
    });
    const unlike = await screen.findByRole("button", { name: /remove from watchlist/i });
    await userEvent.click(unlike);
    await waitFor(() => expect(deleteDoc).toHaveBeenCalledTimes(1));
    expect(deleteDoc.mock.calls[0][0]).toEqual({ name: "movies", id: "u1_movie_550" });
    expect(await screen.findByRole("button", { name: /add to watchlist/i })).toBeInTheDocument();
  });

  test("a title already saved shows as liked", async () => {
    currentUser = { uid: "u1", email: "a@b.com" };
    getDoc.mockResolvedValue({ exists: () => true });
    renderAt("/title/movie/550");
    expect(await screen.findByRole("button", { name: /remove from watchlist/i })).toBeInTheDocument();
  });
});

describe("Browse, genre, web series and search", () => {
  test("TV Top Rated uses the TV endpoint and shows TV names", async () => {
    renderAt("/browse/tv-top-rated");
    expect(await screen.findByText("Best Show")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Top Rated" })).toBeInTheDocument();
    expect(callsTo("/tv/top_rated")).toHaveLength(1);
    expect(screen.getByAltText("Best Show").closest("a")).toHaveAttribute("href", "/title/tv/7");
  });

  test("Bollywood filters by Hindi, genre pages filter by id", async () => {
    const { unmount } = renderAt("/browse/bollywood");
    expect(await screen.findByText("Discovered Movie")).toBeInTheDocument();
    expect(callsTo("/discover/movie")[0][0]).toContain("with_original_language=hi");
    unmount();

    renderAt("/genre/9648");
    expect(await screen.findByRole("heading", { name: "Mystery" })).toBeInTheDocument();
    expect(await screen.findByText("Discovered Movie")).toBeInTheDocument();
    expect(callsTo("/discover/movie").pop()[0]).toContain("with_genres=9648");
  });

  test("web series pages filter TV by language", async () => {
    renderAt("/web-series/de");
    expect(await screen.findByRole("heading", { name: "German" })).toBeInTheDocument();
    expect(await screen.findByText("Discovered Series")).toBeInTheDocument();
    expect(callsTo("/discover/tv")[0][0]).toContain("with_original_language=de");
  });

  test("a grid page fetches exactly once (regression: infinite loop)", async () => {
    renderAt("/browse/tv-top-rated");
    await screen.findByText("Best Show");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });
    expect(callsTo("/tv/top_rated")).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("search covers movies and TV, ignores people, and encodes the query", async () => {
    renderAt("/search?q=dune%20part%202%20%26%20more");
    expect(await screen.findByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("Dune Prophecy")).toBeInTheDocument();
    expect(screen.queryByText("Dune Actor")).not.toBeInTheDocument();
    const url = new URL(callsTo("/search/multi")[0][0]);
    expect(url.searchParams.get("query")).toBe("dune part 2 & more");
  });

  test("pressing Enter in the navbar search submits it", async () => {
    renderAt("/browse/tv-top-rated");
    await screen.findByText("Best Show");
    await userEvent.click(screen.getByRole("button", { name: /open search/i }));
    await userEvent.type(screen.getByRole("searchbox"), "dune{enter}");
    expect(await screen.findByText("Results for : dune")).toBeInTheDocument();
    expect(await screen.findByText("Dune Prophecy")).toBeInTheDocument();
  });

  test("unknown categories, genres and languages show Not Found without fetching", () => {
    ["/browse/constructor", "/genre/abc", "/genre/__proto__", "/web-series/xx", "/nope"].forEach(
      (route) => {
        const { unmount } = renderAt(route);
        expect(screen.getByText("Page not found")).toBeInTheDocument();
        unmount();
      }
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("an empty search shows a prompt and does not call the API", () => {
    renderAt("/search");
    expect(screen.getByText(/type something in the search box/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe("Watchlist and auth", () => {
  test("logged out: asks the user to log in", async () => {
    renderAt("/watchlist");
    expect(await screen.findByText(/log in to save titles/i)).toBeInTheDocument();
    expect(getDocs).not.toHaveBeenCalled();
  });

  test("logged in: lists only this user's saved titles, newest first", async () => {
    currentUser = { uid: "u1", email: "a@b.com" };
    getDocs.mockResolvedValue({
      docs: [
        { data: () => ({ uid: "u1", tmdbId: 550, mediaType: "movie", title: "Older", poster_path: "/a.jpg", createdAt: { toMillis: () => 1 } }) },
        { data: () => ({ uid: "u1", tmdbId: 1399, mediaType: "tv", title: "Newer", poster_path: "/b.jpg", createdAt: { toMillis: () => 2 } }) },
        { data: () => ({ id: "legacy-doc-without-tmdb-id", title: "Legacy" }) },
      ],
    });
    renderAt("/watchlist");
    expect(await screen.findByText("Newer")).toBeInTheDocument();
    const titles = screen.getAllByText(/^(Newer|Older)$/).map((el) => el.textContent);
    expect(titles).toEqual(["Newer", "Older"]);
    expect(screen.queryByText("Legacy")).not.toBeInTheDocument();
    expect(getDocs.mock.calls[0][0]).toEqual([{ name: "movies" }, ["uid", "==", "u1"]]);
    expect(screen.getByAltText("Newer").closest("a")).toHaveAttribute("href", "/title/tv/1399");
  });

  test("logged in with nothing saved: shows an empty message", async () => {
    currentUser = { uid: "u1", email: "a@b.com" };
    renderAt("/watchlist");
    expect(await screen.findByText(/your watchlist is empty/i)).toBeInTheDocument();
  });

  test("session is restored from Firebase: navbar shows the user and a real log out button", async () => {
    currentUser = { uid: "u1", email: "me@example.com" };
    renderAt("/browse/tv-top-rated");
    expect(await screen.findByText("me@example.com")).toBeInTheDocument();
    const { signOut } = require("firebase/auth");
    signOut.mockResolvedValue(undefined);
    await userEvent.click(screen.getByRole("button", { name: /log out/i }));
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Log Out Successful")).toBeInTheDocument();
  });

  test("sign up submits with Enter and returns to where the user came from", async () => {
    const { createUserWithEmailAndPassword } = require("firebase/auth");
    createUserWithEmailAndPassword.mockResolvedValue({});
    renderAt("/login");
    await userEvent.type(screen.getByLabelText("Email"), "new@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "secret12{enter}");
    await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1));
    expect(createUserWithEmailAndPassword.mock.calls[0].slice(1)).toEqual(["new@example.com", "secret12"]);
    expect(await screen.findByText("Sign Up Successful !!!")).toBeInTheDocument();
    // Redirected home.
    expect(await screen.findByText("Trending Movies & TV Shows")).toBeInTheDocument();
  });

  test("auth errors are shown in plain language", async () => {
    const { signInWithEmailAndPassword } = require("firebase/auth");
    signInWithEmailAndPassword.mockRejectedValue({ code: "auth/invalid-credential" });
    jest.spyOn(console, "error").mockImplementation(() => {});
    renderAt("/login");
    await userEvent.click(screen.getByRole("button", { name: "Log In" }));
    await userEvent.type(screen.getByLabelText("Email"), "x@y.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrongpass{enter}");
    expect(await within(document.body).findByText("Incorrect email or password.")).toBeInTheDocument();
  });
});
