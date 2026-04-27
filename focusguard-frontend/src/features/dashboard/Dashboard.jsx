import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Flame,
  ListChecks,
  Plus,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
} from "lucide-react";
import api from "../../api/axios";
import FocusTimer from "../timer/FocusTimer";

const defaultStats = { successRate: 0, sessions: 0, focusTime: 0 };
const defaultHabits = [
  { _id: "demo-1", title: "Deep Work", category: "Work", targetMinutesPerWeek: 300, color: "#3b82f6", currentStreak: 4 },
  { _id: "demo-2", title: "Reading", category: "Study", targetMinutesPerWeek: 120, color: "#10b981", currentStreak: 2 },
  { _id: "demo-3", title: "Exercise", category: "Health", targetMinutesPerWeek: 180, color: "#f59e0b", currentStreak: 6 },
];

const formatFocusTime = (hours = 0) => {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${Number(hours).toFixed(hours % 1 === 0 ? 0 : 1)}h`;
};

const getTodayLabel = () =>
  new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getBestDay = (weeklyData) => {
  if (!weeklyData?.length) return { day: "Today", hours: 0 };
  return weeklyData.reduce((best, day) => (day.hours > best.hours ? day : best), weeklyData[0]);
};

const Dashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [weeklyData, setWeeklyData] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedPlan, setCompletedPlan] = useState({});

  useEffect(() => {
    const savedPlan = localStorage.getItem("focusguard-daily-plan");
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      if (parsedPlan.date === getTodayKey()) {
        setCompletedPlan(parsedPlan.items || {});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "focusguard-daily-plan",
      JSON.stringify({ date: getTodayKey(), items: completedPlan })
    );
  }, [completedPlan]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, habitsRes] = await Promise.all([
          api.get("/analytics"),
          api.get("/habits"),
        ]);

        setStats(analyticsRes.data.stats || defaultStats);
        setWeeklyData(analyticsRes.data.weekly || []);
        setHabits(habitsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeHabits = habits.length ? habits : defaultHabits;
  const bestDay = useMemo(() => getBestDay(weeklyData), [weeklyData]);
  const totalWeeklyGoal = activeHabits.reduce((sum, habit) => sum + (Number(habit.targetMinutesPerWeek) || 0), 0);
  const weeklyGoalHours = Math.max(1, totalWeeklyGoal / 60);
  const weeklyFocusHours = weeklyData.reduce((sum, day) => sum + (Number(day.hours) || 0), 0);
  const weeklyProgress = Math.min(100, Math.round((weeklyFocusHours / weeklyGoalHours) * 100));
  const longestStreak = activeHabits.reduce((max, habit) => Math.max(max, habit.currentStreak || habit.longestStreak || 0), 0);
  const hasRealData = !loading && (stats.sessions > 0 || habits.length > 0);

  const dailyPlan = [
    {
      id: "intention",
      title: "Pick one clear intention",
      description: "Name the task before starting the timer.",
      icon: Sparkles,
    },
    {
      id: "session",
      title: "Complete one focus block",
      description: "Run a Pomodoro and protect the session.",
      icon: TimerReset,
    },
    {
      id: "review",
      title: "Review your momentum",
      description: "Check what improved and choose tomorrow's priority.",
      icon: BarChart3,
    },
  ];

  const togglePlanItem = (id) => {
    setCompletedPlan((current) => ({ ...current, [id]: !current[id] }));
  };

  const metricCards = [
    {
      label: "Success Rate",
      value: `${stats.successRate}%`,
      detail: stats.sessions ? "Completed focus sessions" : "Start a session to unlock this",
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Focus Sessions",
      value: stats.sessions,
      detail: "Total sessions logged",
      icon: Target,
      tone: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Focus Time",
      value: formatFocusTime(stats.focusTime),
      detail: "Deep work recorded",
      icon: Clock3,
      tone: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Best Streak",
      value: `${longestStreak}d`,
      detail: "Across your habits",
      icon: Flame,
      tone: "text-rose-600 bg-rose-500/10",
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1360px] flex-col gap-5 px-2 pb-24 pt-1 md:px-2 md:pb-10">
      <section className="overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="grid gap-5 p-4 md:p-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-between gap-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1.5">
                  <CalendarCheck size={14} />
                  {getTodayLabel()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1.5">
                  <TrendingUp size={14} />
                  {weeklyProgress}% weekly goal
                </span>
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-[var(--text)] md:text-5xl">
                Turn today into a focused win.
              </h1>
              <p className="mt-3 max-w-2xl text-base font-medium text-[var(--muted)] md:text-lg">
                Start with one intention, protect the next block, and keep your habits moving without digging through the app.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {dailyPlan.map((item) => {
                const Icon = item.icon;
                const completed = completedPlan[item.id];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePlanItem(item.id)}
                    className={`group flex min-h-[116px] flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      completed
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-[var(--border)] bg-[var(--input-bg)] hover:border-[var(--primary)]/40"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        completed ? "bg-emerald-500 text-white" : "bg-[var(--card)] text-[var(--primary)]"
                      }`}
                    >
                      <Icon size={19} />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-[var(--text)]">{item.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-relaxed text-[var(--muted)]">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--input-bg)] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">This week</p>
                <h2 className="text-2xl font-black text-[var(--text)]">{formatFocusTime(weeklyFocusHours)} focused</h2>
              </div>
              <Link
                to="/analytics"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--text)] px-4 py-2.5 text-sm font-bold text-[var(--card)] transition hover:opacity-90"
              >
                Insights <ArrowRight size={16} />
              </Link>
            </div>

            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12, fontWeight: 700 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      color: "var(--text)",
                      boxShadow: "0 16px 30px rgba(15, 23, 42, 0.12)",
                    }}
                  />
                  <Bar dataKey="hours" radius={[10, 10, 4, 4]} fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[132px] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]" />
            ))
          : metricCards.map((metric) => {
              const Icon = metric.icon;

              return (
                <article key={metric.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.tone}`}>
                      <Icon size={21} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{metric.label}</span>
                  </div>
                  <p className="text-3xl font-black leading-none text-[var(--text)]">{metric.value}</p>
                  <p className="mt-2 text-sm font-medium text-[var(--muted)]">{metric.detail}</p>
                </article>
              );
            })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm md:p-4">
          <FocusTimer />
        </div>

        <aside className="grid gap-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Next actions</p>
                <h2 className="text-xl font-black text-[var(--text)]">Keep the workflow moving</h2>
              </div>
              <ListChecks className="text-[var(--primary)]" size={24} />
            </div>

            <div className="grid gap-3">
              <Link
                to="/add-habit"
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-4 transition hover:border-[var(--primary)]/40"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] text-[var(--primary)]">
                    <Plus size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-[var(--text)]">Create or tune habits</span>
                    <span className="block text-xs font-medium text-[var(--muted)]">Set weekly targets and categories</span>
                  </span>
                </span>
                <ArrowRight size={18} className="text-[var(--muted)]" />
              </Link>

              <Link
                to="/analytics"
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-4 transition hover:border-[var(--primary)]/40"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card)] text-[var(--primary)]">
                    <BarChart3 size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-[var(--text)]">Review focus patterns</span>
                    <span className="block text-xs font-medium text-[var(--muted)]">Spot your strongest days</span>
                  </span>
                </span>
                <ArrowRight size={18} className="text-[var(--muted)]" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Habit pulse</p>
                <h2 className="text-xl font-black text-[var(--text)]">{activeHabits.length} active habits</h2>
              </div>
              <span className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1.5 text-xs font-bold text-[var(--muted)]">
                Best: {bestDay.day}
              </span>
            </div>

            <div className="grid gap-3">
              {activeHabits.slice(0, 3).map((habit) => {
                const goal = Number(habit.targetMinutesPerWeek) || 120;
                const progress = Math.min(100, Math.max(22, Math.round((stats.focusTime * 60 * 100) / Math.max(goal, 1))));

                return (
                  <div key={habit._id} className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: habit.color || "var(--primary)" }} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-[var(--text)]">{habit.title}</p>
                          <p className="text-xs font-medium text-[var(--muted)]">{habit.category || "General"} - {goal}m weekly</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[var(--muted)]">{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--card)]">
                      <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>

      {hasRealData && (
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Focus trend</p>
              <h2 className="text-xl font-black text-[var(--text)]">Weekly activity curve</h2>
            </div>
            <span className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-1.5 text-xs font-bold text-[var(--muted)]">
              Goal: {formatFocusTime(weeklyGoalHours)}
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardFocusHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.65} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 13, fontWeight: 700 }} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 13, fontWeight: 700 }} dx={-8} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    boxShadow: "0 16px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={3} fill="url(#dashboardFocusHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
