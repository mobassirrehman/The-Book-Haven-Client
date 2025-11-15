import { Link } from "react-router";
import useTitle from "../hooks/useTitle";
import { IoHome } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";

const NotFound = () => {
  useTitle("404 - Not Found");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE3D8] via-[#F5F0E8] to-[#EAE3D8] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-9xl font-bold text-[#2C7873] mb-4">404</div>

        <h1
          className="text-4xl md:text-5xl font-bold text-[#3D3229] mb-4"
          style={{ fontFamily: "Marcellus, serif" }}
        >
          Lost in the Library?
        </h1>

        <p className="text-lg text-[#6B6B6B] mb-8">
          We couldn't find the page you're looking for. It might have been
          removed, renamed, or never existed.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <button className="flex items-center bg-gradient-to-br from-[#3D3229] to-[#2C7873] cursor-pointer text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
              <IoHome className="mr-2" /> Back to Home
            </button>
          </Link>
          <Link to="/all-books">
            <button className="bg-gradient-to-r from-[#351e03d2] to-[#5c260dca] hover:bg-[#3D3229] cursor-pointer text-white flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
              <FaBook className="mr-2" /> Browse All Books
            </button>
          </Link>
        </div>

        <div className="mt-12">
          <div className="text-8xl mb-4 flex justify-center">
            <SiBookstack className="text-[#6B5D52]" />
          </div>
          <p className="text-sm text-[#6B6B6B] italic">
            "Not all those who wander are lost... but this page is."
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
