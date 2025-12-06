"use client";
import { useState, useEffect } from "react";
import DateNavigator from "@/components/dashboard/DateNavigator";
import HabitList from "@/components/dashboard/HabitList";
import { useDateCompletions } from "@/hooks/useDateCompletions";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/contexts/auth";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const dateString = formatDate(currentDate);

  // Fetch completions for the selected date
  const { completions, loading: completionsLoading } = useDateCompletions(dateString);

  // Note: We don't block UI on loading completions to keep it snappy.
  // HabitList handles empty/loading state gracefully (or treats missing as unchecked).

  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 pb-20 md:pb-4">
      <PageHeader 
        title={`${getGreeting()}, ${user?.displayName?.split(" ")[0] || "there"}`} 
        description="Here's your overview for today."
      />

      <div className="space-y-4">
        <DateNavigator currentDate={currentDate} onDateChange={setCurrentDate} />

        <HabitList
          completions={completions}
          currentDate={dateString}
        />
      </div>
    </div>
  );
}
