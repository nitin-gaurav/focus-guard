import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/login-animation.json";
import "./Login.css";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT: ANIMATION */}
        <div className="login-left">
          <Lottie
            animationData={animationData}
            loop
            className="login-animation"
          />
        </div>

        {/* RIGHT: FORM */}
        <div className="login-right">
          <h1>Sign in</h1>
          <p>Welcome back to FocusGuard</p>

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>

          <div className="login-footer">
            Don’t have an account? <span>Create one</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
