import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/client";
import musicGenres from "../../../res/genres.json";

const GenreCategoryPage = () => {
  const router = useRouter();
  const { genre, category } = router.query;

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<string[]>([]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category as string);
      setSelectedData(musicGenres[category as string]);
    }
    if (genre) {
      setSelectedGenre(genre as string);
    }
  }, [category, genre]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsQuery = query(
          collection(firestore, "playlists"),
          where("subCategory", "==", selectedCategory),
          where("genre", "==", selectedGenre)
        );
        const playlistDocs = await getDocs(playlistsQuery);
        const playlistsData = playlistDocs.docs.map((doc) => doc.data().url);
        setPlaylists(playlistsData);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    if (selectedCategory && selectedGenre) {
      fetchPlaylists();
    }
  }, [selectedCategory, selectedGenre]);

  return (
    <div>
      <h1>Category: {selectedCategory}</h1>
      <h2>Genre: {selectedGenre}</h2>

      <h3>Playlists:</h3>
      {playlists.length > 0 ? (
        <ul>
          {playlists.map((playlist, index) => (
            <li key={index}>
              <iframe
                src={playlist}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists available for the selected genre.</p>
      )}
    </div>
  );
};

export default GenreCategoryPage;
