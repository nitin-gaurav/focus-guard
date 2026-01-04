import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import "./Dashboard.css";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await api.get("/analytics");
      setStats(res.data.stats);
    };

    fetchAnalytics();
  }, []);

  if (!stats) return null;

  return (
    <DashboardLayout>
      <h1 className="dashboard-title">Analytics</h1>

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
    </DashboardLayout>
  );
};

export default Analytics;
