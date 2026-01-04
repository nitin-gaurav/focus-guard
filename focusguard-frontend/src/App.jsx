import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddHabit from "./pages/AddHabit";
import Analytics from "./pages/Analytics";

const App = () => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <>
      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {dark ? "🌙 Dark" : "☀️ Light"}
      </button>

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          {token ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-habit" element={<AddHabit />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
