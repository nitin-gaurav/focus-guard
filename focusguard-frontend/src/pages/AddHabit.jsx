import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import api from "../api/axios";
import "./AddHabit.css";

const AddHabit = () => {
  const [form, setForm] = useState({
    habitName: "",
    duration: "",
    timeSlot: "",
    trigger: "",
    mood: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/habits/log", {
      ...form,
      duration: Number(form.duration),
    });
    alert("Habit saved");
  };

  return (
    <DashboardLayout>
      <h1>Add Habit</h1>

      <div className="card add-habit-card">
        <form onSubmit={submit} className="add-habit-form">
          <input
            placeholder="Habit name"
            onChange={(e) =>
              setForm({ ...form, habitName: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />

          <select
            onChange={(e) =>
              setForm({ ...form, timeSlot: e.target.value })
            }
          >
            <option value="">Select time slot</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Night</option>
          </select>

          <input
            placeholder="Trigger (optional)"
            onChange={(e) =>
              setForm({ ...form, trigger: e.target.value })
            }
          />

          <input
            placeholder="Mood (optional)"
            onChange={(e) =>
              setForm({ ...form, mood: e.target.value })
            }
          />

          <button>Save Habit</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddHabit;
