import { Link } from "react-router";
import { BsTelephoneForwardFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { FaXTwitter, FaReddit } from "react-icons/fa6";
import { SiQuora } from "react-icons/si";
import { BsThreads } from "react-icons/bs";
import { IoBookSharp, IoHeart } from "react-icons/io5";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "All Books", path: "/all-books" },
    { name: "Add Book", path: "/add-book" },
    { name: "My Books", path: "/my-books" },
  ];

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Romance",
    "Science Fiction",
  ];

  const socialLinks = [
    { icon: <FaXTwitter />, label: "Twitter", href: "#" },
    { icon: <SiQuora />, label: "Quora", href: "#" },
    { icon: <BsThreads />, label: "Threads", href: "#" },
    { icon: <FaReddit />, label: "Reddit", href: "#" },
  ];

  return (
    <footer className="footer">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                <IoBookSharp className="text-xl text-white" />
              </div>
              <span className="text-2xl font-bold text-white font-[Playfair Display]">
                The Book Haven
              </span>
            </Link>
            <p className="text-white/70 leading-relaxed mb-6">
              Your personal digital library where book lovers come together to
              discover, share, and manage their favorite books.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[var(--color-primary)] transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/all-books?genre=${category}`}
                    className="footer-link"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@bookhaven.com"
                  className="flex items-center gap-3 footer-link"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <IoMdMail />
                  </div>
                  <span>info@bookhaven.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+01601700902"
                  className="flex items-center gap-3 footer-link"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <BsTelephoneForwardFill />
                  </div>
                  <span>+0 (160) 170-0902</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FaLocationDot />
                </div>
                <span>123 Book Street, Philadelphia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-bold text-white mb-3">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-white/70 mb-6">
              Get the latest book recommendations and updates delivered to your
              inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} The Book Haven. All rights reserved.
            </p>

            <p className="flex items-center gap-2 text-white/60 text-sm">
              Made with
              <IoBookSharp className="text-[var(--color-primary)]" />
              and
              <IoHeart className="text-red-400" />
              by TheGrim
            </p>

            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
