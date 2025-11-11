import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import useTitle from "../hooks/useTitle";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  useTitle("Register");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { createUser, updateUserProfile, setLoading, signInWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

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
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const validatePassword = (password) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

    if (!password) {
      setPasswordError("");
      return false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }

    if (!uppercaseRegex.test(password)) {
      setPasswordError("Must include at least one uppercase letter");
      return false;
    }

    if (!lowercaseRegex.test(password)) {
      setPasswordError("Must include at least one lowercase letter");
      return false;
    }

    if (!specialCharRegex.test(password)) {
      setPasswordError(
        "Must include at least one special character (!@#$%^&*...)"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e) => {
    validatePassword(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!validatePassword(password)) {
      return;
    }

    createUser(email, password)
      .then(() => {
        return updateUserProfile(name, photo);
      })
      .then(() => {
        setLoading(false);
        toast.success("Registration successful! Welcome to The Book Haven!");
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);

        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already registered. Please login.");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Invalid email format");
        } else if (error.code === "auth/network-request-failed") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      });
  };

  const handleGoogleRegister = () => {
    signInWithGoogle()
      .then(() => {
        setLoading(false);
        toast.success("Registration successful! Welcome to The Book Haven!");
        navigate("/");
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join The Book Haven community</p>
          </div>

          <form ref={formRef} onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL</label>
              <input
                type="url"
                name="photo"
                className="form-input"
                placeholder="Enter photo URL"
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
                  placeholder="Create a password"
                  onChange={handlePasswordChange}
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

              <p className="error-message">{passwordError}</p>
            </div>

            <button type="submit" className="btn-auth">
              Create Account
            </button>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              className="btn-google"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
