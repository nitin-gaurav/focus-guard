import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  MoreVertical,
  Edit2,
  Trash2,
  GripVertical,
  CheckCircle2,
  Circle,
  Clock3,
  Dumbbell,
  Brain,
  BriefcaseBusiness,
  BookOpen,
  HeartPulse,
  Target,
} from "lucide-react";

const CATEGORY_ICONS = {
  Work: BriefcaseBusiness,
  Health: HeartPulse,
  Study: BookOpen,
  Fitness: Dumbbell,
  Mindfulness: Brain,
  Reading: BookOpen,
};

const HabitCard = ({
  habit,
  isDragging,
  onDelete,
  onEdit,
  onToggleComplete,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const [showActions, setShowActions] = useState(false);
  const CategoryIcon = CATEGORY_ICONS[habit.category] || Target;

  return (
    <Motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2, scale: 1.006 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-4 md:p-5 shadow-sm hover:shadow-md transition-all"
      style={{ borderLeft: `4px solid ${habit.color}`, opacity: isDragging ? 0.45 : 1 }}
      draggable
      onDragStart={() => onDragStart(habit._id)}
      onDragOver={(event) => onDragOver(event, habit._id)}
      onDragEnd={onDragEnd}
      aria-label={`Habit ${habit.title}`}
    >
      <div className="flex items-start justify-between gap-2.5 mb-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <button
            type="button"
            className="mt-0.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/45 rounded-md"
            aria-label="Reorder habit"
            title="Drag to reorder"
          >
            <GripVertical size={15} />
          </button>

          <button
            type="button"
            onClick={() => onToggleComplete(habit._id)}
            className="mt-0.5 text-[var(--muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/45 rounded-md"
            aria-label={habit.isCompletedToday ? "Mark incomplete" : "Mark completed"}
          >
            {habit.isCompletedToday ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <Circle size={18} />
            )}
          </button>

          <div className="min-w-0">
            <h4 className="text-[0.98rem] md:text-base font-bold text-[var(--text)] leading-tight truncate">
              {habit.title}
            </h4>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 text-[0.66rem] md:text-[0.68rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ color: habit.color, backgroundColor: `${habit.color}1A` }}
              >
                <CategoryIcon size={11} />
                {habit.category}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions((open) => !open)}
            className="p-1.5 text-[var(--muted)] hover:bg-[var(--card)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/45"
            aria-label="Open habit actions"
          >
            <MoreVertical size={17} />
          </button>

          <AnimatePresence>
            {showActions && (
              <Motion.div
                initial={{ opacity: 0, scale: 0.94, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                className="absolute right-0 top-8 w-36 bg-[var(--card)] border border-[var(--border)] shadow-xl rounded-xl overflow-hidden z-20"
              >
                <button
                  type="button"
                  onClick={() => {
                    onEdit(habit);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--input-bg)] transition-colors focus-visible:outline-none focus-visible:bg-[var(--input-bg)]"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(habit._id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[0.77rem] text-[var(--muted)] mb-2.5">
        <p className="font-medium">Goal: {habit.targetMinutesPerWeek} mins</p>
        <p className="font-medium text-right">{habit.completedMinutes} / {habit.targetMinutesPerWeek} mins</p>
      </div>

      <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden mb-2">
        <Motion.div
          initial={{ width: 0 }}
          animate={{ width: `${habit.completionPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: habit.color }}
        />
      </div>

      <div className="flex items-center justify-between text-[0.75rem] text-[var(--muted)] mb-2.5">
        <span className="font-semibold">{habit.completionPercent}% complete</span>
        <span className="inline-flex items-center gap-1 text-orange-500 font-semibold">
          <Flame size={13} /> {habit.currentStreak || 0} day streak
        </span>
      </div>

      <div className="mb-2.5">
        <p className="text-[0.72rem] uppercase tracking-wide text-[var(--muted)] font-semibold mb-1.5">
          Weekly consistency
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {habit.weeklyConsistency.map((value, index) => (
            <div
              key={`${habit._id}-${index}`}
              className="h-6 rounded-md border border-[var(--border)] bg-[var(--card)] overflow-hidden"
              aria-label={`Consistency day ${index + 1}: ${value}%`}
            >
              <div
                className="h-full rounded-md"
                style={{
                  height: `${value}%`,
                  background: `linear-gradient(180deg, ${habit.color}, ${habit.color}AA)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[0.72rem] text-[var(--muted)]">
        <span className="inline-flex items-center gap-1">
          <Clock3 size={12} /> Last active {habit.lastActiveLabel}
        </span>
        <span className="font-semibold" style={{ color: habit.color }}>
          In progress
        </span>
      </div>
    </Motion.article>
  );
};

export default HabitCard;
