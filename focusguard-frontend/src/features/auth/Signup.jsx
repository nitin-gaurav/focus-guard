import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import "./Signup.css";
import api from "../../api/axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;
    
    if (!email || !password || !confirmPassword) {
      return setError("Please fill all fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/register", { email, password });
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Dynamic Animated Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join us today and unlock your potential.</p>
        </div>

        {error && <div className="signup-error">{error}</div>}

        <form onSubmit={handleSignup} className="signup-form">
          <div className="signup-input-container">
            <FiMail className="signup-icon" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="signup-input-container">
            <FiLock className="signup-icon" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="signup-input-container">
            <FiCheckCircle className="signup-icon" />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-footer">
          Already a member? <Link to="/login" className="signup-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
