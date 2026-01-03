import { useContext, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoBookSharp } from "react-icons/io5";

const Login = () => {
  useTitle("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInUser, signInWithGoogle, setLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  const from = location.state || "/";

  const DEMO_EMAIL = "demo@bookhaven.com";
  const DEMO_PASSWORD = "Demo@123";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(titleRef.current?.children || [], {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.fromTo(
        formRef.current?.children || [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.4,
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const fillDemoCredentials = () => {
    if (emailRef.current && passwordRef.current) {
      emailRef.current.value = DEMO_EMAIL;
      passwordRef.current.value = DEMO_PASSWORD;

      gsap.fromTo(
        [emailRef.current, passwordRef.current],
        { backgroundColor: "rgba(44, 120, 115, 0.1)" },
        { backgroundColor: "transparent", duration: 0.5 }
      );

      toast.success("Demo credentials filled! Click Login to continue.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      setLoading(false);
      toast.success("Welcome back to The Book Haven!");
      navigate(from);
    } catch (error) {
      setLoading(false);
      setIsLoading(false);

      const errorMessages = {
        "auth/invalid-credential":
          "Invalid email or password. Please try again.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/too-many-requests":
          "Too many failed attempts. Please try again later.",
        "auth/network-request-failed":
          "Network error. Please check your connection.",
      };

      toast.error(
        errorMessages[error.code] || "Login failed. Please try again."
      );
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      setLoading(false);
      toast.success("Welcome back to The Book Haven!");
      navigate(from);
    } catch (error) {
      setLoading(false);
      setIsLoading(false);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in cancelled");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div ref={cardRef} className="auth-card">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
              <IoBookSharp className="text-3xl text-white" />
            </div>
          </div>

          <div ref={titleRef}>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to access your personal library
            </p>
          </div>

          <form ref={formRef} onSubmit={handleLogin} className="auth-form">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="btn-demo"
            >
              <HiOutlineSparkles className="text-xl" />
              Use Demo Credentials
            </button>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                ref={emailRef}
                className="form-input"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  ref={passwordRef}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Remember me
                </span>
              </label>
              <span className="text-sm text-[var(--color-primary)] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="btn-auth" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">or continue with</span>
              <div className="divider-line"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn-google"
              disabled={isLoading}
            >
              <FcGoogle className="text-2xl" />
              Google
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
