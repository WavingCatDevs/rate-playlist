/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, getDoc, query } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { firestore } from "../../firebase/client";

interface PlaylistData {
  name: string;
  images: {
    url: string;
  }[];
  owner: {
    display_name: string;
  };
}

interface Track {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
}

function Playlists() {
  const router = useRouter();

  const { id } = router.query; // Spotify playlist ID

  console.log(id);

  const [data, setData] = useState<PlaylistData | undefined>(undefined);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [votes, setVotes] = useState<number>();

  const getVotes = async () => {
    try {
      const playlistDocRef = doc(firestore, "playlists", id as string);
      const playlistDoc = await getDoc(playlistDocRef);

      if (playlistDoc.exists()) {
        const playlistData = playlistDoc.data();
        if (playlistData && "votes" in playlistData) {
          console.log("playlist data: ", playlistData.votes);
          setVotes(playlistData.votes);
        }
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  const getPlaylist = async () => {
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${id}`,
      {
        headers: {
          Authorization:
            "Bearer BQCsWKnfU2818cDO4oEy72C1lwiFtDCYSaFgflrsT4Cem7nUZYJfnIHK3oqOHuHwfZhpt6Gc4milhKwzGBEkGbIqmKZApqYO6FelJIGdSRf3FinyzKJsKni-WzzrMqje4z9MMuX1mY-zadX-R02UbNMdzo_XNt5R00DnMBrD6A2khRvXC39BhpsqBcLUyKArqA",
        },
      }
    );

    const playlistData: PlaylistData = await playlistResponse.json();

    console.log(playlistData);

    if (!playlistData) {
      return;
    }

    setData(playlistData);
  };

  const getPlaylistTracks = async () => {
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      {
        headers: {
          Authorization:
            "Bearer BQCsWKnfU2818cDO4oEy72C1lwiFtDCYSaFgflrsT4Cem7nUZYJfnIHK3oqOHuHwfZhpt6Gc4milhKwzGBEkGbIqmKZApqYO6FelJIGdSRf3FinyzKJsKni-WzzrMqje4z9MMuX1mY-zadX-R02UbNMdzo_XNt5R00DnMBrD6A2khRvXC39BhpsqBcLUyKArqA",
        },
      }
    );

    const tracksData = await tracksResponse.json();
    const trackItems: Track[] = tracksData.items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((artist) => ({
        name: artist.name,
      })),
    }));

    setTracks(trackItems);
  };

  useEffect(() => {
    if (!id || data) {
      return;
    }

    // Ensure id is available before calling getVotes
    getVotes();
    getPlaylist();
    getPlaylistTracks();
  }, [id, data]);

  return (
    <div className="container mx-auto my-8 p-8 max-w-3xl">
      <div className="flex flex-col items-center mb-8">
        {data && data.images && data.images.length > 0 && (
          <img
            src={data.images[0].url}
            className="w-48 h-48 object-cover rounded-lg border border-gray-300 mb-4"
            alt="Playlist Image"
          />
        )}

        <div className="text-center">
          <h1 className="font-black text-3xl mb-2">{data?.name}</h1>
          <div className="text-gray-600">
            Creator: {data?.owner?.display_name || "Undefined"}
          </div>

          {/* Main Number */}
          <div className="mt-5 text-xl font-bold">{votes}</div>

          {/* Upvote and Downvote Buttons */}
          <div className="mt-2 flex justify-center items-center">
            <div className="border p-2 rounded-full mr-2">
              <button className="p-2 text-green-500 hover:text-green-600">
                <FaThumbsUp />
              </button>
            </div>
            <div className="border p-2 rounded-full">
              <button className="p-2 text-red-500 hover:text-red-600">
                <FaThumbsDown />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {tracks.map((track) => (
          <div
            key={track.id}
            className="mb-4 border p-4 rounded-md shadow-md hover:scale-105 transition-transform"
          >
            <p className="font-semibold text-lg">{track.name}</p>
            <p className="text-gray-600">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists;
