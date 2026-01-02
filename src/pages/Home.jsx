import { useEffect, useRef, useState } from "react";
import useTitle from "../hooks/useTitle";
import { Link } from "react-router";
import toast from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IoBookSharp,
  IoLibrary,
  IoSearch,
  IoHeart,
  IoChevronDown,
  IoChevronUp,
  IoStar,
  IoPeople,
  IoBookmark,
  IoTrendingUp,
} from "react-icons/io5";
import { GiBookshelf, GiSpellBook, GiLovers } from "react-icons/gi";
import {
  MdMenuBook,
  MdAutoStories,
  MdRateReview,
  MdEmail,
} from "react-icons/md";
import {
  FaUserSecret,
  FaMagic,
  FaRocket,
  FaStar,
  FaQuoteLeft,
  FaUsers,
  FaBookReader,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useTitle("Home");

  const [latestBooks, setLatestBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState("");

  const bannerImages = [
    "https://i.ibb.co.com/PkLY22P/library-9.jpg",
    "https://i.ibb.co.com/WNVSHCs7/library-7.jpg",
  ];

  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://book-haven-server-neon.vercel.app/books")
      .then((response) => {
        const sorted = response.data.sort(
          (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
        );
        setLatestBooks(sorted.slice(0, 8));
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
      .get("https://book-haven-server-neon.vercel.app/books/top-rated")
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
      .to(slide2Ref.current, { opacity: 1, duration: 2, ease: "power2.inOut" })
      .to({}, { duration: 6 })
      .to(slide2Ref.current, { opacity: 0, duration: 2, ease: "power2.inOut" });

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (statsRef.current) {
      const counters = statsRef.current.querySelectorAll(".stat-number");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: counter,
              start: "top 80%",
              once: true,
            },
          }
        );
      });
    }
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  const genres = [
    { name: "Fiction", icon: <IoBookSharp />, count: "2.5K+" },
    { name: "Non-Fiction", icon: <MdMenuBook />, count: "1.8K+" },
    { name: "Mystery", icon: <FaUserSecret />, count: "950+" },
    { name: "Fantasy", icon: <FaMagic />, count: "1.2K+" },
    { name: "Romance", icon: <GiLovers />, count: "1.5K+" },
    { name: "Sci-Fi", icon: <FaRocket />, count: "800+" },
  ];

  const stats = [
    { icon: <IoLibrary />, number: 5000, label: "Books Available" },
    { icon: <FaUsers />, number: 2500, label: "Active Readers" },
    { icon: <MdRateReview />, number: 12000, label: "Reviews Written" },
    {
      icon: <IoTrendingUp />,
      number: 98,
      label: "% Satisfaction",
      suffix: "%",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up for free and join our community of book lovers",
      icon: <FaUsers />,
    },
    {
      step: 2,
      title: "Browse & Discover",
      description: "Explore thousands of books across various genres",
      icon: <IoSearch />,
    },
    {
      step: 3,
      title: "Add to Collection",
      description: "Build your personal library with your favorite books",
      icon: <IoBookmark />,
    },
    {
      step: 4,
      title: "Share & Review",
      description: "Connect with others and share your reading experiences",
      icon: <IoHeart />,
    },
  ];

  const testimonials = [
    {
      text: "The Book Haven transformed how I discover new books. The recommendations are spot-on, and the community is incredibly welcoming.",
      author: "Sarah Mitchell",
      role: "Book Club Organizer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      text: "I've been using this platform for a year now. It's become my go-to place for tracking my reading progress and finding hidden gems.",
      author: "James Parker",
      role: "Avid Reader",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      text: "Finally, a platform that understands book lovers! The interface is beautiful, and managing my collection has never been easier.",
      author: "Emily Chen",
      role: "Literature Student",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How do I add a book to my collection?",
      answer:
        "Simply log in to your account, navigate to 'Add Book', and fill in the book details including title, author, genre, and cover image. You can either upload an image or provide a URL.",
    },
    {
      question: "Can I edit or delete books I've added?",
      answer:
        "Yes! Go to 'My Books' to see all books you've added. From there, you can update any book's information or remove it from your collection.",
    },
    {
      question: "Is The Book Haven free to use?",
      answer:
        "Absolutely! The Book Haven is completely free. Create an account and start building your digital library today.",
    },
    {
      question: "How do ratings work?",
      answer:
        "You can rate books from 1 to 5 stars. These ratings help other users discover highly-rated books and contribute to our Top Rated section.",
    },
    {
      question: "Can I connect with other readers?",
      answer:
        "Yes! You can leave comments on books and engage with other readers' reviews. We're also working on adding more social features soon.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="banner">
        <div className="banner-slider">
          <div ref={slide1Ref} className="banner-slide">
            <img src={bannerImages[0]} alt="Library" />
          </div>
          <div ref={slide2Ref} className="banner-slide">
            <img src={bannerImages[1]} alt="Books" />
          </div>
        </div>

        <div className="banner-overlay"></div>

        <div className="container-custom">
          <div className="banner-content">
            <h1 className="banner-title">Welcome to The Book Haven</h1>
            <p className="banner-subtitle">
              Your personal digital library where book lovers come together to
              discover, share, and celebrate the joy of reading.
            </p>

            <div className="banner-buttons">
              <Link to="/all-books">
                <button className="btn-banner flex items-center gap-2">
                  Explore Books <BsArrowRight />
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-banner-outline">Join Free</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <IoChevronDown className="text-white text-3xl animate-bounce" />
        </div>
      </section>

      <section ref={statsRef} className="section section-gradient py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon flex justify-center">{stat.icon}</div>
                <div className="stat-number" data-target={stat.number}>
                  0
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <h2 className="section-title">Latest Additions</h2>
          <p className="section-subtitle">
            Discover the newest books added to our growing collection
          </p>

          {loading ? (
            <SkeletonLoader type="cards" />
          ) : latestBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="empty-state-icon flex justify-center">
                <IoBookSharp />
              </div>
              <p className="text-xl text-[var(--color-text-secondary)] mb-6">
                No books in the library yet.
              </p>
              <Link to="/add-book">
                <button className="btn-primary">Add the First Book</button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestBooks.map((book) => (
                  <Link to={`/book/${book._id}`} key={book._id}>
                    <div className="book-card h-full">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="book-card-img"
                      />
                      <div className="book-card-body">
                        <h3 className="book-card-title">{book.title}</h3>
                        <p className="book-card-author">by {book.author}</p>
                        <div className="book-card-meta">
                          <span className="book-card-genre">{book.genre}</span>
                          <span className="book-card-rating">
                            <FaStar /> {book.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/all-books">
                  <button className="btn-primary">
                    View All Books <BsArrowRight />
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-custom">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started with The Book Haven in just a few simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="how-it-works-card">
                  <div className="step-number">{item.step}</div>
                  <div className="step-icon">{item.icon}</div>
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-description">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <BsArrowRight className="text-[var(--color-primary)] text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-custom">
          <h2 className="section-title section-title-light">Top Rated Books</h2>
          <p className="section-subtitle section-subtitle-light">
            Discover the highest-rated books loved by our community
          </p>

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
              {topRatedBooks.map((book, index) => (
                <Link to={`/book/${book._id}`} key={book._id}>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 border border-white/10 group">
                    <div className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold bg-[var(--color-accent)] text-[var(--color-secondary)]">
                      #{index + 1}
                    </div>

                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="p-6 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        by {book.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {book.genre}
                        </span>
                        <span className="flex items-center gap-1 text-[var(--color-accent)] font-bold text-lg">
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

      <section className="section">
        <div className="container-custom">
          <h2 className="section-title">Explore by Genre</h2>
          <p className="section-subtitle">
            Find your next favorite book in your preferred category
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {genres.map((genre) => (
              <Link to={`/all-books?genre=${genre.name}`} key={genre.name}>
                <div className="genre-card">
                  <div className="genre-icon flex justify-center">{genre.icon}</div>
                  <h3 className="genre-name">{genre.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {genre.count} books
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-custom">
          <h2 className="section-title">What Readers Say</h2>
          <p className="section-subtitle">
            Join thousands of happy book lovers who trust The Book Haven
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <FaQuoteLeft className="text-3xl text-[var(--color-primary)] opacity-30 mb-4" />
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-[var(--color-accent)]" />
                  ))}
                </div>
                <div className="testimonial-author">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="testimonial-avatar"
                  />
                  <div>
                    <div className="testimonial-name">{testimonial.author}</div>
                    <div className="testimonial-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-3xl">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? We've got answers</p>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item"
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  {openFaq === index ? (
                    <IoChevronUp className="text-[var(--color-primary)]" />
                  ) : (
                    <IoChevronDown className="text-[var(--color-text-muted)]" />
                  )}
                </div>
                {openFaq === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-custom text-center">
          <MdEmail className="text-6xl text-[var(--color-accent-light)] mx-auto mb-6" />
          <h2 className="section-title section-title-light">Stay Updated</h2>
          <p className="section-subtitle section-subtitle-light">
            Subscribe to our newsletter for book recommendations, new features,
            and reading tips
          </p>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>

          <p className="text-white/50 text-sm mt-4">
            No spam, unsubscribe anytime
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <HiSparkles className="text-6xl text-[var(--color-accent)] mx-auto mb-6" />
            <h2 className="section-title">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="section-subtitle">
              Join our community of book lovers today and discover your next
              favorite read. It's completely free!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <button className="btn-primary flex items-center gap-2">
                  Create Free Account <BsArrowRight />
                </button>
              </Link>
              <Link to="/all-books">
                <button className="btn-outline">Browse Books</button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10 text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <BsCheckCircleFill className="text-[var(--color-primary)]" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <BsCheckCircleFill className="text-[var(--color-primary)]" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <BsCheckCircleFill className="text-[var(--color-primary)]" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
