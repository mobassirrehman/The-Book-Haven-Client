import { Link } from "react-router";
import useTitle from "../hooks/useTitle";
import { IoHomeOutline, IoSearchOutline, IoBookOutline } from "react-icons/io5";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const NotFound = () => {
  useTitle("Page Not Found");

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".error-code", {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      gsap.from(".error-text", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".error-actions", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.7,
        ease: "power3.out",
      });

      gsap.to(".floating-book", {
        y: -15,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.3,
          from: "random",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative mb-8">
          <div className="flex justify-center items-end gap-2 mb-4">
            <div className="floating-book w-8 h-12 rounded bg-[var(--color-primary)] opacity-60"></div>
            <div className="floating-book w-10 h-16 rounded bg-[var(--color-accent)] opacity-70"></div>
            <div className="floating-book w-8 h-14 rounded bg-[var(--color-secondary)] opacity-60"></div>
          </div>

          <h1 className="error-code text-[150px] md:text-[200px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]">
            404
          </h1>
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="error-text text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
            Oops! Page Not Found
          </h2>
          <p className="error-text text-lg text-[var(--color-text-secondary)] max-w-md mx-auto">
            The page you're looking for seems to have wandered off into another
            chapter. Let's get you back on track.
          </p>
        </div>

        <div className="error-actions flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <button className="btn-primary flex items-center gap-2 min-w-[180px]">
              <IoHomeOutline className="text-xl" />
              Back to Home
            </button>
          </Link>
          <Link to="/all-books">
            <button className="btn-outline flex items-center gap-2 min-w-[180px]">
              <IoBookOutline className="text-xl" />
              Browse Books
            </button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/"
              className="text-[var(--color-primary)] hover:underline"
            >
              Home
            </Link>
            <span className="text-[var(--color-border)]">•</span>
            <Link
              to="/all-books"
              className="text-[var(--color-primary)] hover:underline"
            >
              All Books
            </Link>
            <span className="text-[var(--color-border)]">•</span>
            <Link
              to="/about"
              className="text-[var(--color-primary)] hover:underline"
            >
              About Us
            </Link>
            <span className="text-[var(--color-border)]">•</span>
            <Link
              to="/contact"
              className="text-[var(--color-primary)] hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;