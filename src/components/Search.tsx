import { FaSearch, FaFilter } from "react-icons/fa";
import { CgOptions } from "react-icons/cg";

function Search() {
  return (
    <div className="flex justify-center">
      <div className="box flex items-center h-12 w-full bg-gray-900  px-4">
        <input
          type="text"
          placeholder="Search Playlists..."
          className="outline-none bg-transparent w-full text-black"
        />
        <FaFilter className="text-gray-600 ml-2 text-xl" />
        <FaSearch className="text-gray-400 ml-2 text-xl" />
      </div>
    </div>
  );
}

export default Search;
