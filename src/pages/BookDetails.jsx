import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import useTitle from "../hooks/useTitle";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { FaStar, FaArrowLeft, FaUser, FaCalendar } from "react-icons/fa";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import CommentSection from "../components/CommentSection";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  useTitle(book?.title || "Book Details");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to load book details");
        navigate("/all-books");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && book) {
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(imageRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.3,
        });

        gsap.from(infoRef.current.children, {
          x: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.5,
        });
      });

      return () => ctx.revert();
    }
  }, [loading, book]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="container-custom">
          <div className="details-card">
            <SkeletonLoader type="details" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const isOwner = user?.email === book.userEmail;

  return (
    <div className="details-page">
      <div className="container-custom">
        <div className="details-card">
          <div ref={headerRef} className="details-header">
            <button onClick={() => navigate(-1)} className="details-back-btn">
              <FaArrowLeft /> Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">Book Details</h1>
          </div>

          <div className="details-content">
            <div className="details-image-section" ref={imageRef}>
              <img
                src={book.coverImage}
                alt={book.title}
                className="details-cover-image"
              />
            </div>

            <div className="details-info-section" ref={infoRef}>
              <h2 className="details-title">{book.title}</h2>
              <p className="details-author">by {book.author}</p>

              <div className="details-meta">
                <span className="details-genre-badge">{book.genre}</span>
                <span className="details-rating">
                  <FaStar /> {book.rating}
                </span>
              </div>

              <div className="details-section">
                <h3 className="details-section-title">Summary</h3>
                <p className="details-summary">{book.summary}</p>
              </div>

              <div className="details-added-by">
                <p className="details-user-info">
                  <FaUser className="inline mr-2" />
                  Added by:{" "}
                  <span className="details-user-name">{book.userName}</span>
                </p>
                {book.addedAt && (
                  <p className="details-user-info">
                    <FaCalendar className="inline mr-2" />
                    Added on:{" "}
                    {new Date(book.addedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {isOwner && (
                <div className="details-actions">
                  <Link to={`/update-book/${book._id}`}>
                    <button className="btn-details-action">Update Book</button>
                  </Link>
                  <Link to="/all-books">
                    <button className="btn-details-secondary">All Books</button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-[#6B5D52]/20">
            <CommentSection bookId={book._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
