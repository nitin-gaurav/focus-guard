import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Dashboard from "./features/dashboard/Dashboard";
import SidebarLayout from "./layouts/SidebarLayout";
import ProtectedRoute from "./core/ProtectedRoute";
import ThemeToggle from "./core/ThemeToggle";
import AddHabit from "./features/habits/AddHabit";
import Analytics from "./features/analytics/Analytics";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Global theme toggle available on all pages */}
        <ThemeToggle />
        
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-habit" element={<AddHabit />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;