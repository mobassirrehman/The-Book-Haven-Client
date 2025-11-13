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

const Home = () => {
  useTitle("Home");

  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const bannerImages = [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80",
  ];

  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/books/latest")
      .then((res) => res.json())
      .then((data) => {
        setLatestBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
        setLoading(false);
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
                          <span className="text-[#C9A961] font-bold">
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

      <section className="section bg-[#F5F0E8] py-12">
        <div className="container-custom">
          <h2 className="section-title">
            Explore by Genre
          </h2>

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
