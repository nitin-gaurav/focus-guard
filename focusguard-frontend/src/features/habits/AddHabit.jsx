import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  Target,
  Clock, 
  Check, 
  List, 
  ArrowLeft, 
  Plus, 
  Activity,
  BarChart3
} from "lucide-react";
import HabitCard from "./components/HabitCard";
import "./AddHabit.css";

const CATEGORIES = ["Work", "Health", "Study", "Fitness", "Mindfulness", "Reading"];
const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#a855f7", "#f59e0b", "#ec4899"];

const formatLastActive = (isoDate, fallbackSeed) => {
  if (!isoDate) {
    const hours = (fallbackSeed % 48) + 1;
    return `${hours}h ago`;
  }

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const seedFromId = (id = "") => {
  return String(id)
    .split("")
    .reduce((sum, ch, index) => sum + ch.charCodeAt(0) * (index + 1), 0);
};

const buildHabitUiData = (habit, completionMap) => {
  const seed = seedFromId(habit._id || habit.title);
  const weeklyGoal = Number(habit.targetMinutesPerWeek) || 120;
  const completedMinutes = Math.min(
    weeklyGoal,
    Math.max(10, Math.round((weeklyGoal * ((seed % 70) + 30)) / 100))
  );

  const weeklyConsistency = Array.from({ length: 7 }, (_, i) => {
    const daySeed = (seed + i * 37) % 100;
    return Math.max(18, daySeed);
  });

  const completionPercent = Math.min(100, Math.round((completedMinutes / weeklyGoal) * 100));

  return {
    ...habit,
    completedMinutes,
    completionPercent,
    isCompletedToday: completionMap[habit._id] ?? false,
    weeklyConsistency,
    lastActiveLabel: formatLastActive(habit.updatedAt || habit.createdAt, seed),
  };
};

const HabitManager = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [completionMap, setCompletionMap] = useState({});
  const [draggedHabitId, setDraggedHabitId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "Work",
    targetMinutesPerWeek: 120,
    color: COLORS[0],
    icon: "Target",
  });

  const resetForm = () => {
    setForm({
      title: "",
      category: "Work",
      targetMinutesPerWeek: 120,
      color: COLORS[0],
      icon: "Target",
    });
    setEditingHabitId(null);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.error("Failed to load habits", err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return;

    setIsSubmitting(true);
    try {
      if (editingHabitId) {
        setHabits((currentHabits) =>
          currentHabits.map((habit) =>
            habit._id === editingHabitId
              ? { ...habit, ...form, targetMinutesPerWeek: Number(form.targetMinutesPerWeek) }
              : habit
          )
        );
        resetForm();
      } else {
        await api.post("/habits", { ...form, targetMinutesPerWeek: Number(form.targetMinutesPerWeek) });
        await fetchHabits();
        resetForm();
      }
    } catch (err) {
      console.error("Failed to save habit", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHabit = (id) => {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit._id !== id));
  };

  const editHabit = (habit) => {
    setForm({
      title: habit.title,
      category: habit.category,
      targetMinutesPerWeek: Number(habit.targetMinutesPerWeek),
      color: habit.color,
      icon: habit.icon || "Target",
    });
    setEditingHabitId(habit._id);
  };

  const toggleHabitCompletion = (habitId) => {
    setCompletionMap((current) => ({
      ...current,
      [habitId]: !current[habitId],
    }));
  };

  const onDragStart = (habitId) => {
    setDraggedHabitId(habitId);
  };

  const onDragOver = (event, targetHabitId) => {
    event.preventDefault();
    if (!draggedHabitId || draggedHabitId === targetHabitId) return;

    setHabits((currentHabits) => {
      const sourceIndex = currentHabits.findIndex((habit) => habit._id === draggedHabitId);
      const targetIndex = currentHabits.findIndex((habit) => habit._id === targetHabitId);

      if (sourceIndex === -1 || targetIndex === -1) return currentHabits;

      const reordered = [...currentHabits];
      const [draggedHabit] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, draggedHabit);
      return reordered;
    });
  };

  const onDragEnd = () => {
    setDraggedHabitId(null);
  };

  // Derived Analytics
  const totalWeeklyTarget = habits.reduce((acc, h) => acc + (Number(h.targetMinutesPerWeek) || 0), 0);
  const longestStreak = habits.reduce((acc, h) => Math.max(acc, h.longestStreak || 0), 0);
  const uiHabits = habits.map((habit) => buildHabitUiData(habit, completionMap));
  const completedMinutesThisWeek = uiHabits.reduce((acc, habit) => acc + habit.completedMinutes, 0);
  const weeklyConsistency = uiHabits.length
    ? Math.round(
        uiHabits.reduce(
          (acc, habit) => acc + habit.weeklyConsistency.reduce((sum, dayValue) => sum + dayValue, 0) / 7,
          0
        ) / uiHabits.length
      )
    : 0;

  return (
    <div className="max-w-[1160px] mx-auto px-4 pt-4 pb-5 md:px-6 md:pt-6 md:pb-8 w-full min-h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 flex shrink-0 items-center justify-center bg-[var(--card)] border border-[var(--border)] rounded-xl text-[var(--text)] hover:bg-[var(--input-bg)] hover:-translate-x-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/45"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <span className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <Target size={18} />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[1.9rem] leading-tight font-extrabold text-[var(--text)]">Habits Center</h1>
            <p className="text-[var(--muted)] text-sm md:text-[0.95rem] font-medium">Design your focus. Track your consistency.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-4 md:gap-5 items-start">
        {/* Left Side: Create Form */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-5 md:p-6 shadow-sm h-full">
          <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-[var(--text)] mb-5 pb-3 border-b border-[var(--border)]">
            <Plus size={20} className="text-[var(--primary)]" /> Create Habit
          </h3>

          <form onSubmit={submit} className="flex flex-col gap-4 md:gap-[1.1rem]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="habit-title" className="text-xs font-semibold tracking-wide uppercase text-[var(--muted)]">Habit Title</label>
              <input
                id="habit-title"
                type="text"
                placeholder="e.g., Deep Work, Reading, Coding"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[var(--input-bg)] border border-[var(--border)] px-3.5 py-3 rounded-xl text-[0.95rem] text-[var(--text)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="habit-category" className="text-xs font-semibold tracking-wide uppercase text-[var(--muted)]">Category</label>
                <select
                  id="habit-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] px-3.5 py-3 rounded-xl text-[0.95rem] text-[var(--text)] outline-none transition-all appearance-none cursor-pointer focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="weekly-goal" className="text-xs font-semibold tracking-wide uppercase text-[var(--muted)]">Weekly Goal (Mins)</label>
                <input
                  id="weekly-goal"
                  type="number"
                  min="10"
                  step="10"
                  value={form.targetMinutesPerWeek}
                  onChange={(e) => setForm({ ...form, targetMinutesPerWeek: e.target.value })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] px-3.5 py-3 rounded-xl text-[0.95rem] text-[var(--text)] outline-none transition-all focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-[var(--muted)]">Theme Color</label>
              <div className="flex gap-3 flex-wrap">
                {COLORS.map(color => (
                  <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    key={color}
                    type="button"
                    className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]"
                    style={{ backgroundColor: color }}
                    onClick={() => setForm({ ...form, color })}
                    aria-label={`Select ${color} color`}
                  >
                    {form.color === color && <Check size={18} className="text-white drop-shadow-md" />}
                  </Motion.button>
                ))}
              </div>
            </div>

            <div className="mt-1 flex items-center gap-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[var(--primary)] hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[var(--primary)]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]"
              >
                {isSubmitting ? "Saving..." : editingHabitId ? "Update Habit" : "Create Habit"}
              </button>

              {editingHabitId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--input-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/45"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Habit Management */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-5 md:p-6 shadow-sm flex flex-col min-h-[420px] xl:min-h-[calc(100vh-9rem)] xl:max-h-[calc(100vh-9rem)]">
          <div className="flex flex-wrap justify-between gap-3 items-center mb-4 pb-3 border-b border-[var(--border)]">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-[var(--text)]">
              <List size={20} className="text-[var(--primary)]" /> Your Habits
            </h3>

            <div className="flex items-center gap-2 text-xs md:text-[0.78rem] font-semibold text-[var(--muted)]">
              <span className="flex items-center gap-1.5 bg-[var(--input-bg)] border border-[var(--border)] px-2.5 py-1 rounded-lg"><Activity size={12}/> {habits.length} active</span>
              <span className="flex items-center gap-1.5 bg-[var(--input-bg)] border border-[var(--border)] px-2.5 py-1 rounded-lg"><Clock size={12}/> {totalWeeklyTarget}m weekly</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5">
              <p className="text-[0.7rem] uppercase tracking-wide text-[var(--muted)] font-semibold">Active Habits</p>
              <p className="text-base md:text-lg font-bold text-[var(--text)]">{habits.length}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5">
              <p className="text-[0.7rem] uppercase tracking-wide text-[var(--muted)] font-semibold">Longest Streak</p>
              <p className="text-base md:text-lg font-bold text-[var(--text)]">{longestStreak}d</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5">
              <p className="text-[0.7rem] uppercase tracking-wide text-[var(--muted)] font-semibold">Completed This Week</p>
              <p className="text-base md:text-lg font-bold text-[var(--text)]">{completedMinutesThisWeek}m</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2.5">
              <p className="text-[0.7rem] uppercase tracking-wide text-[var(--muted)] font-semibold">Consistency</p>
              <p className="text-base md:text-lg font-bold text-[var(--text)] flex items-center gap-1"><BarChart3 size={14} className="text-[var(--primary)]" /> {weeklyConsistency}%</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1.5 pb-1.5 custom-scrollbar">
            {loading ? (
              <div className="space-y-3">
                <div className="h-36 bg-[var(--input-bg)] animate-pulse rounded-2xl border border-[var(--border)]"></div>
                <div className="h-36 bg-[var(--input-bg)] animate-pulse rounded-2xl border border-[var(--border)]"></div>
              </div>
            ) : habits.length === 0 ? (
              <Motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full min-h-[280px] flex flex-col items-center justify-center text-center text-[var(--muted)] border border-dashed border-[var(--border)] rounded-2xl bg-[var(--input-bg)]"
              >
                <div className="w-14 h-14 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mb-3">
                  <Target size={26} />
                </div>
                <h4 className="text-lg font-bold text-[var(--text)] mb-1">No habits yet</h4>
                <p className="max-w-sm text-sm px-5">Create your first habit to begin building consistency.</p>
              </Motion.div>
            ) : (
              <Motion.div layout className="flex flex-col gap-3">
                <AnimatePresence>
                  {uiHabits.map((habit) => (
                    <HabitCard
                      key={habit._id}
                      habit={habit}
                      isDragging={draggedHabitId === habit._id}
                      onDelete={deleteHabit}
                      onEdit={editHabit}
                      onToggleComplete={toggleHabitCompletion}
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDragEnd={onDragEnd}
                    />
                  ))}
                </AnimatePresence>
              </Motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HabitManager;
