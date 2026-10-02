export const Items = [
  { title: "Home", to: "/" },
  {
    title: "Movies",
    dropdown: [
      { label: "Latest Released", to: "/browse/latest" },
      { label: "Hollywood", to: "/browse/hollywood" },
      { label: "Bollywood", to: "/browse/bollywood" },
      { label: "Anime", to: "/browse/anime" },
      { label: "Top Rated", to: "/browse/top-rated" },
    ],
  },
  {
    title: "Genre",
    dropdown: [
      { label: "Mystery", to: "/genre/9648" },
      { label: "Romance", to: "/genre/10749" },
      { label: "Sci-fi", to: "/genre/878" },
      { label: "Horror", to: "/genre/27" },
      { label: "Thriller", to: "/genre/53" },
      { label: "Crime", to: "/genre/80" },
      { label: "Drama", to: "/genre/18" },
    ],
  },
  {
    title: "TV Shows",
    dropdown: [
      { label: "Popular", to: "/browse/tv-popular" },
      { label: "Airing Today", to: "/browse/tv-airing-today" },
      { label: "On TV", to: "/browse/tv-on-the-air" },
      { label: "Top Rated", to: "/browse/tv-top-rated" },
    ],
  },
  {
    title: "Web Series",
    dropdown: [
      { label: "Hindi", to: "/web-series/hi" },
      { label: "English", to: "/web-series/en" },
      { label: "Spanish", to: "/web-series/es" },
      { label: "German", to: "/web-series/de" },
    ],
  },
  { title: "Blog", href: "https://kanishk-319.github.io/MyPortfolio/" },
];
