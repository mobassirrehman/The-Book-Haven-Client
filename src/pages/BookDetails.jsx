import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { FaStar } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import { FaUser } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  useTitle(book ? book.title : "Book Details");

  useEffect(() => {
    fetch(`http://localhost:3000/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book details");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!loading && book) {
      const ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(imageRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
        });

        gsap.from(infoRef.current.children, {
          x: 30,
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
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="details-page">
        <div className="container-custom">
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h2 className="empty-state-text">Book Not Found</h2>
            <p className="text-[#6B6B6B] mb-8">
              The book you're looking for doesn't exist.
            </p>
            <Link to="/all-books">
              <button className="btn-primary">Back to All Books</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-container">
        <div ref={cardRef} className="details-card">
          <div className="details-header">
            <button onClick={() => navigate(-1)} className="details-back-btn">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "Marcellus, serif" }}
            >
              Book Details
            </h1>
          </div>

          <div className="details-content">
            <div ref={imageRef} className="details-image-section">
              <img
                src={book.coverImage}
                alt={book.title}
                className="details-cover-image"
              />
            </div>

            <div ref={infoRef} className="details-info-section">
              <div>
                <h2 className="details-title">{book.title}</h2>
                <p className="details-author">by {book.author}</p>
              </div>

              <div className="details-meta">
                <span className="details-genre-badge">{book.genre}</span>
                <span className="details-rating">
                  <FaStar /> {book.rating}
                </span>
              </div>

              <div className="details-section">
                <h3 className="details-section-title"><FaBookOpen /> Summary</h3>
                <p className="details-summary">{book.summary}</p>
              </div>

              <div className="details-section">
                <h3 className="details-section-title"><FaUser /> Added By</h3>
                <div className="details-added-by">
                  <p className="details-user-info">
                    <span className="details-user-name">{book.userName}</span>
                  </p>
                  <p className="details-user-info">{book.userEmail}</p>
                  <p className="details-user-info text-xs mt-2">
                    Added on{" "}
                    {new Date(book.addedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="details-actions">
                <Link
                  to={`/update-book/${book._id}`}
                  className="btn-details-action flex items-center"
                >
                  <TiPencil className="mr-0.5"/> Update Book
                </Link>
                <Link to="/all-books" className="btn-details-secondary flex items-center">
                <FaBook className="mr-1" /> All Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
