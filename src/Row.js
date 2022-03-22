import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";

const BASE_URL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);

  // A snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    // make request to tmdb when Row component is loaded (onload)
    // if [], run once when the Row loads and don't run again
    // if [item], run once when the Row loads and again when "item" changes
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  console.log("movies = ", movies);
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {/** row posters */}
        {movies.map(
          (movie) =>
            movie.poster_path &&
            movie.backdrop_path && (
              <img
                className={`row__poster${
                  isLargeRow ? " row__posterLarge" : ""
                }`}
                key={movie.id}
                src={`${BASE_URL}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </div>
    </div>
  );
}

export default Row;
