import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import axios from "axios";
import { FaBookOpen } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import SkeletonLoader from "../components/shared/SkeletonLoader";

const MyBooks = () => {
  useTitle("My Books");
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://book-haven-server-neon.vercel.app/books/user/${user.email}`
        )
        .then((response) => {
          setBooks(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          toast.error("Failed to load your books");
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && books.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current.children, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        });

        if (tableRef.current) {
          gsap.from(tableRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.3,
          });

          gsap.from(".table-row", {
            x: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.5,
          });
        }

        if (cardsRef.current) {
          gsap.from(".book-card-mobile", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.5,
          });
        }
      });

      return () => ctx.revert();
    }
  }, [loading, books]);

  const handleDelete = async (id) => {
    if (deleteId !== id) {
      setDeleteId(id);
      toast("Click delete again to confirm", { icon: "⚠️" });
      setTimeout(() => setDeleteId(null), 3000);
      return;
    }

    try {
      const response = await axios.delete(
        `https://book-haven-server-neon.vercel.app/books/${id}`
      );

      if (response.data.deletedCount > 0) {
        setBooks(books.filter((book) => book._id !== id));
        toast.success("Book deleted successfully!");
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  if (loading) {
    return (
      <div className="my-books-page">
        <div className="container-custom">
          <SkeletonLoader type="table" />
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="my-books-page">
        <div className="container-custom">
          <div className="empty-state">
            <div className="empty-state-icon flex justify-center">
              <FaBookOpen />
            </div>
            <h2 className="empty-state-text">
              You Haven't Added Any Books Yet
            </h2>
            <p className="text-[#6B6B6B] mb-8">
              Start building your collection by adding your first book!
            </p>
            <div className="flex justify-center">
              <Link className="" to="/add-book">
                <button className="btn-details-secondary flex items-center">
                  Add Your First Book
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-books-page">
      <div className="container-custom">
        <div ref={headerRef} className="my-books-header">
          <h1 className="my-books-title">My Books</h1>
          <p className="my-books-subtitle">
            You have added {books.length}{" "}
            {books.length === 1 ? "book" : "books"}
          </p>
        </div>

        <div ref={tableRef} className="table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="table-row">
                  <td>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="book-table-img"
                    />
                  </td>
                  <td>
                    <Link to={`/book/${book._id}`}>
                      <span className="book-table-title">{book.title}</span>
                    </Link>
                  </td>
                  <td className="text-[#6B6B6B]">{book.author}</td>
                  <td>
                    <span className="genre-badge">{book.genre}</span>
                  </td>
                  <td>
                    <div className="rating-display">
                      <span>
                        <FaStar />{" "}
                      </span>
                      <span>{book.rating}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/update-book/${book._id}`}>
                        <button className="btn-edit">Update</button>
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id, book.title)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div ref={cardsRef} className="mobile-cards-container">
          {books.map((book) => (
            <div key={book._id} className="book-card-mobile">
              <div className="flex gap-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="book-card-mobile-img"
                />

                <div className="flex-1">
                  <Link to={`/book/${book._id}`}>
                    <h3 className="text-lg font-bold text-[#3D3229] mb-1 hover:text-[#2C7873]">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#6B6B6B] mb-2">
                    by {book.author}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="genre-badge">{book.genre}</span>
                    <div className="rating-display text-sm">
                      <span>
                        <FaStar />
                      </span>
                      <span>{book.rating}</span>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <Link to={`/update-book/${book._id}`}>
                      <button className="btn-edit flex-1">Update</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(book._id, book.title)}
                      className="btn-delete flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
