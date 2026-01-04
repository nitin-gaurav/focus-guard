import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await api.get("/analytics");
      setStats(res.data.stats);
      setWeeklyData(res.data.weekly);
    };

    fetchDashboard();
  }, []);

  if (!stats) return null;

  return (
    <DashboardLayout>
      <h1 className="dashboard-title">Dashboard</h1>

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
    </DashboardLayout>
  );
};

export default Dashboard;
