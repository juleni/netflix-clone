import movieTrailer from "movie-trailer";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";

const BASE_URL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

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

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleOnClick = (movie) => {
    if (trailerUrl) {
      // close trailer if it is opened
      setTrailerUrl("");
    } else {
      let foundMovieURL = false;
      // try to find movie trailer for the movie name
      movieTrailer(null, { tmdbId: movie?.id })
        .then((url) => {
          if (url != null) {
            foundMovieURL = true;
            // url example: https://www.youtube.com/watch?v=w7ejDZ8SWv8
            const urlParams = new URLSearchParams(new URL(url).search);
            // we need only last part of url from "v" parameter: "w7ejDZ8SWv8"
            setTrailerUrl(urlParams.get("v"));
          }
        })
        .catch((error) => console.log(error));
      if (!foundMovieURL) {
        // try to find trailer by name
        movieTrailer(movie?.name || "")
          .then((url) => {
            if (url != null) {
              foundMovieURL = true;
              const urlParams = new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get("v"));
            }
          })
          .catch((error) => console.log(error));
      }
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map(
          (movie) =>
            movie.poster_path &&
            movie.backdrop_path && (
              <img
                key={movie.id}
                onClick={() => handleOnClick(movie)}
                className={`row__poster${
                  isLargeRow ? " row__posterLarge" : ""
                }`}
                src={`${BASE_URL}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
              />
            )
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
