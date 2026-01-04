import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { FaStar, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import { SiBookstack } from "react-icons/si";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import axios from "axios";

const AllBooks = () => {
  useTitle("All Books");
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || ""
  );
  const [selectedRating, setSelectedRating] = useState(
    searchParams.get("rating") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const ITEMS_PER_PAGE = 8;

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const cardsRef = useRef(null);

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Romance",
    "Science Fiction",
    "Biography",
    "History",
    "Self-Help",
    "Poetry",
  ];

  const ratingOptions = [
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "rating-high", label: "Rating: High to Low" },
    { value: "rating-low", label: "Rating: Low to High" },
    { value: "title-az", label: "Title: A-Z" },
    { value: "title-za", label: "Title: Z-A" },
  ];

  useEffect(() => {
    axios
      .get("https://book-haven-server-neon.vercel.app/books")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
        setLoading(false);
      });
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    if (selectedGenre) {
      result = result.filter((book) => book.genre === selectedGenre);
    }

    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      result = result.filter((book) => book.rating >= minRating);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        break;
      case "rating-high":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "title-az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [books, searchQuery, selectedGenre, selectedRating, sortBy]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedRating, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (selectedRating) params.set("rating", selectedRating);
    if (sortBy && sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedGenre, selectedRating, sortBy, setSearchParams]);

  useEffect(() => {
    if (!loading && books.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current?.children || [], {
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
  }, [loading, books, paginatedBooks]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedRating("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery || selectedGenre || selectedRating || sortBy !== "newest";

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <IoChevronBack />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="pagination-btn"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-[var(--color-text-muted)]">...</span>
            )}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`pagination-btn ${currentPage === num ? "active" : ""}`}
          >
            {num}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-[var(--color-text-muted)]">...</span>
            )}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="pagination-btn"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          <IoChevronForward />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="books-page">
        <div className="container-custom">
          <SkeletonLoader type="table" />
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="books-page">
        <div className="container-custom">
          <div className="empty-state">
            <div className="empty-state-icon flex justify-center">
              <SiBookstack />
            </div>
            <h2 className="empty-state-text">No Books in the Library Yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Be the first to add a book to our collection!
            </p>
            <Link to="/dashboard/add-book">
              <button className="btn-primary">Add Your First Book</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="container-custom">
        <div ref={headerRef} className="books-header">
          <h1 className="books-page-title">All Books</h1>
          <p className="books-page-subtitle">
            Browse our complete collection of {books.length} books
          </p>
        </div>

        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="search-input"
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

          <div className="hidden md:flex gap-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="filter-select"
            >
              <option value="">All Ratings</option>
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden btn-ghost flex items-center gap-2 border border-[var(--color-border)] rounded-lg px-4 py-3"
          >
            <HiAdjustmentsHorizontal /> Filters
          </button>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-[var(--color-text-muted)]">
              Active filters:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[var(--color-primary)] text-white">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}

            {selectedGenre && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[var(--color-primary)] text-white">
                {selectedGenre}
                <button onClick={() => setSelectedGenre("")}>
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}

            {selectedRating && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[var(--color-primary)] text-white">
                {selectedRating}+ Stars
                <button onClick={() => setSelectedRating("")}>
                  <FaTimes className="text-xs" />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-[var(--color-primary)] hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="mb-6 text-[var(--color-text-secondary)]">
          Showing {paginatedBooks.length} of {filteredBooks.length} books
          {filteredBooks.length !== books.length &&
            ` (filtered from ${books.length})`}
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <FaSearch className="text-6xl text-[var(--color-text-muted)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              No books found
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div ref={tableRef} className="table-container">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book) => (
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
                      <td className="text-[var(--color-text-secondary)]">
                        {book.author}
                      </td>
                      <td>
                        <span className="genre-badge">{book.genre}</span>
                      </td>
                      <td>
                        <div className="rating-display">
                          <FaStar />
                          <span>{book.rating}</span>
                        </div>
                      </td>
                      <td>
                        <Link to={`/book/${book._id}`}>
                          <button className="btn-update cursor-pointer">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div ref={cardsRef} className="mobile-cards-container">
              {paginatedBooks.map((book) => (
                <div key={book._id} className="book-card-mobile">
                  <div className="flex gap-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="book-card-mobile-img"
                    />
                    <div className="flex-1">
                      <Link to={`/book/${book._id}`}>
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 hover:text-[var(--color-primary)]">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                        by {book.author}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="genre-badge">{book.genre}</span>
                        <div className="rating-display text-sm">
                          <FaStar />
                          <span>{book.rating}</span>
                        </div>
                      </div>
                      <Link to={`/book/${book._id}`}>
                        <button className="btn-update w-full cursor-pointer">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination />
          </>
        )}

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-bg-card)] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Filters
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)]"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="filter-select w-full"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Minimum Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="filter-select w-full"
                  >
                    <option value="">All Ratings</option>
                    {ratingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-text-primary)]">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="filter-select w-full"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 rounded-lg border-2 border-[var(--color-border)] font-semibold"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
