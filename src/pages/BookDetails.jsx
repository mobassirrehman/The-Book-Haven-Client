import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import useTitle from "../hooks/useTitle";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { 
  FaStar, 
  FaArrowLeft, 
  FaUser, 
  FaCalendar, 
  FaQuoteLeft,
  FaBookOpen 
} from "react-icons/fa";
import { 
  IoStar, 
  IoStarOutline, 
  IoSend,
  IoLibrary,
  IoCheckmarkCircle
} from "react-icons/io5";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import CommentSection from "../components/CommentSection";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [setLoadingRelated] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviews, setReviews] = useState([]);

  const headerRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  useTitle(book?.title || "Book Details");


  const sampleReviews = [
    {
      id: 1,
      user: "Emily Watson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "2024-01-15",
      comment: "An absolutely captivating read! The storytelling is masterful and keeps you engaged from start to finish.",
    },
    {
      id: 2,
      user: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4,
      date: "2024-01-10",
      comment: "Great book with wonderful character development. Highly recommended for anyone who loves this genre.",
    },
    {
      id: 3,
      user: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      rating: 5,
      date: "2024-01-05",
      comment: "One of the best books I've read this year. The author has a unique voice that really resonates.",
    },
  ];

  useEffect(() => {
    axios
      .get(`https://book-haven-server-neon.vercel.app/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setReviews(sampleReviews);
        setLoading(false);

        axios
          .get(`https://book-haven-server-neon.vercel.app/books`)
          .then((res) => {
            const related = res.data
              .filter(
                (b) => b.genre === response.data.genre && b._id !== response.data._id
              )
              .slice(0, 4);
            setRelatedBooks(related);
            setLoadingRelated(false);
          })
          .catch(() => setLoadingRelated(false));
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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    const review = {
      id: reviews.length + 1,
      user: user.displayName || "Anonymous",
      avatar: user.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      comment: newReview.comment,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
    toast.success("Review submitted successfully!");
  };

  const renderStars = (rating, interactive = false, onSelect = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <IoStar className="text-[var(--color-accent)] text-xl" />
            ) : (
              <IoStarOutline className="text-[var(--color-accent)] text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

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
                <h3 className="details-section-title">
                  <IoLibrary className="inline mr-2 text-[var(--color-primary)]" />
                  Summary
                </h3>
                <p className="details-summary">{book.summary}</p>
              </div>

              <div className="details-added-by">
                <p className="details-user-info">
                  <FaUser className="inline mr-2" />
                  Added by:{" "}
                  <span className="details-user-name">{book.userName}</span>
                </p>
                {book.addedAt && (
                  <p className="details-user-info mt-2">
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
                  <Link to={`/dashboard/update-book/${book._id}`}>
                    <button className="btn-details-action">Update Book</button>
                  </Link>
                  <Link to="/all-books">
                    <button className="btn-details-secondary">All Books</button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div 
            className="p-8 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <FaQuoteLeft className="text-[var(--color-primary)]" />
              Reviews & Ratings
              <span 
                className="text-sm font-normal ml-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({reviews.length} reviews)
              </span>
            </h3>

            {user ? (
              <form onSubmit={handleSubmitReview} className="mb-8">
                <div 
                  className="p-4 rounded-xl mb-4"
                  style={{ background: "var(--color-bg-secondary)" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg"}
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div 
                        className="font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {user.displayName || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-sm"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Your rating:
                        </span>
                        {renderStars(newReview.rating, true, (rating) =>
                          setNewReview({ ...newReview, rating })
                        )}
                      </div>
                    </div>
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Write your review..."
                    className="w-full p-3 rounded-lg resize-none"
                    style={{
                      background: "var(--color-bg-card)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="mt-3 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{
                      background: "var(--color-primary)",
                      color: "white",
                    }}
                  >
                    <IoSend />
                    Submit Review
                  </button>
                </div>
              </form>
            ) : (
              <div 
                className="text-center p-6 rounded-xl mb-6"
                style={{ background: "var(--color-bg-secondary)" }}
              >
                <p style={{ color: "var(--color-text-secondary)" }}>
                  <Link 
                    to="/login" 
                    className="font-semibold hover:underline"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Sign in
                  </Link>
                  {" "}to leave a review
                </p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl border"
                  style={{
                    background: "var(--color-bg-secondary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.avatar}
                      alt={review.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span 
                            className="font-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {review.user}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span 
                              className="text-xs"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p style={{ color: "var(--color-text-secondary)" }}>
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="p-8 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <CommentSection bookId={book._id} />
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-2xl font-bold flex items-center gap-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                <FaBookOpen className="text-[var(--color-primary)]" />
                Related Books
              </h3>
              <Link 
                to={`/all-books?genre=${book.genre}`}
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <Link to={`/book/${relatedBook._id}`} key={relatedBook._id}>
                  <div className="book-card h-full">
                    <img
                      src={relatedBook.coverImage}
                      alt={relatedBook.title}
                      className="book-card-img"
                    />
                    <div className="book-card-body">
                      <h4 className="book-card-title">{relatedBook.title}</h4>
                      <p className="book-card-author">by {relatedBook.author}</p>
                      <div className="book-card-meta">
                        <span className="book-card-genre">{relatedBook.genre}</span>
                        <span className="book-card-rating">
                          <FaStar /> {relatedBook.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;