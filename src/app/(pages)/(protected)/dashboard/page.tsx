"use client";
import { useState, useEffect } from "react";
import DateNavigator from "@/components/dashboard/DateNavigator";
import HabitList from "@/components/dashboard/HabitList";

export const mockHabits = [
  {
    id: "habit1",
    name: "Eat Breakfast",
    frequency: "daily", // could be "daily" or "weekly"
    createdAt: "2025-08-01",
    disabledAt: null,
  },
  {
    id: "habit2",
    name: "LeetCode Problem",
    frequency: "daily",
    createdAt: "2025-08-10",
    disabledAt: null,
  },
  {
    id: "habit3",
    name: "Pushups",
    frequency: "daily",
    createdAt: "2025-08-05",
    disabledAt: "2025-08-25", // disabled → should show only for days before this
  },
  {
    id: "habit4",
    name: "Clean Room",
    frequency: "weekly",
    createdAt: "2025-08-15",
    disabledAt: null,
  },
];

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<any[]>([]);
  const [completions, setCompletions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚧 replace with Firebase later
    setHabits(mockHabits);
    setLoading(false);
  }, [currentDate]); // will re-run when the date changes

  // Format date as YYYY-MM-DD (for Firestore keys)
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      {/* Date Navigation */}
      <DateNavigator currentDate={currentDate} onDateChange={setCurrentDate} />

      {/* Habit List for the Day */}
      <HabitList
        habits={habits}
        completions={completions}
        currentDate={formatDate(currentDate)}
      />
    </div>
  );
}
