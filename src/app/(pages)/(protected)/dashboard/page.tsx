"use client";
import { useState, useEffect } from "react";
import DateNavigator from "@/components/dashboard/DateNavigator";
import HabitList from "@/components/dashboard/HabitList";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<any[]>([]);
  const [completions, setCompletions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚧 replace with Firebase later
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
        completions={completions}
        currentDate={formatDate(currentDate)}
      />
    </div>
  );
}
