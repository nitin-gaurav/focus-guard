import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatsPage from "./StatsPage";

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics");
        setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!stats) return null;

  return (
    <div className="dashboard">
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
    </div>
  );
};

export default Analytics;
