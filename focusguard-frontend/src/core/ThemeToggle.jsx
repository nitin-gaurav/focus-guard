import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle color theme"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 40,
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        cursor: "pointer",
        background: "var(--card)",
        color: "var(--text)",
        boxShadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
      }}
    >
      {dark ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeToggle;
