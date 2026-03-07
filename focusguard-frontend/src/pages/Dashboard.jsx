import { useEffect, useState } from "react";

import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";
import FocusTimer from "../components/FocusTimer";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/analytics");
        setStats(res.data.stats);
        setWeeklyData(res.data.weekly);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) return null;

  return (
    <div className="dashboard">
      {/* Page Title */}
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h4>Success Rate</h4>
          <p>{stats.successRate}%</p>
        </div>

        <div className="card">
          <h4>Focus Sessions</h4>
          <p>{stats.sessions}</p>
        </div>

        <div className="card">
          <h4>Focus Time</h4>
          <p>{stats.focusTime} hrs</p>
        </div>
      </div>

      {/* Weekly Focus Chart */}
      <div className="chart-container">
        <h3>Weekly Focus</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Focus Timer */}
      <FocusTimer />
    </div>
  );
};

export default Dashboard;
