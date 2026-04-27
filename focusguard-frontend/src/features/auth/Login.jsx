import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import { FiMail, FiLock } from "react-icons/fi";
import animationData from "../../assets/login-animation.json";
import "./Login.css";
import api from "../../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill all fields");

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Dynamic Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>

      <div className="login-card">
        <div className="login-card-left">
          <Lottie animationData={animationData} loop className="login-lottie" />
          <div className="login-brand">
            <h2>FocusGuard</h2>
            <p>Your personal productivity sanctuary.</p>
          </div>
        </div>

        <div className="login-card-right">
          <div className="login-header">
            <h1>Welcome Back 👋</h1>
            <p>Please enter your details to sign in.</p>
          </div>

          {error && <div className="login-alert">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="login-footer-text">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;