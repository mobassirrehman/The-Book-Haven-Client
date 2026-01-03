import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoBookSharp, IoCheckmarkCircle } from "react-icons/io5";

const Register = () => {
  useTitle("Register");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createUser, updateUserProfile, setLoading, signInWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

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

  const passwordRules = [
    { label: "At least 6 characters", test: (p) => p.length >= 6 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    {
      label: "One special character",
      test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.test(password));

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements");
      return;
    }

    setIsLoading(true);
    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;

    try {
      await createUser(email, password);
      await updateUserProfile(name, photo);
      setLoading(false);
      toast.success("Welcome to The Book Haven!");
      navigate("/");
    } catch (error) {
      setLoading(false);
      setIsLoading(false);

      const errorMessages = {
        "auth/email-already-in-use":
          "This email is already registered. Please login.",
        "auth/invalid-email": "Invalid email format",
        "auth/network-request-failed":
          "Network error. Please check your connection.",
      };

      toast.error(
        errorMessages[error.code] || "Registration failed. Please try again."
      );
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      setLoading(false);
      toast.success("Welcome to The Book Haven!");
      navigate("/");
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join our community of book lovers today
            </p>
          </div>

          <form ref={formRef} onSubmit={handleRegister} className="auth-form">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="btn-google"
              disabled={isLoading}
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">or register with email</span>
              <div className="divider-line"></div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL</label>
              <input
                type="url"
                name="photo"
                className="form-input"
                placeholder="https://example.com/your-photo.jpg"
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
                  className="form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {password && (
                <div className="mt-3 space-y-1">
                  {passwordRules.map((rule, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        rule.test(password)
                          ? "text-green-600"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <IoCheckmarkCircle
                        className={
                          rule.test(password) ? "opacity-100" : "opacity-30"
                        }
                      />
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text-secondary)]">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="btn-auth"
              disabled={isLoading || !isPasswordValid}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
