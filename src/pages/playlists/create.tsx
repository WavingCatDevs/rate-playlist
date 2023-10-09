import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { TiTick } from "react-icons/ti";
import musicGenres from "../../res/genres.json";
import { auth, firestore } from "../../firebase/client";
import { customAlphabet } from "nanoid";

export default function Create() {
  const router = useRouter();
  const [u, l, e] = useAuthState(auth);

  const [url, setUrl] = useState("");
  const [posts, setPosts] = useState([]);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const categories = Object.keys(musicGenres);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [selectedSubCategoryData, setSelectedSubCategoryData] = useState([]);
  const [showForm1, setShowForm1] = useState(true);
  const [showForm2, setShowForm2] = useState(false);
  const [showForm3, setShowForm3] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const generateShortId = customAlphabet("1234567890abcdef", 10);

  const onSubmitForm1 = (event) => {
    event.preventDefault();

    if (!isValidUrl) {
      return;
    }

    setShowForm1(false);
    setShowForm2(true);
  };

  const onSubmitForm2 = (event) => {
    event.preventDefault();

    setShowForm2(false);
    setShowForm3(true);
  };

  const onSubmitForm3 = async (event) => {
    event.preventDefault();

    const id = url.split("/playlist/")[1].split("?")[0];
    const embedUrl = `https://open.spotify.com/embed/playlist/${id}`;

    const newPlaylist = {
      uid: generateShortId(),
      creator_id: u.uid as string,
      spotify_url: embedUrl,
      spotify_id: id,
      created_at: Date.now(),
      genre: selectedCategory,
      subCategory: selectedSubCategory,
      votes: 0,
    };

    try {
      const docRef = await addDoc(
        collection(firestore, "playlists"),
        newPlaylist
      );

      await updateDoc(docRef, {});

      await getPlaylist();
      setShowForm3(false);
      setShowSuccess(true);
    } catch (error) {}
  };

  const getPlaylist = async () => {
    try {
      const postQuery = query(collection(firestore, "playlists"));
      const postDocs = await getDocs(postQuery);
      const postsData = postDocs.docs.map((doc) => ({ ...doc.data() }));

      setPosts(postsData);
    } catch (error) {}
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  const validateUrl = (inputUrl) => {
    const urlPattern =
      /^https:\/\/open\.spotify\.com\/playlist\/\w+(\?si=.*)?$/;
    return urlPattern.test(inputUrl);
  };

  const handleUrlChange = (e) => {
    const inputValue = e.target.value;
    setUrl(inputValue);
    setIsValidUrl(validateUrl(inputValue));
  };

  const handleGenreChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    setSelectedGenre("");
    setSelectedSubCategory("");
    setSelectedData(selectedCategory ? musicGenres[selectedCategory] : []);
    setSelectedSubCategoryData([]);
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    setSelectedSubCategory(selectedSubCategory);
  };

  return (
    <div className="min-h-screen bg-purple-600 flex items-center justify-center">
      {showForm1 && (
        <form
          className="bg-white rounded-lg p-8"
          onSubmit={onSubmitForm1}
          style={{ maxWidth: "400px" }}
        >
          <h2 className="text-2xl mb-4">
            First, please put in your Spotify playlist URL
          </h2>
          <input
            className={`border ${
              isValidUrl ? "" : "border-red-500"
            } rounded p-2 mb-4 w-full`}
            placeholder="Playlist URL"
            value={url}
            onChange={handleUrlChange}
          />
          {!isValidUrl && (
            <p className="text-red-500 mb-4">
              Please enter a valid Spotify playlist URL.
            </p>
          )}
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Next
          </button>
        </form>
      )}

      {showForm2 && (
        <form
          className="bg-white rounded-lg p-8"
          onSubmit={onSubmitForm2}
          style={{ maxWidth: "400px" }}
        >
          <div className="mb-4">
            <label htmlFor="category" className="block font-semibold mb-1">
              Select a category
            </label>
            <select
              id="category"
              className="border rounded p-2 w-full"
              value={selectedCategory}
              onChange={handleGenreChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {selectedData.length > 0 && (
            <div className="mb-4">
              <label htmlFor="subCategory" className="block font-semibold mb-1">
                Select a sub-category
              </label>
              <select
                id="subCategory"
                className="border rounded p-2 w-full"
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
              >
                <option value="">Select a sub-category</option>
                {selectedData.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Next
          </button>
        </form>
      )}

      {showForm3 && (
        <form
          className="bg-white rounded-lg p-8"
          onSubmit={onSubmitForm3}
          style={{ maxWidth: "800px" }}
        >
          <div className="mb-2">Playlist URL: {url}</div>
          <div className="mb-2">Selected Genre: {selectedCategory}</div>
          <div className="mb-2">
            Selected Sub-Category: {selectedSubCategory}
          </div>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}

      {showSuccess && (
        <div
          className="bg-white rounded-lg p-8 text-center"
          style={{ maxWidth: "400px" }}
        >
          <div className="flex justify-center items-center mb-4">
            <TiTick className="text-green-500 text-3xl" />
          </div>
          <p className="text-xl font-semibold mb-4">
            Success! Your playlist has been created.
          </p>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            // onClick={() => {
            //   setShowSuccess(false);
            //   setShowForm1(true);
            // }}
          >
            View Playlist
          </button>
        </div>
      )}
    </div>
  );
}
