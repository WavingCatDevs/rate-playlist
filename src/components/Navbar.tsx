import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/client";
import Link from "next/link";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <nav className="bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <span
            className="text-white text-lg font-semibold"
            style={{ width: "144px" }}
          >
            Playlist Site
          </span>
        </div>
        <div className="flex items-center justify-center flex-grow">
          <Link href="/">
            <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Home
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Explore
            </a>
          </Link>
          <Link href="#">
            <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Search
            </a>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              My Account
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <a className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
            </Link>
            <Link href="/signup">
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
