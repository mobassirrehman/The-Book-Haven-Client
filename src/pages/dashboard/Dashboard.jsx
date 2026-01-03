import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import useTitle from "../../hooks/useTitle";
import axios from "axios";
import {
  IoBookSharp,
  IoStarSharp,
  IoTrendingUp,
  IoAdd,
  IoEye,
} from "react-icons/io5";
import { FaComments } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Legend,
} from "recharts";

const Dashboard = () => {
  useTitle("Dashboard");
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalBooks: 0,
    myBooks: 0,
    avgRating: 0,
    totalComments: 0,
  });
  const [myBooks, setMyBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBooksRes = await axios.get(
          "https://book-haven-server-neon.vercel.app/books"
        );
        setAllBooks(allBooksRes.data);

        if (user?.email) {
          const myBooksRes = await axios.get(
            `https://book-haven-server-neon.vercel.app/books/user/${user.email}`
          );
          setMyBooks(myBooksRes.data);

          const myBooksData = myBooksRes.data;
          const avgRating =
            myBooksData.length > 0
              ? (
                  myBooksData.reduce((sum, book) => sum + book.rating, 0) /
                  myBooksData.length
                ).toFixed(1)
              : 0;

          setStats({
            totalBooks: allBooksRes.data.length,
            myBooks: myBooksData.length,
            avgRating: avgRating,
            totalComments: Math.floor(Math.random() * 50) + 10,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const genreData = allBooks.reduce((acc, book) => {
    const existing = acc.find((item) => item.name === book.genre);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: book.genre, value: 1 });
    }
    return acc;
  }, []);

  const ratingDistribution = [
    { rating: "5 ★", count: allBooks.filter((b) => b.rating >= 4.5).length },
    {
      rating: "4 ★",
      count: allBooks.filter((b) => b.rating >= 3.5 && b.rating < 4.5).length,
    },
    {
      rating: "3 ★",
      count: allBooks.filter((b) => b.rating >= 2.5 && b.rating < 3.5).length,
    },
    {
      rating: "2 ★",
      count: allBooks.filter((b) => b.rating >= 1.5 && b.rating < 2.5).length,
    },
    { rating: "1 ★", count: allBooks.filter((b) => b.rating < 1.5).length },
  ];

  const COLORS = [
    "#2C7873",
    "#3D3229",
    "#D4A853",
    "#6B5D52",
    "#1F5B57",
    "#E5C77A",
  ];

  const statsCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: <IoBookSharp />,
      color: "primary",
      description: "In the library",
    },
    {
      title: "My Books",
      value: stats.myBooks,
      icon: <IoBookSharp />,
      color: "secondary",
      description: "Added by you",
    },
    {
      title: "Avg Rating",
      value: stats.avgRating,
      icon: <IoStarSharp />,
      color: "accent",
      description: "Of your books",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: <FaComments />,
      color: "info",
      description: "Total interactions",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-xl"></div>
          <div className="skeleton h-80 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2 font-[Cormorant_Garamond]">
          Welcome back, {user?.displayName?.split(" ")[0] || "Reader"}!
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Here's what's happening with your book collection today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card-dashboard">
            <div className={`stat-icon-dashboard ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-value-dashboard">{stat.value}</p>
              <p className="stat-title-dashboard">{stat.title}</p>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="chart-card">
          <h3 className="chart-title">Books by Genre</h3>
          {genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {genreData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-[var(--color-text-muted)]">
              No data available
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis type="number" stroke="var(--color-text-muted)" />
              <YAxis
                dataKey="rating"
                type="category"
                stroke="var(--color-text-muted)"
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#2C7873" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="chart-card">
          <h3 className="chart-title">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/dashboard/add-book" className="quick-action-btn primary">
              <IoAdd className="text-xl" />
              <span>Add New Book</span>
            </Link>
            <Link
              to="/dashboard/my-books"
              className="quick-action-btn secondary"
            >
              <IoEye className="text-xl" />
              <span>View My Books</span>
            </Link>
            <Link to="/all-books" className="quick-action-btn outline">
              <IoBookSharp className="text-xl" />
              <span>Browse All Books</span>
            </Link>
          </div>
        </div>

        <div className="chart-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="chart-title mb-0">Your Recent Books</h3>
            <Link
              to="/dashboard/my-books"
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          {myBooks.length > 0 ? (
            <div className="space-y-3">
              {myBooks.slice(0, 4).map((book) => (
                <div key={book._id} className="recent-book-item">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--color-text-primary)] truncate">
                      {book.title}
                    </h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {book.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-accent)]">
                    <IoStarSharp />
                    <span className="font-semibold">{book.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IoBookSharp className="text-5xl text-[var(--color-text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--color-text-muted)] mb-4">
                You haven't added any books yet
              </p>
              <Link to="/dashboard/add-book" className="btn-primary text-sm">
                Add Your First Book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
