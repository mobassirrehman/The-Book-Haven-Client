import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import useTitle from "../../hooks/useTitle";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import axios from "axios";
import { gsap } from "gsap";
import { FaStar, FaSearch } from "react-icons/fa";
import { IoAdd, IoTrash, IoCreate, IoClose } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";
import SkeletonLoader from "../../components/shared/SkeletonLoader";

const DashboardMyBooks = () => {
  useTitle("My Books");
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(
          `https://book-haven-server-neon.vercel.app/books/user/${user.email}`
        )
        .then((response) => {
          setBooks(response.data);
          setFilteredBooks(response.data);
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
    if (searchQuery.trim()) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchQuery, books]);

  useEffect(() => {
    if (!loading && books.length > 0 && tableRef.current) {
      gsap.from(tableRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [loading, books]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this book?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://book-haven-server-neon.vercel.app/books/${id}`)
          .then((response) => {
            if (response.data.deletedCount > 0) {
              setBooks(books.filter((book) => book._id !== id));
              toast.success("Book deleted successfully");
            }
          })
          .catch((error) => {
            console.error("Error deleting book:", error);
            toast.error("Failed to delete book");
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader type="table" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] font-[Cormorant_Garamond]">
            My Books
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Manage your book collection ({books.length} books)
          </p>
        </div>
        <Link to="/dashboard/add-book">
          <button className="btn-primary">
            <IoAdd className="text-xl" />
            Add New Book
          </button>
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16">
          <SiBookstack className="text-8xl text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            No Books Yet
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Start building your collection by adding your first book
          </p>
          <Link to="/dashboard/add-book">
            <button className="btn-primary">
              <IoAdd className="text-xl" />
              Add Your First Book
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search your books..."
                className="search-input pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <IoClose />
                </button>
              )}
            </div>
          </div>

          <div ref={tableRef} className="table-container overflow-x-auto">
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
                {filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/book/${book._id}`}
                        className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                      >
                        {book.title}
                      </Link>
                    </td>
                    <td className="text-[var(--color-text-secondary)]">
                      {book.author}
                    </td>
                    <td>
                      <span className="genre-badge">{book.genre}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-[var(--color-accent)] font-bold">
                        <FaStar />
                        {book.rating}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link to={`/dashboard/update-book/${book._id}`}>
                          <button className="btn-edit">
                            <IoCreate />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="btn-delete"
                        >
                          <IoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards-container space-y-4">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card-mobile">
                <div className="flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--color-text-primary)] truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-2">
                      {book.author}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="genre-badge text-xs">{book.genre}</span>
                      <span className="flex items-center gap-1 text-[var(--color-accent)] text-sm font-bold">
                        <FaStar />
                        {book.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/update-book/${book._id}`}
                        className="flex-1"
                      >
                        <button className="btn-edit w-full flex items-center justify-center gap-1">
                          <IoCreate />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn-delete flex items-center justify-center gap-1"
                      >
                        <IoTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-[var(--color-text-muted)]">
                No books match "{searchQuery}"
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardMyBooks;
