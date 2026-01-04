import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../pages/Dashboard.css";

const StatsPage = ({ title, stats, weeklyData }) => {
  return (
    <>
      <h1 className="dashboard-title">{title}</h1>

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

      {weeklyData && (
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
      )}
    </>
  );
};

export default StatsPage;
