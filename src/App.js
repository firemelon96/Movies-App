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
      console.log(Object.keys(data));

      let loadedMovies = [];
      Object.keys(data).forEach((key) => {
        return loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      });
      // const loadedMovies = [];

      // for (const key in data) {
      //   loadedMovies.push({
      //     id: key,
      //     title: data[key].title,
      //     openingText: data[key].openingText,
      //     releaseDate: data[key].releaseDate,
      //   });
      // }

      console.log(loadedMovies);

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = async (movie) => {
    const res = await fetch(
      "https://react-http-7e647-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    console.log(data);
    fetchMov();
  };

  useEffect(() => {
    fetchMov();
  }, [fetchMov]);

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
