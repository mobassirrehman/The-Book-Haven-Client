import { useEffect, useRef, useState } from "react";
import useTitle from "../hooks/useTitle";
import { Link } from "react-router";
import toast from "react-hot-toast";
import gsap from "gsap";
import { IoBookSharp } from "react-icons/io5";
import { GiSelfLove } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import { FaUserSecret } from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdTouchApp } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import axios from "axios";

const Home = () => {
  useTitle("Home");

  const [latestBooks, setLatestBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);

  const bannerImages = [
    "https://i.ibb.co.com/PkLY22P/library-9.jpg",
    "https://i.ibb.co.com/WNVSHCs7/library-7.jpg",
  ];

  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/books/latest")
      .then((response) => {
        setLatestBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/books/top-rated")
      .then((response) => {
        setTopRatedBooks(Array.isArray(response.data) ? response.data : []);
        setLoadingTopRated(false);
      })
      .catch((error) => {
        console.error("Error fetching top rated books:", error);
        setTopRatedBooks([]);
        setLoadingTopRated(false);
      });
  }, []);

  useEffect(() => {
    gsap.set(slide1Ref.current, { opacity: 1 });
    gsap.set(slide2Ref.current, { opacity: 0 });

    const tl = gsap.timeline({ repeat: -1 });

    tl.to({}, { duration: 6 })
      .to(slide2Ref.current, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
      })
      .to({}, { duration: 6 })
      .to(slide2Ref.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut",
      });

    return () => tl.kill();
  }, []);

  return (
    <div>
      <section className="banner">
        <div className="banner-slider">
          <div ref={slide1Ref} className="banner-slide">
            <img src={bannerImages[0]} alt="Books" />
          </div>
          <div ref={slide2Ref} className="banner-slide">
            <img src={bannerImages[1]} alt="Library" />
          </div>
        </div>

        <div className="banner-overlay"></div>
        <div className="container-custom">
          <div className="banner-content">
            <h1 className="banner-title">Welcome to The Book Haven</h1>

            <div className="banner-buttons">
              <Link to="/all-books">
                <button className="btn-banner">All Books</button>
              </Link>
              <Link to="/add-book">
                <button className="btn-banner">Add Book</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="section-title">Latest Additions</h2>

          {loading ? (
            <SkeletonLoader type="cards" />
          ) : latestBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-8xl text-yellow-400 items-center flex justify-center mb-6">
                <IoBookSharp />
              </div>
              <p className="text-2xl text-[#6B6B6B] mb-6">
                No books in the library yet.
              </p>
              <Link to="/add-book">
                <button className="btn-primary">Add the First Book</button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid-books">
                {latestBooks.map((book) => (
                  <Link to={`/book/${book._id}`} key={book._id}>
                    <div className="book-card">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="book-card-img"
                      />
                      <div className="book-card-body">
                        <h3 className="book-card-title">{book.title}</h3>
                        <p className="book-card-author">by {book.author}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="book-card-genre">{book.genre}</span>
                          <span className="text-[#C9A961] font-bold flex items-center gap-1">
                            <FaStar />
                            {book.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/all-books">
                  <button className="btn-primary">View All Books</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section bg-gradient-to-br from-[#3D3229] to-[#2C7873]">
        <div className="container-custom">
          <h2 className="section-title text-white">Top Rated Books</h2>

          {loadingTopRated ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-96 rounded-xl"></div>
              ))}
            </div>
          ) : topRatedBooks.length === 0 ? (
            <p className="text-center text-white/80">No books rated yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topRatedBooks &&
                Array.isArray(topRatedBooks) &&
                topRatedBooks.map((book, index) => (
                  <Link to={`/book/${book._id}`} key={book._id}>
                    <div className="relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 border border-white/20">
                      <div className="absolute top-4 left-4 z-10 bg-[#C9A961] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                        #{index + 1}
                      </div>

                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-80 object-cover"
                      />

                      <div className="p-6 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-3">
                          by {book.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {book.genre}
                          </span>
                          <span className="flex items-center gap-1 text-[#C9A961] font-bold text-lg">
                            <FaStar /> {book.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="section bg-[#F5F0E8] py-12">
        <div className="container-custom">
          <h2 className="section-title">Explore by Genre</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Fiction", icon: <IoBookSharp /> },
              { name: "Non-Fiction", icon: <MdMenuBook /> },
              { name: "Mystery", icon: <FaUserSecret /> },
              { name: "Fantasy", icon: <FaMagic /> },
              { name: "Romance", icon: <GiSelfLove /> },
              { name: "Science Fiction", icon: <FaRocket /> },
            ].map((genre) => (
              <div
                key={genre.name}
                className="genre-card flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-[#EAE3D8]/50 transition"
              >
                <div className="genre-icon text-4xl text-[#C18C5D]">
                  {genre.icon}
                </div>
                <h3 className="genre-name text-base font-medium text-gray-700">
                  {genre.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#3D3229] text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl text-[#c18c5d] items-center flex justify-center mb-6">
              <IoBookSharp />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About The Book Haven
            </h2>
            <p className="text-lg leading-relaxed text-[#EAE3D8]">
              The Book Haven is your personal digital library where book lovers
              come together. Discover new titles, share your favorites, and keep
              track of your reading journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 justify-items-center">
              <div className="bg-white/10 p-6 rounded-lg flex flex-col items-center text-center">
                <MdLibraryBooks className="text-5xl mb-4" />
                <h3 className="text-xl font-bold mb-2">Vast Collection</h3>
                <p className="text-[#EAE3D8]/80 text-sm">
                  Explore books across all genres
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-lg flex flex-col items-center text-center">
                <FaUsers className="text-5xl mb-4" />
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-[#EAE3D8]/80 text-sm">
                  Share with fellow book lovers
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-lg flex flex-col items-center text-center">
                <MdTouchApp className="text-5xl mb-4" />
                <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
                <p className="text-[#EAE3D8]/80 text-sm">
                  Simple library management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
