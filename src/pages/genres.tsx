import React from "react";
import musicGenres from "../res/genres.json";
import Link from "next/link";

const Genres = () => {
  const genres = Object.keys(musicGenres);

  return (
    <div>
      <h1>Genres</h1>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>
            <Link href={`/genres/${genre}`}>
              <a>{genre}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Genres;
