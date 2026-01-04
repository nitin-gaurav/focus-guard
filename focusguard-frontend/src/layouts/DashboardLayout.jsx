import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBarChart2,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">FocusGuard</h2>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          {/* Analytics */}
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FiBarChart2 />
            <span>Analytics</span>
          </NavLink>

          {/* Add Habit */}
          <NavLink
            to="/add-habit"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FiPlusCircle />
            <span>Add Habit</span>
          </NavLink>

          {/* Logout */}
          <div className="nav-link logout" onClick={logout}>
            <FiLogOut />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
