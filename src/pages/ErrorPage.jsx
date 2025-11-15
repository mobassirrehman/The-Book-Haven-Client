import { Link, useRouteError } from "react-router";
import useTitle from "../hooks/useTitle";
import { IoHome } from "react-icons/io5";
import { FaBook } from "react-icons/fa";

const ErrorPage = () => {
  useTitle("Error");
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE3D8] via-[#F5F0E8] to-[#EAE3D8] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-9xl font-bold text-[#2C7873] mb-4">
          {error?.status || "404"}
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold text-[#3D3229] mb-4"
          style={{ fontFamily: "Marcellus, serif" }}
        >
          {error?.status === 404
            ? "Page Not Found"
            : "Oops! Something Went Wrong"}
        </h1>

        <p className="text-lg text-[#6B6B6B] mb-8">
          {error?.statusText ||
            error?.message ||
            "The page you're looking for doesn't exist or has been moved."}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <button className="flex place-items-center bg-gradient-to-br from-[#3D3229] to-[#2C7873] hover:bg-[#1F5B57] cursor-pointer text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
              <IoHome className="mr-1" /> Go to Home
            </button>
          </Link>
          <Link to="/all-books">
            <button className="flex items-center  bg-gradient-to-r from-[#351e03d2] to-[#5c260dca] hover:bg-[#3D3229] cursor-pointer text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
              <FaBook className="mr-1.5" />
              Browse Books
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
