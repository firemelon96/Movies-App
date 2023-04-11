import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMov = useCallback(async function () {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://react-http-7e647-default-rtdb.firebaseio.com/movies.json"
      );
      if (!res.ok) throw new Error("Something went wrong");
      const data = await res.json();
      const transformeData = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformeData);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMov();
  }, [fetchMov]);

  const addMovieHandler = (movie) => {
    console.log(movie);
  };

  let content = <p>No Movies Found</p>;

  if (movies.length > 0) content = <MoviesList movies={movies} />;

  if (error) content = <p>{error}</p>;

  if (isLoading) content = <p>Loading...</p>;

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMov}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
