import { useCallback, useEffect, useState, useRef } from "react";
import { FiPlay, FiPause, FiSquare, FiCoffee, FiBriefcase, FiHeadphones, FiWind, FiCloudRain } from "react-icons/fi";
import api from "../../api/axios";
import "./FocusTimer.css";

const MODES = {
  POMODORO: { name: "Pomodoro", time: 25 * 60, icon: <FiBriefcase /> },
  SHORT_BREAK: { name: "Short Break", time: 5 * 60, icon: <FiCoffee /> },
  LONG_BREAK: { name: "Long Break", time: 15 * 60, icon: <FiCoffee /> },
};

const FocusTimer = () => {
  const [mode, setMode] = useState(MODES.POMODORO);
  const [timeLeft, setTimeLeft] = useState(mode.time);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");
  const [selectedHabitId, setSelectedHabitId] = useState("");
  const [habits, setHabits] = useState([]);
  const [ambientSound, setAmbientSound] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch habits so user can map session to a habit
    api.get("/habits").then((res) => {
      setHabits(res.data);
    }).catch(console.error);
  }, []);

  const handleSessionComplete = useCallback(async () => {
    setIsRunning(false);
    if (mode.name === "Pomodoro") {
      try {
        await api.post("/sessions", { 
          habitId: selectedHabitId || null,
          taskName: task || "Deep Work",
          plannedDuration: mode.time / 60,
          actualDuration: mode.time / 60,
          status: "completed"
        });
        alert("🎉 Pomodoro completed! Awesome focus.");
      } catch (err) {
        console.error("Failed to save session", err);
      }
    } else {
      alert("Break is over! Time to get back to work.");
    }
    setMode(MODES.SHORT_BREAK);
    setTimeLeft(MODES.SHORT_BREAK.time);
  }, [mode, selectedHabitId, task]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, handleSessionComplete]);

  const toggleTimer = () => {
    if (!task && mode.name === "Pomodoro" && !isRunning && timeLeft === mode.time) {
      const wantsToContinue = window.confirm("You haven't set a specific task. Setting an intention drastically increases focus. Start anyway?");
      if (!wantsToContinue) return;
    }
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    if (mode.name === "Pomodoro" && timeLeft > 0 && timeLeft < mode.time) {
      const confirmGiveUp = window.confirm("⚠️ Are you sure you want to give up? Your focus session will not be saved.");
      if (!confirmGiveUp) return;
    }
    setIsRunning(false);
    setTimeLeft(mode.time);
  };

  const toggleSound = (sound) => {
    if (ambientSound === sound) {
      setAmbientSound(null);
    } else {
      setAmbientSound(sound);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = ((mode.time - timeLeft) / mode.time) * 100;

  return (
    <div className={`deep-work-card ${isRunning ? "timer-active" : ""}`}>
      
      {/* Left: Progress Ring */}
      <div className="timer-hero-section">
        <div className="timer-display-wrapper">
          <svg className="progress-ring" viewBox="0 0 200 200">
            <circle className="progress-bg" cx="100" cy="100" r="90" />
            <circle
              className="progress-bar"
              cx="100"
              cy="100"
              r="90"
              strokeDasharray="565.48"
              strokeDashoffset={565.48 - (565.48 * progress) / 100}
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>
      </div>

      {/* Middle: Content & Controls */}
      <div className="timer-content-section">
        <div className="timer-modes">
          {Object.values(MODES).map((m) => (
            <button
              key={m.name}
              className={`mode-btn ${mode.name === m.name ? "active" : ""}`}
              onClick={() => {
                if (isRunning) return alert("Stop the current timer first!");
                setMode(m);
                setTimeLeft(m.time);
                setIsRunning(false);
              }}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>

        {mode.name === "Pomodoro" && (
          <div className="task-intention">
            {habits.length > 0 && (
              <select 
                className="habit-selector"
                value={selectedHabitId}
                onChange={(e) => setSelectedHabitId(e.target.value)}
                disabled={isRunning}
              >
                <option value="">-- Uncategorized Session --</option>
                {habits.map(h => (
                  <option key={h._id} value={h._id}>{h.title} ({h.category})</option>
                ))}
              </select>
            )}
            
            <input
              type="text"
              placeholder="What are you focusing on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              disabled={isRunning}
            />
          </div>
        )}

        <div className="timer-controls">
          <button className={`control-btn ${isRunning ? 'pause' : 'play'}`} onClick={toggleTimer}>
            {isRunning ? <FiPause /> : <FiPlay />}
          </button>
          {(isRunning || timeLeft < mode.time) && (
            <button className="control-btn stop" onClick={stopTimer}>
              <FiSquare />
            </button>
          )}
        </div>
      </div>

      {/* Right: Ambient Sounds */}
      <div className="ambient-section">
        <p className="ambient-title"><FiHeadphones /> Focus Sounds</p>
        <button 
          className={`sound-btn ${ambientSound === 'rain' ? 'active' : ''}`}
          onClick={() => toggleSound('rain')}
        >
          <FiCloudRain /> Rain
        </button>
        <button 
          className={`sound-btn ${ambientSound === 'wind' ? 'active' : ''}`}
          onClick={() => toggleSound('wind')}
        >
          <FiWind /> White Noise
        </button>
      </div>

    </div>
  );
};

export default FocusTimer;
