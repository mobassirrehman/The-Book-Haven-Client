import { useState } from "react";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { IoMdLogOut } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
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

          <div className="flex items-center gap-3 md:gap-6">
            <label className="btn btn-ghost hover:bg-transparent swap swap-rotate lg:hidden">
              <input
                type="checkbox"
                checked={isMobileMenuOpen}
                onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>

            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle hover:bg-transparent"
              aria-label="Toggle theme"
              data-tooltip-id="theme-tooltip"
              data-tooltip-content={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              {theme === "light" ? (
                <MdDarkMode className="text-2xl text-[#3D3229]" />
              ) : (
                <MdLightMode className="text-2xl text-[#F5F0E8]" />
              )}
            </button>
            <Tooltip id="theme-tooltip" place="bottom" />

            {loading ? (
              <div className="w-8 h-8 border-4 border-white border-t-[#2C7873] rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                  data-tooltip-id="user-tooltip"
                  data-tooltip-content={user?.displayName || "User"}
                >
                  <img
                    src={user?.photoURL || ""}
                    alt={user?.displayName}
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#2C7873] object-cover hover:border-[#EAE3D8] transition-all"
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
                      <div className="px-4 py-3 border-b border-[#EAE3D8]">
                        <p className="font-bold text-[#565350]">
                          {user?.displayName || "User"}
                        </p>
                        <p className="text-sm text-[#393937]">{user?.email}</p>
                      </div>

                      <Link
                        to="/my-books"
                        className="navbar-dropdown-item-glass text-[#0c0c0c]"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Books
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="navbar-dropdown-item-glass cursor-pointer flex items-center w-full text-left hover:text-red-800"
                      >
                        <IoMdLogOut className="text-lg mr-1" />
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
