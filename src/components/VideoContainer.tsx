import Link from "next/link";
import React from "react";

const ImageContainer = ({ imageUrl, playlistId }) => {
  return (
    <>
      <style>
        {`
          .image-container {
            overflow-x: hidden;
          }
        `}
      </style>
      <div className="mt-3">
        <h2 className="text-3xl font-bold mb-6 text-center mt-3">Trending</h2>
      </div>

      <div className="image-container flex flex-wrap -mx-1">
        {imageUrl.map((image, index) => (
          <div
            key={index}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-2 mb-8"
            style={{ paddingLeft: "16px", paddingRight: "16px" }}
          >
            <Link href={`/playlists/${playlistId[index]}`}>
              <a className="cursor-pointer">
                <img
                  src={image}
                  alt={`Playlist ${index}`}
                  className="w-full h-auto object-cover rounded"
                />
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageContainer;
