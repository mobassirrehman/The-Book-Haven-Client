import { Link } from "react-router";
import { BsTelephoneForwardFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { SiQuora } from "react-icons/si";
import { BsThreads } from "react-icons/bs";
import { FaReddit } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import { GiSelfLove } from "react-icons/gi";

const Footer = () => {
  return (
    <footer className="bg-[#2A1F1A] text-[#EAE3D8]">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              The Book Haven
            </h3>
            <p className="text-sm text-[#EAE3D8]/80 leading-relaxed">
              Your personal digital library where book lovers come together to
              discover, share, and manage their favorite books.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#EAE3D8]/80 hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-books"
                  className="text-[#EAE3D8]/80 hover:text-white transition-colors duration-300"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  to="/add-book"
                  className="text-[#EAE3D8]/80 hover:text-white transition-colors duration-300"
                >
                  Add Book
                </Link>
              </li>
              <li>
                <Link
                  to="/my-books"
                  className="text-[#EAE3D8]/80 hover:text-white transition-colors duration-300"
                >
                  My Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-[#EAE3D8]/80">Fiction</li>
              <li className="text-[#EAE3D8]/80">Non-Fiction</li>
              <li className="text-[#EAE3D8]/80">Mystery</li>
              <li className="text-[#EAE3D8]/80">Fantasy</li>
              <li className="text-[#EAE3D8]/80">Romance</li>
              <li className="text-[#EAE3D8]/80">Science Fiction</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-[#EAE3D8]/80">
              <li className="flex gap-2 items-center">
                <IoMdMail /> info@bookhaven.com
              </li>
              <li className="flex gap-2 items-center">
                <BsTelephoneForwardFill /> +0 (160) 170-0902
              </li>
              <li className="flex gap-2 items-center">
                <FaLocationDot />
                123 Book Street, Philadelphia.
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-2xl  hover:text-yellow-500 transition-colors duration-300"
                aria-label="X"
              >
                <FaXTwitter />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-yellow-500 transition-colors duration-300"
                aria-label="Quora"
              >
                <SiQuora />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-yellow-500 transition-colors duration-300"
                aria-label="Threads"
              >
                <BsThreads />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-yellow-500 transition-colors duration-300"
                aria-label="Reddit"
              >
                <FaReddit />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EAE3D8]/20 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-[#EAE3D8]/80 mt-6">
            © {new Date().getFullYear()} The Book Haven. All rights reserved.
            Made by TheGrim with
            <IoBookSharp className="text-[#EAE3D8] text-base" />
            and
            <GiSelfLove className="text-[#EAE3D8] text-base" />.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
