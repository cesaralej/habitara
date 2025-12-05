"use client";
import { useState, useEffect } from "react";
import DateNavigator from "@/components/dashboard/DateNavigator";
import HabitList from "@/components/dashboard/HabitList";
import { useDateCompletions } from "@/hooks/useDateCompletions";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const dateString = formatDate(currentDate);

  // Fetch completions for the selected date
  const { completions, loading: completionsLoading } = useDateCompletions(dateString);

  // Note: We don't block UI on loading completions to keep it snappy.
  // HabitList handles empty/loading state gracefully (or treats missing as unchecked).

  return (
    <div className="p-4 space-y-4">
      <DateNavigator currentDate={currentDate} onDateChange={setCurrentDate} />

      <HabitList
        completions={completions}
        currentDate={dateString}
      />
    </div>
  );
}
