import { useContext, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  useTitle("Login");
  const [showPassword, setShowPassword] = useState(false);
  const { signInUser, signInWithGoogle, setLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  const from = location.state || "/";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(titleRef.current.children, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.fromTo(
        formRef.current.children,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then(() => {
        setLoading(false);
        toast.success("Welcome back to The Book Haven!");
        navigate(from);
      })
      .catch((error) => {
        setLoading(false);
        
        if (error.code === "auth/invalid-credential") {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
          toast.error("No account found with this email.");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Incorrect password. Please try again.");
        } else if (error.code === "auth/too-many-requests") {
          toast.error("Too many failed attempts. Please try again later.");
        } else if (error.code === "auth/network-request-failed") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Login failed. Please try again.");
        }
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(() => {
        setLoading(false);
        toast.success("Welcome back to The Book Haven!");
        navigate(from);
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === "auth/popup-closed-by-user") {
          toast.error("Sign-in cancelled");
        } else if (error.code === "auth/network-request-failed") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Google sign-in failed. Please try again.");
        }
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div ref={cardRef} className="auth-card">
          <div ref={titleRef}>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Login to access your library</p>
          </div>

          <form ref={formRef} onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                ref={emailRef}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? (
                    <AiOutlineEye className="text-xl" />
                  ) : (
                    <AiOutlineEyeInvisible className="text-xl" />
                  )}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="forget-password">Forgot Password?</span>
            </div>

            <button type="submit" className="btn-auth">
              Login
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn-google"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;