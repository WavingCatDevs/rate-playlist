import { query, collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import VideoContainer from "../components/VideoContainer";
import { firestore } from "../firebase/client";

export default function Home() {
  const [imageUrls, setImageUrls] = useState([]);
  const [playlistIds, setPlaylistIds] = useState([]);

  useEffect(() => {
    const getPlaylist = async () => {
      try {
        const postQuery = query(collection(firestore, "playlists"));
        const postDocs = await getDocs(postQuery);
        const playlistData = postDocs.docs.map((doc) => doc.data());

        playlistData.map((playlist) => playlist.spotify_id);
        setPlaylistIds(playlistData.map((playlist) => playlist.spotify_id));

        const imageUrlsPromises = playlistData.map(async (playlist) => {
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist.spotify_id}/images`,
            {
              headers: {
                Authorization:
                  "Bearer BQCsWKnfU2818cDO4oEy72C1lwiFtDCYSaFgflrsT4Cem7nUZYJfnIHK3oqOHuHwfZhpt6Gc4milhKwzGBEkGbIqmKZApqYO6FelJIGdSRf3FinyzKJsKni-WzzrMqje4z9MMuX1mY-zadX-R02UbNMdzo_XNt5R00DnMBrD6A2khRvXC39BhpsqBcLUyKArqA",
              },
            }
          );
          const data = await response.json();

          if (data && data.length > 0) {
            const imageUrls = data.map((item) => item.url);
            return imageUrls[0];
          } else {
            console.log("No image found for playlist ID:", playlist.spotify_id);
            return [];
          }
        });

        const resolvedImageUrls = await Promise.all(imageUrlsPromises);
        const filteredImageUrls = resolvedImageUrls.flat();

        setImageUrls(filteredImageUrls);
      } catch (error) {
        console.error("Error retrieving playlist data:", error);
      }
    };

    getPlaylist();
  }, []);

  return (
    <React.Fragment>
      <Search />
      <VideoContainer imageUrl={imageUrls} playlistId={playlistIds} />
    </React.Fragment>
  );
}
