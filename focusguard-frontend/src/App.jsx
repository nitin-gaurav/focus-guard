import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AddHabit from "./pages/AddHabit";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
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
          zIndex: 1000,
        }}
      >
        {dark ? "🌙 Dark" : "☀️ Light"}
      </button>

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected + Layout (ONLY ONCE) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/add-habit" element={<AddHabit />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
