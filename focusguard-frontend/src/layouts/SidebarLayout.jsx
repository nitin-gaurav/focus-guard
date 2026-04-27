import { createElement } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, BarChart3, List, Timer } from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Timer },
  { to: "/add-habit", label: "Habits", icon: List },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function SidebarLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <aside className="hidden md:flex flex-col w-64 bg-[var(--card)] border-r border-[var(--border)] shadow-sm px-4 py-6 sticky top-0 h-screen">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl font-extrabold text-[var(--text)] tracking-tight">FocusGuard</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-[var(--text)] transition-colors hover:bg-[var(--input-bg)] ${location.pathname === to ? "bg-[var(--input-bg)] border border-[var(--border)]" : ""}`}
            >
              {createElement(icon, { size: 20, className: "shrink-0" })}
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 px-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 bg-[var(--bg)] px-3 pb-28 pt-4 md:px-8 md:py-6">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm md:hidden">
          <Link to="/dashboard" className="text-lg font-extrabold tracking-tight text-[var(--text)]">
            FocusGuard
          </Link>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-red-500"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </header>

        <Outlet />
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-2xl md:hidden">
        {navLinks.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold transition-colors ${
              location.pathname === to
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--muted)] hover:bg-[var(--input-bg)]"
            }`}
          >
            {createElement(icon, { size: 19, className: "shrink-0" })}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
