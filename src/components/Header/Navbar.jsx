import { useState } from "react";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, signOutUser, loading } = useContext(AuthContext);
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

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link navbar-link-active" : "navbar-link"
          }
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-books"
          className={({ isActive }) =>
            isActive ? "navbar-link navbar-link-active" : "navbar-link"
          }
          onClick={() => setIsMobileMenuOpen(false)}
        >
          All Books
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/add-book"
              className={({ isActive }) =>
                isActive ? "navbar-link navbar-link-active" : "navbar-link"
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Add Book
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-books"
              className={({ isActive }) =>
                isActive ? "navbar-link navbar-link-active" : "navbar-link"
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Books
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="navbar-brand">
            The Book Haven
          </Link>

          <ul className="hidden lg:flex items-center gap-2">{navLinks}</ul>
 
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 border-4 border-white border-t-[#2C7873] rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                  title={user?.displayName || "User"}
                >
                  <img
                    src={user?.photoURL || ""}
                    alt={user?.displayName}
                    className="w-10 h-10 rounded-full border-2 border-[#2C7873] object-cover hover:border-[#EAE3D8] transition-all"
                  />
                </button>
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="navbar-dropdown z-50">
                      <div className="px-4 py-3 border-b border-[#EAE3D8]">
                        <p className="font-bold text-[#3D3229]">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-sm text-[#6B6B6B]">{user?.email}</p>
                      </div>

                      <Link
                        to="/my-books"
                        className="navbar-dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Books
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="navbar-dropdown-item w-full text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex gap-3">
                <Link to="/login">
                  <button className="btn-primary">Login</button>
                </Link>
                <Link to="/register">
                  <button className="btn-primary">Register</button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <ul className="flex flex-col gap-2">{navLinks}</ul>

            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn-primary w-full">Login</button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn-primary w-full">Register</button>
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
