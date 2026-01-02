import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { IoMdLogOut } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { IoBookSharp, IoMenu, IoClose } from "react-icons/io5";
import { FiUser, FiBook, FiSettings } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const Navbar = () => {
  const { user, signOutUser, loading } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        toast.success("Logged out successfully!");
        setIsDropdownOpen(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "All Books", path: "/all-books" },
  ];

  const privateLinks = [
    { name: "Add Book", path: "/add-book" },
    { name: "My Books", path: "/my-books" },
  ];

  const NavLinks = () => (
    <>
      {publicLinks.map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              isActive ? "navbar-link navbar-link-active" : "navbar-link"
            }
            onClick={closeMobileMenu}
          >
            {link.name}
          </NavLink>
        </li>
      ))}
      {user &&
        privateLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive ? "navbar-link navbar-link-active" : "navbar-link"
              }
              onClick={closeMobileMenu}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
    </>
  );

  return (
    <nav className="navbar">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
              <IoBookSharp className="text-xl text-white" />
            </div>
            <span className="navbar-brand hidden sm:block">The Book Haven</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            <NavLinks />
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <IoClose className="text-2xl text-[var(--color-text-primary)]" />
              ) : (
                <IoMenu className="text-2xl text-[var(--color-text-primary)]" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label="Toggle theme"
              data-tooltip-id="theme-tooltip"
              data-tooltip-content={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              {theme === "light" ? (
                <MdDarkMode className="text-2xl text-[var(--color-text-secondary)]" />
              ) : (
                <MdLightMode className="text-2xl text-[var(--color-accent)]" />
              )}
            </button>
            <Tooltip id="theme-tooltip" place="bottom" />

            {loading ? (
              <div className="w-10 h-10 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                  data-tooltip-id="user-tooltip"
                  data-tooltip-content={user?.displayName || "User"}
                >
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/40"}
                    alt={user?.displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)] hover:border-[var(--color-primary-light)] transition-all"
                  />
                </button>
                <Tooltip id="user-tooltip" place="bottom" />

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>

                    <div className="navbar-dropdown-glass z-50">
                      {/* User Info */}
                      <div className="px-4 py-4 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user?.photoURL || "https://via.placeholder.com/40"
                            }
                            alt={user?.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[var(--color-text-primary)] truncate">
                              {user?.displayName || "User"}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)] truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/my-books"
                          className="navbar-dropdown-item-glass"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiBook className="text-lg mr-3" />
                          My Books
                        </Link>
                        <Link
                          to="/add-book"
                          className="navbar-dropdown-item-glass"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiUser className="text-lg mr-3" />
                          Add New Book
                        </Link>
                      </div>

                      <div className="border-t border-[var(--color-border)] py-2">
                        <button
                          onClick={handleSignOut}
                          className="navbar-dropdown-item-glass logout w-full"
                        >
                          <IoMdLogOut className="text-lg mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login">
                  <button className="btn-ghost">Sign In</button>
                </Link>
                <Link to="/register">
                  <button className="btn-primary text-sm px-4 py-2">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] py-4">
            <ul className="flex flex-col gap-1">
              <NavLinks />
            </ul>

            {!user && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
                <Link to="/login" onClick={closeMobileMenu}>
                  <button className="w-full py-3 rounded-lg border-2 border-[var(--color-border)] font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="btn-primary w-full">Get Started</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
