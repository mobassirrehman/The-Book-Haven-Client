import { useContext, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  IoBookSharp,
  IoHomeOutline,
  IoHome,
  IoAddCircleOutline,
  IoAddCircle,
  IoLibraryOutline,
  IoLibrary,
  IoPersonOutline,
  IoPerson,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoChevronBack,
} from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const DashboardLayout = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        toast.success("Logged out successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: IoHomeOutline,
      activeIcon: IoHome,
    },
    {
      name: "My Books",
      path: "/dashboard/my-books",
      icon: IoLibraryOutline,
      activeIcon: IoLibrary,
    },
    {
      name: "Add Book",
      path: "/dashboard/add-book",
      icon: IoAddCircleOutline,
      activeIcon: IoAddCircle,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: IoPersonOutline,
      activeIcon: IoPerson,
    },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="sidebar-header">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <IoBookSharp className="text-xl text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--color-text-primary)] font-[Cormorant_Garamond]">
              Book Haven
            </span>
          </Link>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)]"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        <div className="sidebar-user">
          <img
            src={user?.photoURL || "https://via.placeholder.com/60"}
            alt={user?.displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-primary)]"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--color-text-primary)] truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-nav-label">Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <item.activeIcon className="text-xl" />
                  ) : (
                    <item.icon className="text-xl" />
                  )}
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/"
            className="sidebar-nav-item text-[var(--color-text-secondary)]"
          >
            <IoChevronBack className="text-xl" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="sidebar-nav-item text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
          >
            <IoLogOutOutline className="text-xl" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)]"
          >
            <IoMenuOutline className="text-2xl text-[var(--color-text-primary)]" />
          </button>

          <div className="flex-1"></div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            {theme === "light" ? (
              <MdDarkMode className="text-2xl text-[var(--color-text-secondary)]" />
            ) : (
              <MdLightMode className="text-2xl text-[var(--color-accent)]" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-3 ml-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {user?.displayName}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Member</p>
            </div>
            <img
              src={user?.photoURL || "https://via.placeholder.com/40"}
              alt={user?.displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-border)]"
            />
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
