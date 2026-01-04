import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./FocusTimer.css";

const FocusTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && !paused) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [running, paused]);

  const start = () => {
    setRunning(true);
    setPaused(false);
  };

  const pause = () => {
    setPaused(true);
    clearInterval(intervalRef.current);
  };

  const resume = () => {
    setPaused(false);
  };

  const stop = async () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPaused(false);

    const minutes = Math.round(seconds / 60);

    if (minutes > 0) {
      await api.post("/sessions", { duration: minutes });
      alert("Focus session saved");
    }

    setSeconds(0);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="timer-card">
      <h3>Focus Timer</h3>

      <div className="timer-display">
        {mm}:{ss}
      </div>

      <div className="timer-actions">
        {!running && (
          <button className="start" onClick={start}>
            Start
          </button>
        )}

        {running && !paused && (
          <button className="pause" onClick={pause}>
            Pause
          </button>
        )}

        {running && paused && (
          <button className="resume" onClick={resume}>
            Resume
          </button>
        )}

        {running && (
          <button className="stop" onClick={stop}>
            Stop & Save
          </button>
        )}
      </div>
    </div>
  );
};

export default FocusTimer;
