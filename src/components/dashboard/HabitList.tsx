// app/dashboard/HabitList.tsx
"use client";

import HabitItem from "./HabitItem";

interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  createdAt: string;
  disabledAt: string | null;
}

interface HabitListProps {
  habits: Habit[];
  completions: Record<string, any>;
  currentDate: string; // YYYY-MM-DD
}

export default function HabitList({
  habits,
  completions,
  currentDate,
}: HabitListProps) {
  if (!habits || habits.length === 0) {
    return (
      <div className="text-center text-gray-500 p-6">
        No habits yet. Add one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {habits.map((habit) => {
        // Check if habit should be visible for this date
        const created = new Date(habit.createdAt);
        const disabled = habit.disabledAt ? new Date(habit.disabledAt) : null;
        const current = new Date(currentDate);

        const isVisible =
          created <= current && (!disabled || current < disabled);

        if (!isVisible) return null;

        // Grab completion state
        const completed = completions[habit.id]?.done ?? false;

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            completed={completed}
            currentDate={currentDate}
          />
        );
      })}
    </div>
  );
}
